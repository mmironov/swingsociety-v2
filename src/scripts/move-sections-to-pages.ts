/**
 * Copies the Dances, FAQ and Team content out of the home page global and into the
 * three page globals that now render it.
 *
 * Field names change on the way: a section had `heading` and `intro`, a page has
 * `title` and `lead`. Everything else carries over as-is, and because both sides
 * live in the same database, relationship ids need no remapping.
 *
 * Dry run unless --commit. Run once per environment; re-running is harmless, since
 * writing a global is idempotent.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const COMMIT = process.argv.includes('--commit')
const LOCALES = ['bg', 'en'] as const

const payload = await getPayload({ config })

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

type Section = Record<string, unknown>

/** section field names → page field names */
const toPage = (section: Section, extra: string[]): Record<string, unknown> => {
  const out: Record<string, unknown> = {
    kicker: section.kicker ?? null,
    title: section.heading ?? null,
    lead: section.intro ?? null,
  }
  for (const key of extra) out[key] = section[key] ?? null
  return out
}

const MOVES = [
  { from: 'dances', to: 'dances-page', extra: ['introLink', 'items', 'linkLabel'] },
  { from: 'faq', to: 'faq-page', extra: ['items'] },
  { from: 'team', to: 'team-page', extra: [] },
] as const

console.log(`\n▸ ${COMMIT ? 'COPYING' : 'DRY RUN — nothing will be written'}\n`)

const home: Record<string, Section> = {}
for (const locale of LOCALES) {
  home[locale] = (await payload.findGlobal({
    slug: 'home-page',
    locale,
    overrideAccess: true,
    depth: 0,
  })) as unknown as Section
}

for (const move of MOVES) {
  const bgSection = (home.bg[move.from] ?? {}) as Section
  const enSection = (home.en[move.from] ?? {}) as Section
  const bg = toPage(bgSection, [...move.extra])
  const en = toPage(enSection, [...move.extra])

  const target = await payload.findGlobal({
    slug: move.to as 'dances-page',
    locale: 'bg',
    overrideAccess: true,
    depth: 0,
  })

  const describe = (v: unknown) =>
    Array.isArray(v) ? `${v.length} item(s)` : JSON.stringify(v)?.slice(0, 60)

  console.log(`  ${move.from} → ${move.to}`)
  console.log(`      title : ${describe(bg.title)}`)
  console.log(`      lead  : ${describe(bg.lead)}`)
  for (const key of move.extra) console.log(`      ${key.padEnd(6)}: ${describe(bg[key])}`)
  console.log(`      target currently: title=${describe((target as unknown as Section).title)}`)

  if (!COMMIT) continue

  const saved = await payload.updateGlobal({
    slug: move.to as 'dances-page',
    locale: 'bg',
    data: bg as never,
    overrideAccess: true,
    depth: 0,
  })
  // English needs the ids Bulgarian just created, or Payload makes new array rows
  // and orphans the Bulgarian text.
  await payload.updateGlobal({
    slug: move.to as 'dances-page',
    locale: 'en',
    data: withIds(saved, en) as never,
    overrideAccess: true,
    depth: 0,
  })
  console.log(`      ✓ written in both locales`)
}

if (!COMMIT) console.log('\n  Re-run with --commit to apply.\n')
else console.log('\n✓ Done. The deployed site is prerendered — redeploy to see it.\n')

await payload.db.destroy?.()
process.exit(0)
