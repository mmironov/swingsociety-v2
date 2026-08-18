/**
 * Exports Courses and Reviews from whichever database the --env-file points at.
 *
 * Two processes rather than one, because a Payload config binds to a single
 * DATABASE_URI at import time — so local and production cannot be opened
 * together. Export here, import with the other script.
 *
 * Page relationships are exported as *slugs*, not ids: row ids differ between
 * databases, so an id copied across would point at an unrelated page or nothing.
 */
import { getPayload } from 'payload'
import { writeFileSync } from 'fs'
import config from '../payload.config'
import type { Course, Review } from '../payload-types'

const LOCALES = ['bg', 'en'] as const
const out = process.argv[2]
if (!out) {
  console.error('usage: export-content <output.json>')
  process.exit(1)
}

const payload = await getPayload({ config })

/** Local page id → its Bulgarian slug, for turning ids into portable keys. */
const pages = await payload.find({
  collection: 'pages',
  limit: 200,
  locale: 'bg',
  overrideAccess: true,
  depth: 0,
})
const slugById = new Map<number, string>()
for (const page of pages.docs) {
  if (page.slug) slugById.set(page.id as number, page.slug)
}

const asSlugRef = (value: unknown): unknown => {
  if (typeof value !== 'number') return value ?? null
  const slug = slugById.get(value)
  return slug ? { __pageSlug: slug } : null
}

const strip = (doc: Record<string, unknown>) => {
  const { id, createdAt, updatedAt, ...rest } = doc
  return rest
}

const courses: Record<string, unknown>[] = []
for (const locale of LOCALES) {
  const found = await payload.find({
    collection: 'courses',
    limit: 200,
    sort: 'id',
    locale,
    overrideAccess: true,
    depth: 0,
  })
  found.docs.forEach((doc, index) => {
    const data = strip(doc as unknown as Record<string, unknown>) as Record<string, unknown>
    data.page = asSlugRef((doc as Course).page as unknown)
    const registration = data.registration as Record<string, unknown> | undefined
    if (registration) registration.page = asSlugRef(registration.page)
    courses[index] ??= { sourceId: doc.id }
    ;(courses[index] as Record<string, unknown>)[locale] = data
  })
}

const reviews: Record<string, unknown>[] = []
for (const locale of LOCALES) {
  const found = await payload.find({
    collection: 'reviews',
    limit: 200,
    sort: 'id',
    locale,
    overrideAccess: true,
    depth: 0,
  })
  found.docs.forEach((doc, index) => {
    reviews[index] ??= { sourceId: doc.id }
    ;(reviews[index] as Record<string, unknown>)[locale] = strip(
      doc as unknown as Record<string, unknown>,
    )
  })
}

writeFileSync(out, JSON.stringify({ courses, reviews }, null, 2), 'utf8')
console.log(`  exported ${courses.length} course(s) and ${reviews.length} review(s) → ${out}`)
for (const c of courses) console.log(`    course #${c.sourceId} "${(c.bg as Course).title}"`)
for (const r of reviews) console.log(`    review #${r.sourceId} ${(r.bg as Review).author}`)

await payload.db.destroy?.()
process.exit(0)
