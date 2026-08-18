/**
 * Exports Courses, Reviews and the three globals from whichever database
 * --env-file points at.
 *
 * Export and import are separate processes because a Payload config binds to one
 * DATABASE_URI at import time, so both databases cannot be open together.
 *
 * Relationships are rewritten to content-derived keys, since row ids differ
 * between databases and a copied id points at something unrelated. Which fields
 * are relationships comes from the Payload schema — see refs.ts for why guessing
 * from the value's shape is not good enough.
 */
import { getPayload } from 'payload'
import { writeFileSync } from 'fs'
import config from '../payload.config'
import {
  collectionRefPaths,
  courseKey,
  encodeRef,
  globalRefPaths,
  mapRefs,
  mediaKey,
  stripMeta,
} from './refs'

const LOCALES = ['bg', 'en'] as const
const COLLECTIONS = ['courses', 'reviews'] as const
const GLOBALS = ['home-page', 'schedule-page', 'site-settings'] as const

const out = process.argv[2]
if (!out) {
  console.error('usage: export-content <output.json>')
  process.exit(1)
}

const payload = await getPayload({ config })

// ─── id → portable key, always from the Bulgarian locale ─────────────────────
const keyById = new Map<string, string>()
const remember = (relationTo: string, id: number, key: string) =>
  keyById.set(`${relationTo}:${id}`, key)

for (const doc of (await payload.find({ collection: 'media', limit: 500, overrideAccess: true, depth: 0 })).docs) {
  if (doc.filename) remember('media', doc.id as number, mediaKey(doc.filename))
}
for (const doc of (await payload.find({ collection: 'pages', limit: 500, locale: 'bg', overrideAccess: true, depth: 0 })).docs) {
  if (doc.slug) remember('pages', doc.id as number, doc.slug)
}
for (const doc of (await payload.find({ collection: 'courses', limit: 500, locale: 'bg', overrideAccess: true, depth: 0 })).docs) {
  remember('courses', doc.id as number, courseKey(doc as unknown as Record<string, unknown>))
}

const missing: string[] = []
const toPortable = (value: unknown, relationTo: string): unknown => {
  if (typeof value !== 'number') return value ?? null
  const key = keyById.get(`${relationTo}:${value}`)
  if (key === undefined) {
    missing.push(`${relationTo}#${value}`)
    return null
  }
  return encodeRef(relationTo, key)
}

// ─── collections ─────────────────────────────────────────────────────────────
const collections: Record<string, Record<string, unknown>[]> = {}
for (const slug of COLLECTIONS) {
  const paths = collectionRefPaths(payload.config, slug)
  const rows: Record<string, unknown>[] = []
  for (const locale of LOCALES) {
    const found = await payload.find({
      collection: slug,
      limit: 500,
      sort: 'id',
      locale,
      overrideAccess: true,
      depth: 0,
    })
    found.docs.forEach((doc, index) => {
      rows[index] ??= { sourceId: doc.id }
      rows[index][locale] = mapRefs(
        stripMeta(doc as unknown as Record<string, unknown>),
        paths,
        toPortable,
      )
    })
  }
  collections[slug] = rows
}

// ─── globals ─────────────────────────────────────────────────────────────────
const globals: Record<string, Record<string, unknown>> = {}
for (const slug of GLOBALS) {
  const paths = globalRefPaths(payload.config, slug)
  globals[slug] = {}
  for (const locale of LOCALES) {
    const doc = await payload.findGlobal({ slug, locale, overrideAccess: true, depth: 0 })
    globals[slug][locale] = mapRefs(
      stripMeta(doc as unknown as Record<string, unknown>),
      paths,
      toPortable,
    )
  }
}

writeFileSync(
  out,
  JSON.stringify({ courses: collections.courses, reviews: collections.reviews, globals }, null, 2),
  'utf8',
)

console.log(`  exported → ${out}`)
for (const slug of COLLECTIONS) console.log(`    ${slug}: ${collections[slug].length}`)
for (const slug of GLOBALS) console.log(`    global ${slug}`)
if (missing.length > 0) {
  console.log(`  ⚠ reference(s) with no key in this database, exported as null: ${[...new Set(missing)].join(', ')}`)
}

await payload.db.destroy?.()
process.exit(0)
