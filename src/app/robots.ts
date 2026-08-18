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
