import type { Page } from '../payload-types'
import { type Locale, path } from './i18n'

export type CmsLink = {
  label?: string | null
  type?: 'none' | 'external' | 'page' | 'section' | 'schedule' | 'home' | null
  url?: string | null
  page?: number | Page | null
  section?: string | null
} | null

export type ResolvedLink = {
  href: string
  label: string
  /** True for destinations outside the site — gets target=_blank + rel. */
  external: boolean
}

const isExternalHref = (href: string) => /^https?:\/\//i.test(href)

/**
 * Turns one CMS link into an href. Mirrors the `href()` helper the design used,
 * with the locale prefix added — an English visitor following an internal link
 * must stay in English.
 *
 * Returns null when the link has nothing to point at, so callers can omit the
 * button entirely rather than render a dead `#`.
 */
export const resolveLink = (
  link: CmsLink,
  locale: Locale,
  fallbackLabel?: string,
): ResolvedLink | null => {
  if (!link) return null
  const label = link.label?.trim() || fallbackLabel || ''

  const build = (href: string | null): ResolvedLink | null =>
    href ? { href, label, external: isExternalHref(href) } : null

  switch (link.type) {
    case 'external':
      return build(link.url?.trim() || null)

    case 'page': {
      // Depth-1 queries give a populated Page; a bare id means the relationship
      // wasn't populated and we can't build a slug from it.
      const page = typeof link.page === 'object' ? link.page : null
      return build(page?.slug ? path(`/${page.slug}`, locale) : null)
    }

    case 'section':
      return build(link.section ? `${path('/', locale)}#${link.section}` : null)

    case 'schedule':
      return build(path('/schedule', locale))

    case 'home':
      return build(path('/', locale))

    default:
      return null
  }
}

/** `mailto:`/`tel:` are not external in the "open a new tab" sense. */
export const linkTargetProps = (link: ResolvedLink) =>
  link.external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}
