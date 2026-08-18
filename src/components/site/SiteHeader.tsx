import { LOCALES, type Locale } from '../../lib/i18n'
import { getSiteSettings } from '../../lib/content'
import { resolveLink } from '../../lib/links'
import { mediaAlt, mediaUrl } from '../../lib/media'
import { Nav, type NavItem } from './Nav'

type Props = {
  locale: Locale
  /**
   * Where the language switcher should point, per locale. Pages with localized
   * slugs pass their own map; everything else keeps the same path and only
   * swaps the prefix.
   */
  localePaths?: Partial<Record<Locale, string>>
  /** Path segment after the locale, e.g. `/schedule`. */
  currentPath?: string
}

export const SiteHeader = async ({ locale, localePaths, currentPath = '' }: Props) => {
  const settings = await getSiteSettings(locale)

  const items: NavItem[] = (settings.nav ?? [])
    .map((row) => resolveLink(row.link ?? null, locale))
    .filter((link): link is NonNullable<typeof link> => Boolean(link?.label))
    .map(({ href, label, external }) => ({ href, label, external }))

  const cta = resolveLink(settings.cta ?? null, locale)

  const paths = Object.fromEntries(
    LOCALES.map((code) => [code, localePaths?.[code] ?? `/${code}${currentPath}`]),
  ) as Record<Locale, string>

  return (
    <Nav
      locale={locale}
      brandName={settings.brandName}
      logoUrl={mediaUrl(settings.logo, 100)}
      logoAlt={mediaAlt(settings.logo, settings.brandName)}
      items={items}
      cta={cta ? { href: cta.href, label: cta.label, external: cta.external } : null}
      localePaths={paths}
    />
  )
}
