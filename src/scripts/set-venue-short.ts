import { getPayload } from 'payload'
import config from '../payload.config'

const COMMIT = process.argv.includes('--commit')
const payload = await getPayload({ config })

/** Short names as the school gave them; editable in /admin afterwards. */
const SHORT: Record<string, { bg: string; en: string }> = {
  'Afrikaia, Лозенец': { bg: 'Лозенец', en: 'Lozenets' },
  // The school calls this one by its street rather than the building — locals
  // navigate by the boulevard, not by "Национален Студентски Дом".
  'Национален Студентски Дом, зала 404': { bg: 'Цар Освободител', en: 'Tsar Osvoboditel' },
}

const bg = await payload.find({ collection: 'courses', locale: 'bg', limit: 50, sort: 'id', overrideAccess: true, depth: 0 })
console.log(`\n▸ ${COMMIT ? 'APPLYING' : 'DRY RUN'}\n`)

for (const c of bg.docs as unknown as Record<string, unknown>[]) {
  const full = String(c.venue ?? '').trim()
  const short = SHORT[full]
  if (!short) {
    if (full) console.log(`  · #${c.id} "${full}" — no short name proposed, skipped`)
    continue
  }
  console.log(`  #${c.id} "${full}" → bg:${JSON.stringify(short.bg)} en:${JSON.stringify(short.en)}`)
  if (!COMMIT) continue
  for (const locale of ['bg', 'en'] as const) {
    await payload.update({
      collection: 'courses',
      id: c.id as number,
      locale,
      data: { venueShort: short[locale] } as never,
      overrideAccess: true,
      depth: 0,
    })
  }
  console.log('      ✓ written')
}

if (!COMMIT) console.log('\n  Re-run with --commit to apply.\n')
await payload.db.destroy?.()
process.exit(0)
