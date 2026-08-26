import type { MetadataRoute } from 'next'

/**
 * Must live at the app root: inside a route group like (site) this file is
 * silently ignored — it compiles fine and /robots.txt just never gets generated.
 *
 * Crawling rules. `/admin` and the API are excluded — nothing there is useful in
 * search results, and the admin panel returns a login screen to anyone anyway.
 */
const robots = (): MetadataRoute.Robots => {
  const base = process.env.NEXT_PUBLIC_SERVER_URL?.trim()

  /**
   * Anything that is not the production deployment refuses crawlers outright.
   *
   * A preview build is a copy of the whole site on a public URL. Indexed, it
   * competes with the real domain for the school's own terms and can outrank it on
   * a bad day. Vercel sets a noindex header on *.vercel.app previews, but that
   * stops applying the moment a preview gets an alias, and a rule we own is one we
   * can reason about.
   */
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    ...(base ? { sitemap: `${base}/sitemap.xml`, host: base } : {}),
  }
}

export default robots
