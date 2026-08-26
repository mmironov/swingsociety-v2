/**
 * Two content fixes for the home page's offer.
 *
 * 1. Fills `beginners.groups` from the old single `beginners.course`, plus every
 *    other course sharing its title. The school runs two beginner groups at
 *    different venues and the home page showed one — the other existed only in the
 *    schedule table.
 *
 * 2. Points every course's "Запиши се" button at the sign-up page. Three of four
 *    courses had no working button: two were set to "no link" and one pointed at
 *    the schedule, so a visitor reading about a group had no way to join it.
 *
 * Dry run unless --commit. Ordering is by start date, so the group starting soonest
 * is the first card.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const COMMIT = process.argv.includes('--commit')
const payload = await getPayload({ config })

const home = await payload.findGlobal({
  slug: 'home-page',
  locale: 'bg',
  overrideAccess: true,
  depth: 1,
})

const beginners = (home as unknown as Record<string, Record<string, unknown>>).beginners ?? {}
const featured = beginners.course as { id?: number; title?: string } | number | null
const featuredId = typeof featured === 'object' ? featured?.id : (featured ?? undefined)
const featuredTitle = typeof featured === 'object' ? featured?.title : undefined

const all = await payload.find({
  collection: 'courses',
  locale: 'bg',
  limit: 200,
  sort: 'id',
  overrideAccess: true,
  depth: 0,
})

// The two beginner groups are literally the same course run at two venues, so the
// title identifies them. Anything else stays off the home page.
const groups = all.docs
  .filter((c) => {
    const doc = c as unknown as Record<string, unknown>
    return c.id === featuredId || (featuredTitle && doc.title === featuredTitle)
  })
  .sort((a, b) => {
    const at = (a as unknown as Record<string, unknown>).startDate as string | undefined
    const bt = (b as unknown as Record<string, unknown>).startDate as string | undefined
    if (at && bt) return at.localeCompare(bt)
    return (a.id as number) - (b.id as number)
  })

console.log(`\n▸ ${COMMIT ? 'APPLYING' : 'DRY RUN — nothing will be written'}\n`)
console.log(`  featured course was: #${featuredId ?? '—'} ${JSON.stringify(featuredTitle)}`)
console.log(`  groups for the home page (in card order):`)
for (const g of groups) {
  const d = g as unknown as Record<string, unknown>
  console.log(`     #${g.id} "${d.title}" — ${d.startDate ?? d.startNote} · ${d.day ?? '—'} ${d.time ?? ''} · ${d.venue ?? '—'}`)
}

// ── sign-up destination ─────────────────────────────────────────────────────
const signup = await payload.find({
  collection: 'pages',
  locale: 'bg',
  where: { slug: { equals: 'sign-up' } },
  limit: 1,
  overrideAccess: true,
  depth: 0,
})
const signupPage = signup.docs[0]

if (!signupPage) {
  console.log('\n  ⚠ no page with slug "sign-up" — registration links left untouched.')
} else {
  console.log(`\n  sign-up page: #${signupPage.id}`)
  console.log('  registration links:')
  for (const c of all.docs) {
    const d = c as unknown as Record<string, unknown>
    const reg = (d.registration ?? {}) as Record<string, unknown>
    console.log(`     #${c.id} "${d.title}" ${reg.type ?? '—'} → page #${signupPage.id}`)
  }
}

if (!COMMIT) {
  console.log('\n  Re-run with --commit to apply.\n')
  await payload.db.destroy?.()
  process.exit(0)
}

await payload.updateGlobal({
  slug: 'home-page',
  locale: 'bg',
  data: { beginners: { groups: groups.map((g) => g.id) } } as never,
  overrideAccess: true,
  depth: 0,
})
console.log(`\n  ✓ beginners.groups = [${groups.map((g) => g.id).join(', ')}]`)

if (signupPage) {
  for (const c of all.docs) {
    const d = c as unknown as Record<string, unknown>
    const reg = (d.registration ?? {}) as Record<string, unknown>
    for (const locale of ['bg', 'en'] as const) {
      await payload.update({
        collection: 'courses',
        id: c.id,
        locale,
        data: {
          registration: {
            // Keep whatever label the editor wrote; only the destination changes.
            label: reg.label ?? (locale === 'bg' ? 'Запиши се' : 'Sign up'),
            type: 'page',
            page: signupPage.id,
          },
        } as never,
        overrideAccess: true,
        depth: 0,
      })
    }
    console.log(`  ✓ #${c.id} "${d.title}" → /sign-up`)
  }
}

console.log('\n✓ Done. The deployed site is prerendered — redeploy to see it.\n')
await payload.db.destroy?.()
process.exit(0)
