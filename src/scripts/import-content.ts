/**
 * Imports an export-content.ts dump into whichever database --env-file points at.
 *
 * Dry run unless --commit, because the usual target is production.
 *
 * What it is careful about:
 *
 * 1. Nothing is deleted. The home page global references courses by id, so the
 *    seeded course is adopted and updated rather than left beside a copy.
 * 2. Courses match on title plus start date. Title alone collides — two are both
 *    "Swing танци за начинаещи" — so a re-run updates instead of duplicating.
 * 3. References arrive as content-derived keys and are resolved against this
 *    database. Anything unresolvable is written as null and reported, never guessed.
 * 4. Localized arrays are written with the ids Payload assigned on the Bulgarian
 *    pass. Without them Payload creates fresh rows and orphans the Bulgarian text.
 * 5. Globals are written last, so their course references can resolve to rows
 *    created earlier in the same run.
 */
import { getPayload } from 'payload'
import { readFileSync } from 'fs'
import config from '../payload.config'
import {
  collectionRefPaths,
  courseKey,
  decodeRef,
  globalRefPaths,
  mapRefs,
  mediaKey,
} from './refs'

const COMMIT = process.argv.includes('--commit')
const file = process.argv.find((a) => a.endsWith('.json'))
if (!file) {
  console.error('usage: import-content <input.json> [--commit]')
  process.exit(1)
}

type Row = { sourceId: number; bg: Record<string, unknown>; en: Record<string, unknown> }
type Dump = {
  courses: Row[]
  reviews: Row[]
  globals?: Record<string, Record<string, Record<string, unknown>>>
}
const dump = JSON.parse(readFileSync(file, 'utf8')) as Dump

const payload = await getPayload({ config })

// ─── portable key → id in THIS database ──────────────────────────────────────
const idByKey = new Map<string, number>()
for (const doc of (await payload.find({ collection: 'media', limit: 500, overrideAccess: true, depth: 0 })).docs) {
  if (doc.filename) idByKey.set(`media:${mediaKey(doc.filename)}`, doc.id as number)
}
for (const doc of (await payload.find({ collection: 'pages', limit: 500, locale: 'bg', overrideAccess: true, depth: 0 })).docs) {
  if (doc.slug) idByKey.set(`pages:${doc.slug}`, doc.id as number)
}
const existingCourses = (
  await payload.find({ collection: 'courses', limit: 500, sort: 'id', locale: 'bg', overrideAccess: true, depth: 0 })
).docs
for (const doc of existingCourses) {
  idByKey.set(`courses:${courseKey(doc as unknown as Record<string, unknown>)}`, doc.id as number)
}

