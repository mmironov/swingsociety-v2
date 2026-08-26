/**
 * Writes the offer-led hero's wording. Run once per environment; the school edits
 * both strings in /admin afterwards.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const COMMIT = process.argv.includes('--commit')
const payload = await getPayload({ config })

const COPY = {
  bg: { offerHeading: 'Суинг танци за начинаещи', heading: 'Научи се да танцуваш' },
  en: { offerHeading: 'Swing dance for beginners', heading: 'Learn to dance' },
} as const

console.log(`\n▸ ${COMMIT ? 'APPLYING' : 'DRY RUN'}\n`)

for (const locale of ['bg', 'en'] as const) {
  const before = (await payload.findGlobal({
    slug: 'home-page',
    locale,
    overrideAccess: true,
    depth: 0,
  })) as unknown as Record<string, Record<string, unknown>>
  const hero = before.hero ?? {}
  console.log(`  [${locale}] offerHeading ${JSON.stringify(hero.offerHeading ?? null)} → ${JSON.stringify(COPY[locale].offerHeading)}`)
  console.log(`  [${locale}] heading      ${JSON.stringify(hero.heading ?? null)} → ${JSON.stringify(COPY[locale].heading)}`)
  if (!COMMIT) continue
  await payload.updateGlobal({
    slug: 'home-page',
    locale,
    data: { hero: { offerHeading: COPY[locale].offerHeading, heading: COPY[locale].heading } } as never,
    overrideAccess: true,
    depth: 0,
  })
  console.log('      ✓ written')
}

if (!COMMIT) console.log('\n  Re-run with --commit to apply.\n')
await payload.db.destroy?.()
process.exit(0)
