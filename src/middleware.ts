import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, isLocale } from './lib/i18n'

/** Paths the site's locale routing must never touch. */
const PASSTHROUGH = ['/admin', '/api', '/_next', '/media', '/img']

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  if (PASSTHROUGH.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next()
  }
  // Files (favicon.ico, robots.txt, sitemap.xml, uploads) are served as-is.
  if (pathname.includes('.')) return NextResponse.next()

  const first = pathname.split('/')[1]
  if (isLocale(first)) return NextResponse.next()

  /**
   * Unprefixed URLs always go to Bulgarian.
   *
   * This used to negotiate from Accept-Language, so an English browser opening
   * swingsociety.bg landed on /en. The school is in Sofia and sells to a Bulgarian
   * audience, so Bulgarian is the front door; an English speaker switches with the
   * BG/EN toggle in the nav, which is one tap away on every page.
   *
   * Deliberately not a redirect that depends on the visitor: the same URL now always
   * resolves to the same language, which is also what makes /bg the stable thing for
   * search engines to index.
   */
  const locale = DEFAULT_LOCALE
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Everything except Next internals; the checks above do the fine filtering.
  matcher: ['/((?!_next/static|_next/image).*)'],
}

export { LOCALES }