const unresolved: string[] = []
const resolve = (value: unknown): unknown => {
  const ref = decodeRef(value)
  if (!ref) return value ?? null
  const id = idByKey.get(`${ref.relationTo}:${ref.key}`)
  if (id === undefined) {
    unresolved.push(`${ref.relationTo}:${ref.key}`)
    return null
  }
  return id
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

/**
 * Array paths where the incoming data holds fewer rows than the target already has.
 *
 * This exists because of a real incident: a bug turned each video tile object into
 * a dangling reference, the array arrived as nulls, and the home page's three
 * videos were silently deleted — in the source database first, then propagated to
 * production. Every check in place at the time passed, because they compared the
 * source against itself after it was already damaged.
 *
 * A shrinking array is not always wrong — someone may genuinely have deleted a FAQ
 * row — so this reports rather than assumes, and --allow-removals proceeds.
 */
const shrinkingArrays = (
  target: unknown,
  incoming: unknown,
  path = '',
): { path: string; from: number; to: number }[] => {
  const found: { path: string; from: number; to: number }[] = []

  if (Array.isArray(target)) {
    const to = Array.isArray(incoming) ? incoming.length : 0
    if (to < target.length) found.push({ path: path || '(root)', from: target.length, to })
    if (Array.isArray(incoming)) {
      const pairs = Math.min(target.length, incoming.length)
      for (let i = 0; i < pairs; i++) {
        found.push(...shrinkingArrays(target[i], incoming[i], `${path}[${i}]`))
      }
    }
    return found
  }

  if (target && typeof target === 'object' && incoming && typeof incoming === 'object') {
    for (const [key, value] of Object.entries(target as Record<string, unknown>)) {
      found.push(
        ...shrinkingArrays(value, (incoming as Record<string, unknown>)[key], path ? `${path}.${key}` : key),
      )
    }
  }

  return found
}

const ALLOW_REMOVALS = process.argv.includes('--allow-removals')

const coursePaths = collectionRefPaths(payload.config, 'courses')
const reviewPaths = collectionRefPaths(payload.config, 'reviews')
const resolveDoc = (doc: Record<string, unknown>, paths: ReturnType<typeof collectionRefPaths>) =>
  mapRefs(doc, paths, resolve) as Record<string, unknown>

// ─── plan ────────────────────────────────────────────────────────────────────
const existingReviews = (
  await payload.find({ collection: 'reviews', limit: 500, sort: 'id', locale: 'bg', overrideAccess: true, depth: 0 })
).docs

console.log(`\n▸ ${COMMIT ? 'IMPORTING' : 'DRY RUN — nothing will be written'}\n`)
console.log(`  target: ${existingCourses.length} course(s), ${existingReviews.length} review(s)`)
console.log(`  dump:   ${dump.courses.length} course(s), ${dump.reviews.length} review(s), ${Object.keys(dump.globals ?? {}).length} global(s)\n`)

const claimed = new Set<number>()
const targetFor = new Map<number, number>()

// Exact key matches first, so a re-run lands on the same rows.
dump.courses.forEach((course, index) => {
  const key = courseKey(course.bg)
  const hit = existingCourses.find(
    (d) => !claimed.has(d.id as number) && courseKey(d as unknown as Record<string, unknown>) === key,
  )
  if (hit) {
    targetFor.set(index, hit.id as number)
    claimed.add(hit.id as number)
  }
})

// Then adopt a same-titled leftover — on a first run that is the seeded
// placeholder, which the home page references by id.
dump.courses.forEach((course, index) => {
  if (targetFor.has(index)) return
  const title = String(course.bg.title ?? '').trim()
  const spare = existingCourses.find(
    (d) =>
      !claimed.has(d.id as number) &&
      String((d as unknown as Record<string, unknown>).title ?? '').trim() === title,
  )
  if (spare) {
    targetFor.set(index, spare.id as number)
    claimed.add(spare.id as number)
  }
})

const reviewKey = (r: Record<string, unknown>) =>
  `${r.author ?? ''}|${String(r.quote ?? '').slice(0, 40)}`
const haveReview = new Set(
  existingReviews.map((d) => reviewKey(d as unknown as Record<string, unknown>)),
)

dump.courses.forEach((course, index) => {
  const id = targetFor.get(index)
  console.log(
    id !== undefined
      ? `  UPDATE course #${id} ← "${course.bg.title}"`
      : `  CREATE course      ← "${course.bg.title}"`,
  )
})
dump.reviews.forEach((review) => {
  console.log(
    haveReview.has(reviewKey(review.bg))
      ? `  SKIP   review        "${review.bg.author}" (already present)`
      : `  CREATE review      ← "${review.bg.author}"`,
  )
})
for (const slug of Object.keys(dump.globals ?? {})) console.log(`  UPDATE global  ${slug}`)

// Resolve everything now so unresolved references surface before any write.
for (const course of dump.courses) {
  course.bg = resolveDoc(course.bg, coursePaths)
  course.en = resolveDoc(course.en, coursePaths)
}
for (const review of dump.reviews) {
  review.bg = resolveDoc(review.bg, reviewPaths)
  review.en = resolveDoc(review.en, reviewPaths)
}
const resolvedGlobals: Record<string, { bg: Record<string, unknown>; en: Record<string, unknown> }> = {}
for (const [slug, byLocale] of Object.entries(dump.globals ?? {})) {
  const paths = globalRefPaths(payload.config, slug)
  resolvedGlobals[slug] = {
    bg: mapRefs(byLocale.bg, paths, resolve) as Record<string, unknown>,
    en: mapRefs(byLocale.en, paths, resolve) as Record<string, unknown>,
  }
}

if (unresolved.length > 0) {
  console.log(`\n  ⚠ ${new Set(unresolved).size} unresolved reference(s), would be written as null:`)
  for (const ref of [...new Set(unresolved)]) console.log(`      ${ref}`)
}

// Compare against what each global currently holds, before overwriting it.
const removals: string[] = []
for (const [slug, byLocale] of Object.entries(resolvedGlobals)) {
  for (const locale of ['bg', 'en'] as const) {
    const current = await payload.findGlobal({
      slug: slug as 'home-page',
      locale,
      overrideAccess: true,
      depth: 0,
    })
    for (const loss of shrinkingArrays(current, byLocale[locale])) {
      removals.push(`${slug} [${locale}] ${loss.path}: ${loss.from} → ${loss.to}`)
    }
  }
}

if (removals.length > 0) {
  console.log(`\n  ⚠ this would REMOVE rows that exist in the target:`)
  for (const line of removals) console.log(`      ${line}`)
  if (COMMIT && !ALLOW_REMOVALS) {
    console.log(
      '\n✗ Refusing to write. If the removals are intended, re-run with --allow-removals.\n' +
        '  If they are not, your source database is probably missing content it should have.\n',
    )
    await payload.db.destroy?.()
    process.exit(1)
  }
}

if (!COMMIT) {
  console.log('\n  Re-run with --commit to apply.\n')
  await payload.db.destroy?.()
  process.exit(0)
}

// ─── write ───────────────────────────────────────────────────────────────────
const writeBoth = async (
  collection: 'courses' | 'reviews',
  id: number,
  bg: Record<string, unknown>,
  en: Record<string, unknown>,
) => {
  const saved = await payload.update({ collection, id, locale: 'bg', data: bg as never, overrideAccess: true, depth: 0 })
  await payload.update({ collection, id, locale: 'en', data: withIds(saved, en) as never, overrideAccess: true, depth: 0 })
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

for (const [slug, byLocale] of Object.entries(resolvedGlobals)) {
  const saved = await payload.updateGlobal({ slug: slug as 'home-page', locale: 'bg', data: byLocale.bg as never, overrideAccess: true, depth: 0 })
  await payload.updateGlobal({ slug: slug as 'home-page', locale: 'en', data: withIds(saved, byLocale.en) as never, overrideAccess: true, depth: 0 })
  console.log(`  updated global ${slug}`)
}

console.log('\n✓ Imported. The deployed site is prerendered — redeploy to see it.\n')
await payload.db.destroy?.()
process.exit(0)
