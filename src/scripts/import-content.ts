/**
 * Imports the export-content.ts dump into whichever database --env-file points at.
 *
 * Dry run unless --commit is passed: prints exactly what it would write, because
 * the target here is production.
 *
 * Three things it is careful about:
 *
 * 1. It never deletes. The home page global references courses by id, so removing
 *    the seeded course would null those references. The lowest-id existing course
 *    is updated in place instead, and the rest are created.
 *
 * 2. Page relationships arrive as {__pageSlug} and are resolved against *this*
 *    database's pages. An unresolvable slug becomes null rather than a wrong id.
 *
 * 3. Localized arrays are written with the ids Payload assigned during the
 *    Bulgarian pass. Sending an array without ids on the English pass makes
 *    Payload create fresh rows, orphaning the Bulgarian text — the same trap that
 *    once emptied the seeded list blocks.
 */
import { getPayload } from 'payload'
import { readFileSync } from 'fs'
import config from '../payload.config'

const COMMIT = process.argv.includes('--commit')
const file = process.argv.find((a) => a.endsWith('.json'))
if (!file) {
  console.error('usage: import-content <input.json> [--commit]')
  process.exit(1)
}

type Dump = {
  courses: { sourceId: number; bg: Record<string, unknown>; en: Record<string, unknown> }[]
  reviews: { sourceId: number; bg: Record<string, unknown>; en: Record<string, unknown> }[]
}
const dump = JSON.parse(readFileSync(file, 'utf8')) as Dump

const payload = await getPayload({ config })

const pages = await payload.find({
  collection: 'pages',
  limit: 200,
  locale: 'bg',
  overrideAccess: true,
  depth: 0,
})
const idBySlug = new Map<string, number>()
for (const page of pages.docs) if (page.slug) idBySlug.set(page.slug, page.id as number)

const unresolved: string[] = []
const resolveRefs = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(resolveRefs)
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.__pageSlug === 'string') {
      const id = idBySlug.get(obj.__pageSlug)
      if (id === undefined) unresolved.push(obj.__pageSlug)
      return id ?? null
    }
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, resolveRefs(v)]))
  }
  return value
}

/** Copies ids from a saved doc onto the same positions of an incoming payload. */
const withIds = (saved: unknown, incoming: unknown): unknown => {
  if (Array.isArray(incoming) && Array.isArray(saved)) {
    return incoming.map((item, i) => {
      const merged = withIds(saved[i], item)
      const savedId = (saved[i] as Record<string, unknown> | undefined)?.id
      return savedId !== undefined && merged && typeof merged === 'object'
        ? { ...(merged as Record<string, unknown>), id: savedId }
        : merged
    })
  }
  if (incoming && typeof incoming === 'object' && saved && typeof saved === 'object') {
    const s = saved as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(incoming as Record<string, unknown>).map(([k, v]) => [k, withIds(s[k], v)]),
    )
  }
  return incoming
}

const existingCourses = await payload.find({
  collection: 'courses',
  limit: 200,
  sort: 'id',
  locale: 'bg',
  overrideAccess: true,
  depth: 0,
})
const existingReviews = await payload.find({
  collection: 'reviews',
  limit: 200,
  sort: 'id',
  locale: 'bg',
  overrideAccess: true,
  depth: 0,
})

console.log(`\n▸ ${COMMIT ? 'IMPORTING' : 'DRY RUN — nothing will be written'}\n`)
console.log(`  target has ${existingCourses.totalDocs} course(s), ${existingReviews.totalDocs} review(s)`)
console.log(`  dump has   ${dump.courses.length} course(s), ${dump.reviews.length} review(s)\n`)

/**
 * Courses are matched on title + start date, so a second run updates rather than
 * duplicating. Title alone is not enough: two of them are both called
 * "Swing танци за начинаещи" and differ only by when they start.
 */
const courseKey = (c: Record<string, unknown>) =>
  `${String(c.title ?? '').trim()}|${c.startDate ?? ''}`

const claimed = new Set<number>()
const targetFor = new Map<number, number>() // dump index → existing course id

