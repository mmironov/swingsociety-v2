'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, type Locale, t } from '../../lib/i18n'

export type NavItem = { href: string; label: string; external: boolean }

type Props = {
  locale: Locale
  brandName: string
  logoUrl: string | null
  logoAlt: string
  items: NavItem[]
  cta: NavItem | null
  /** Same path in the other locale, for the language switcher. */
  localePaths: Record<Locale, string>
}

export const Nav = ({ locale, brandName, logoUrl, logoAlt, items, cta, localePaths }: Props) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // A route change must not leave the panel hanging open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // Escape closes it, matching every other overlay on the web.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const renderLink = (item: NavItem, className?: string) =>
    item.external ? (
      <a key={item.href + item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {item.label}
      </a>
    ) : (
      <Link key={item.href + item.label} href={item.href} className={className}>
        {item.label}
      </Link>
    )

  const languageSwitcher = (
    <div className="lang" role="group" aria-label={t('switchLanguage', locale)}>
      {LOCALES.map((code) => (
        <Link
          key={code}
          href={localePaths[code]}
          aria-current={code === locale ? 'true' : undefined}
          hrefLang={code}
        >
          {code}
        </Link>
      ))}
    </div>
  )

  return (
    <>
      <nav className="nav">
        <Link href={`/${locale}`} className="nav__brand">
          {logoUrl ? (
            <img src={logoUrl} alt={logoAlt} className="nav__logo" width={53} height={46} />
          ) : null}
          <span className="nav__brand-name">{brandName}</span>
        </Link>

        <div className="nav__links">
          {items.map((item) => renderLink(item))}
          {languageSwitcher}
          {cta ? renderLink(cta, 'btn btn-primary nav__cta') : null}
        </div>

        {/* The narrow bar keeps only what the design had — sign up and the
            burger. The language switcher lives inside the panel, where there is
            room for it. */}
        <div className="nav__mobile">
          {cta ? renderLink(cta, 'btn btn-primary nav__cta') : null}
          <button
            type="button"
            className="nav__burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('closeMenu', locale) : t('menu', locale)}
            aria-expanded={open}
            aria-controls="nav-panel"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="nav__panel" id="nav-panel">
          {items.map((item) => renderLink(item))}
          <div className="nav__panel-lang">{languageSwitcher}</div>
        </div>
      ) : null}
    </>
  )
}
