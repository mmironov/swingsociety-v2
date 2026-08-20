import { getPayload } from 'payload'
import config from './src/payload.config'

const FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSfxynNfUyEg6JRFnKdYsbOibxU6sV1v8Ni9Bnw8173jMtb-rg/viewform?embedded=true'

const copy = {
  bg: {
    kicker: 'Записване',
    title: 'Запиши се за курс',
    lead: 'Попълни формата по-долу и ще се свържем с теб с всички подробности за началото на групата.',
    embedTitle: 'Форма за записване',
    note: 'Ако предпочиташ, писни ни на имейл или в социалните мрежи — но формата е най-бързият начин да запазим място за теб.',
  },
  en: {
    kicker: 'Sign up',
    title: 'Sign up for a course',
    lead: 'Fill in the form below and we will get back to you with everything you need to know about the start of the group.',
    embedTitle: 'Sign-up form',
    note: 'You can also reach us by email or on social media — but the form is the fastest way for us to hold a place for you.',
  },
} as const

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'pages',
  locale: 'bg',
  where: { slug: { equals: 'sign-up' } },
  limit: 1,
  overrideAccess: true,
  depth: 0,
})

const blocksFor = (locale: 'bg' | 'en', ids?: (string | null | undefined)[]) => {
  const c = copy[locale]
  return [
    {
      blockType: 'embed' as const,
      ...(ids?.[0] ? { id: ids[0] } : {}),
      url: FORM,
      title: c.embedTitle,
      height: 2124, // Google's own recommended height for this form
    },
    {
      blockType: 'text' as const,
      ...(ids?.[1] ? { id: ids[1] } : {}),
      content: {
        root: {
          type: 'root',
          format: '', indent: 0, version: 1, direction: 'ltr' as const,
          children: [
            {
              type: 'paragraph',
              format: '', indent: 0, version: 1, direction: 'ltr' as const,
              children: [{ type: 'text', text: c.note, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
            },
          ],
        },
      },
    },
  ]
}

const data = (locale: 'bg' | 'en', ids?: (string | null | undefined)[]) => ({
  kicker: copy[locale].kicker,
  title: copy[locale].title,
  lead: copy[locale].lead,
  slug: 'sign-up',
  blocks: blocksFor(locale, ids),
  _status: 'published' as const,
})

let id: number
if (existing.docs[0]) {
  id = existing.docs[0].id as number
  await payload.update({ collection: 'pages', id, locale: 'bg', data: data('bg') as never, overrideAccess: true })
  console.log(`  updated page #${id}`)
} else {
  const created = await payload.create({ collection: 'pages', locale: 'bg', data: data('bg') as never, overrideAccess: true })
  id = created.id as number
  console.log(`  created page #${id}`)
}

// Reuse the block ids the Bulgarian pass assigned, or the English text replaces
// the rows instead of translating them.
const saved = await payload.findByID({ collection: 'pages', id, locale: 'bg', overrideAccess: true, depth: 0 })
const ids = (saved.blocks ?? []).map((b: { id?: string | null }) => b.id)
await payload.update({ collection: 'pages', id, locale: 'en', data: data('en', ids) as never, overrideAccess: true })
console.log(`  english written with block ids: ${JSON.stringify(ids)}`)

for (const locale of ['bg', 'en'] as const) {
  const doc = await payload.findByID({ collection: 'pages', id, locale, overrideAccess: true, depth: 0 })
  const embed = (doc.blocks ?? []).find((b: { blockType: string }) => b.blockType === 'embed') as { url?: string } | undefined
  console.log(`  [${locale}] slug=${doc.slug} title=${JSON.stringify(doc.title)} status=${doc._status} embed=${embed?.url ? 'set' : 'MISSING'}`)
}

await payload.db.destroy?.()
process.exit(0)