// Exact matches first, so a re-run lands on the same rows.
dump.courses.forEach((course, index) => {
  const key = courseKey(course.bg)
  const hit = existingCourses.docs.find(
    (d) => !claimed.has(d.id as number) && courseKey(d as unknown as Record<string, unknown>) === key,
  )
  if (hit) {
    targetFor.set(index, hit.id as number)
    claimed.add(hit.id as number)
  }
})

// Then adopt a same-titled leftover — on the first run that is the seeded
// placeholder, which the home page global references by id and must not be
// orphaned by creating a parallel course beside it.
dump.courses.forEach((course, index) => {
  if (targetFor.has(index)) return
  const title = String(course.bg.title ?? '').trim()
  const spare = existingCourses.docs.find(
    (d) =>
      !claimed.has(d.id as number) &&
      String((d as unknown as Record<string, unknown>).title ?? '').trim() === title,
  )
  if (spare) {
    targetFor.set(index, spare.id as number)
    claimed.add(spare.id as number)
  }
})

const plan: string[] = []
dump.courses.forEach((course, index) => {
  const title = String(course.bg.title ?? '?')
  const id = targetFor.get(index)
  plan.push(id !== undefined ? `  UPDATE course #${id} ← "${title}"` : `  CREATE course      ← "${title}"`)
})

const reviewKey = (r: Record<string, unknown>) => `${r.author ?? ''}|${String(r.quote ?? '').slice(0, 40)}`
const haveReview = new Set(
  existingReviews.docs.map((d) => reviewKey(d as unknown as Record<string, unknown>)),
)
dump.reviews.forEach((review) => {
  const key = reviewKey(review.bg)
  plan.push(
    haveReview.has(key)
      ? `  SKIP   review        (already present) "${review.bg.author}"`
      : `  CREATE review      ← "${review.bg.author}"`,
  )
})
plan.forEach((line) => console.log(line))

// Resolve page refs before reporting, so unresolved slugs surface in the dry run.
for (const c of dump.courses) {
  c.bg = resolveRefs(c.bg) as Record<string, unknown>
  c.en = resolveRefs(c.en) as Record<string, unknown>
}
if (unresolved.length > 0) {
  console.log(`\n  ⚠ page slug(s) not found in this database, set to null: ${[...new Set(unresolved)].join(', ')}`)
}

if (!COMMIT) {
  console.log('\n  Re-run with --commit to apply.\n')
  await payload.db.destroy?.()
  process.exit(0)
}

const writeBoth = async (collection: 'courses' | 'reviews', id: number, bg: Record<string, unknown>, en: Record<string, unknown>) => {
  const saved = await payload.update({ collection, id, locale: 'bg', data: bg as never, overrideAccess: true, depth: 0 })
  const merged = withIds(saved, en) as Record<string, unknown>
  await payload.update({ collection, id, locale: 'en', data: merged as never, overrideAccess: true, depth: 0 })
}

for (const [index, course] of dump.courses.entries()) {
  const existingId = targetFor.get(index)
  if (existingId !== undefined) {
    await writeBoth('courses', existingId, course.bg, course.en)
    console.log(`  updated course #${existingId} "${course.bg.title}"`)
  } else {
    const created = await payload.create({ collection: 'courses', locale: 'bg', data: course.bg as never, overrideAccess: true, depth: 0 })
    await writeBoth('courses', created.id as number, course.bg, course.en)
    console.log(`  created course #${created.id} "${course.bg.title}"`)
  }
}

for (const review of dump.reviews) {
  if (haveReview.has(reviewKey(review.bg))) {
    console.log(`  skipped review "${review.bg.author}"`)
    continue
  }
  const created = await payload.create({ collection: 'reviews', locale: 'bg', data: review.bg as never, overrideAccess: true, depth: 0 })
  await writeBoth('reviews', created.id as number, review.bg, review.en)
  console.log(`  created review #${created.id} "${review.bg.author}"`)
}

console.log('\n✓ Imported. The deployed site is prerendered — redeploy to see it.\n')
await payload.db.destroy?.()
process.exit(0)
