import { cache } from 'react'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import config from '../payload.config'
import type { Locale } from './i18n'
import type { Course, Event, Page, Review, Teacher } from '../payload-types'

/**
 * `cache()` dedupes within a single request, so a page that needs the site
 * settings in both the nav and the footer still makes one query.
 */
const client = cache(async () => getPayload({ config }))

/** True when an editor is previewing unpublished content. */
const isDraftMode = async (): Promise<boolean> => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // draftMode() throws outside a request scope (e.g. during the seed).
    return false
  }
}

export const getSiteSettings = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 2, overrideAccess: false })
})

export const getHomePage = cache(async (locale: Locale) => {
  const payload = await client()
  // depth 2 so a linked page inside a link field arrives with its slug, and a
  // related course inside a card arrives with its own relationships.
  return payload.findGlobal({ slug: 'home-page', locale, depth: 2, overrideAccess: false })
})

export const getSchedulePage = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'schedule-page', locale, depth: 2, overrideAccess: false })
})

export const getTeachers = cache(async (locale: Locale): Promise<Teacher[]> => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'teachers',
    locale,
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return docs
})

export const getReviews = cache(async (locale: Locale): Promise<Review[]> => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'reviews',
    locale,
    where: { published: { equals: true } },
    sort: 'order',
    limit: 50,
    depth: 0,
  })
  return docs
})

export const getScheduleCourses = cache(async (locale: Locale): Promise<Course[]> => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'courses',
    locale,
    where: { showOnSchedule: { equals: true } },
    sort: 'order',
    limit: 100,
    depth: 2,
  })
  return docs
})

/**
 * Upcoming events, soonest first. Anything already past is dropped; anything
 * without a date yet sorts to the end, because "датата се уточнява" is still
 * news worth showing.
 */
export const getUpcomingEvents = cache(
  async (locale: Locale, opts: { featuredOnly?: boolean; limit?: number } = {}): Promise<Event[]> => {
    const payload = await client()
    const { docs } = await payload.find({
      collection: 'events',
      locale,
      where: {
        ...(opts.featuredOnly ? { featured: { equals: true } } : { showOnSchedule: { equals: true } }),
        or: [
          // Keep an event listed until its end (or its start, if open-ended)
          // has passed, so a festival stays up while it is running.
          { endsAt: { greater_than_equal: new Date().toISOString() } },
          { and: [{ endsAt: { exists: false } }, { startsAt: { greater_than_equal: new Date().toISOString() } }] },
          { startsAt: { exists: false } },
        ],
      },
      sort: 'startsAt',
      limit: opts.limit ?? 100,
      depth: 2,
    })

    return [...docs].sort((a, b) => {
      // Undated events go last, and among themselves keep a stable order rather
      // than shuffling between requests.
      if (!a.startsAt && !b.startsAt) return a.id - b.id
      if (!a.startsAt) return 1
      if (!b.startsAt) return -1
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    })
  },
)

export const getPageBySlug = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  const payload = await client()
  const draft = await isDraftMode()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })
  return docs[0] ?? null
})

/**
 * Published pages as `{ bg, en, updatedAt }`, so the sitemap can declare each
 * URL's counterpart in the other language.
 *
 * Slugs are localized — /bg/lindi-hop and /en/lindy-hop are one document — so the
 * pairing has to come from the document, not from a URL transformation.
 */
export const getPageSlugPairs = cache(
  async (): Promise<{ bg: string; en: string; updatedAt?: string }[]> => {
    const payload = await client()
    const query = (locale: Locale) =>
      payload.find({
        collection: 'pages',
        locale,
        where: { _status: { equals: 'published' } },
        limit: 500,
        depth: 0,
        select: { slug: true, updatedAt: true },
      })

    const [bg, en] = await Promise.all([query('bg'), query('en')])
    const enById = new Map(en.docs.map((doc) => [doc.id, doc.slug]))

    return bg.docs
      .map((doc) => ({
        bg: doc.slug ?? '',
        // `fallback: true` means an untranslated page reports the Bulgarian slug,
        // which is correct: that is the URL the English site actually serves.
        en: enById.get(doc.id) ?? doc.slug ?? '',
        updatedAt: doc.updatedAt ?? undefined,
      }))
      .filter((pair) => pair.bg && pair.en)
  },
)

/** Every published page slug, for `generateStaticParams` and the sitemap. */
export const getAllPageSlugs = cache(async (locale: Locale): Promise<string[]> => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    where: { _status: { equals: 'published' } },
    limit: 500,
    depth: 0,
    select: { slug: true },
  })
  return docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug))
})
