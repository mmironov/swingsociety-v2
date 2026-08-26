import type { MetadataRoute } from 'next'
import { getPageSlugPairs } from '../lib/content'
import { LOCALES } from '../lib/i18n'

/**
 * Lives at the app root, not inside the (site) route group. `sitemap.ts` works in
 * either place, but `robots.ts` is silently ignored in a route group — it compiles,
 * and /robots.txt simply never appears in the route table — so both sit here to
 * keep that from being a puzzle later.
 *
 * Generated from the CMS, so publishing a page adds it here with no code change.
 *
 * Every entry carries `alternates.languages`, which is how Google learns that
 * /bg/lindi-hop and /en/lindy-hop are the same page in two languages rather than
 * duplicate content. That mapping cannot be derived from the URL — the slugs are
 * localized per document — so it comes from the documents themselves.
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const base = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  if (!base) return []

  const url = (locale: string, path = '') => `${base}/${locale}${path}`

  const languagesFor = (path: (locale: string) => string) =>
    Object.fromEntries(LOCALES.map((locale) => [locale, path(locale)]))

  const entries: MetadataRoute.Sitemap = []

  // Home, then the schedule: the two routes that exist independently of the CMS.
  for (const locale of LOCALES) {
    entries.push({
      url: url(locale),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: languagesFor((l) => url(l)) },
    })
  }
  // Routes that exist in code rather than as CMS pages. Each is the same path in
  // both languages, so the alternates are a straight substitution. /sign-up is NOT
  // here — it is a Pages document, so getPageSlugPairs() already emits it.
  const FIXED = [
    { path: '/schedule', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/dances', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/team', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
  ]
  for (const route of FIXED) {
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: languagesFor((l) => url(l, route.path)) },
      })
    }
  }

  for (const pair of await getPageSlugPairs()) {
    const slugFor = (locale: string) => (locale === 'bg' ? pair.bg : pair.en)
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, `/${slugFor(locale)}`),
        lastModified: pair.updatedAt ? new Date(pair.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: languagesFor((l) => url(l, `/${slugFor(l)}`)) },
      })
    }
  }

  return entries
}

export default sitemap
