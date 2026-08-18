import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, isLocale } from './lib/i18n'

/** Paths the site's locale routing must never touch. */
const PASSTHROUGH = ['/admin', '/api', '/_next', '/media', '/img']

/**
 * Picks the best locale from the browser's Accept-Language header, falling back
 * to Bulgarian. A Bulgarian visitor should never land on the English site, and
 * vice versa, but the choice is only ever applied to an unprefixed URL — once
 * someone is on /en, they stay there.
 */
const negotiateLocale = (request: NextRequest) => {
  const header = request.headers.get('accept-language')
  if (!header) return DEFAULT_LOCALE

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  if (PASSTHROUGH.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next()
  }
  // Files (favicon.ico, robots.txt, sitemap.xml, uploads) are served as-is.
  if (pathname.includes('.')) return NextResponse.next()

  const first = pathname.split('/')[1]
  if (isLocale(first)) return NextResponse.next()

  const locale = negotiateLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Everything except Next internals; the checks above do the fine filtering.
  matcher: ['/((?!_next/static|_next/image).*)'],
}

export { LOCALES }
