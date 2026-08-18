import Link from 'next/link'
import type { HomePage, SiteSetting } from '../../payload-types'
import { type Locale } from '../../lib/i18n'
import { resolveLink } from '../../lib/links'
import { mediaAlt, mediaUrl } from '../../lib/media'
import { toLines } from '../../lib/format'

type Props = {
  locale: Locale
  settings: SiteSetting
  /** Only the home page shows the big closing call to action. */
  cta?: HomePage['footerCta'] | null
  variant?: 'full' | 'slim'
}

export const Footer = ({ locale, settings, cta, variant = 'full' }: Props) => {
  const logo = mediaUrl(settings.logo, 200)
  const logoAlt = mediaAlt(settings.logo, settings.brandName)
  const socials = settings.socials ?? []

  if (variant === 'slim') {
    return (
      <footer className="footer footer--slim">
        <div className="footer__row">
          {logo ? <img src={logo} alt={logoAlt} className="footer__logo" /> : null}
          {socials.map((social) => (
            <a key={social.id ?? social.url} href={social.url} target="_blank" rel="noopener noreferrer">
              {social.label}
            </a>
          ))}
          {settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a> : null}
          {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
        </div>
      </footer>
    )
  }

  const ctaLink = cta ? resolveLink(cta.cta ?? null, locale) : null
  const footerLinks = (settings.footerLinks ?? [])
    .map((row) => resolveLink(row.link ?? null, locale))
    .filter((link): link is NonNullable<typeof link> => Boolean(link?.label))

  return (
    <footer className="footer">
      <div className="wrap" data-reveal>
        <div className="footer__grid">
          <div>
            {cta?.heading ? (
              <h2 className="footer__heading">
                {toLines(cta.heading).map((line, i) => (
                  <span key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </h2>
            ) : null}
            {ctaLink ? (
              ctaLink.external ? (
                <a
                  className="btn btn-primary footer__cta"
                  href={ctaLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ctaLink.label}
                </a>
              ) : (
                <Link className="btn btn-primary footer__cta" href={ctaLink.href}>
                  {ctaLink.label}
                </Link>
              )
            ) : null}
          </div>

          <div className="footer__info">
            {logo ? <img src={logo} alt={logoAlt} className="footer__logo" /> : null}
            <span className="footer__brand">{settings.brandName}</span>
            {socials.map((social) => (
              <a key={social.id ?? social.url} href={social.url} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            ))}
            {settings.phone ? (
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
            ) : null}
            {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {settings.addressLine ? <span className="footer__city">{settings.addressLine}</span> : null}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {settings.brandName}</span>
          {footerLinks.map((link) =>
            link.external ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ),
          )}
          {settings.footerNote ? <span>{settings.footerNote}</span> : null}
        </div>
      </div>
    </footer>
  )
}
