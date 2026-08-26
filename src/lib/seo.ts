import type { Course, Event, FaqPage, SiteSetting } from '../payload-types'
import { DEFAULT_LOCALE, LOCALES, type Locale, path } from './i18n'
import { mediaUrl } from './media'

const base = () => process.env.NEXT_PUBLIC_SERVER_URL?.trim() ?? ''
const absolute = (p: string) => (p.startsWith('http') ? p : `${base()}${p}`)

/**
 * hreflang map for a route that has the same path in both languages.
 *
 * Page-level hreflang matters even though the sitemap already carries alternates:
 * it is the stronger of the two signals, and without it two translations of one
 * page can be read as competing duplicates rather than as versions of each other.
 * `x-default` points at Bulgarian, which is where an unprefixed URL now lands.
 */
export const alternatesFor = (routePath: string) => ({
  languages: {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, path(routePath, locale)])),
    'x-default': path(routePath, DEFAULT_LOCALE),
  },
})

/** hreflang map when the path itself is localized, as CMS page slugs are. */
export const alternatesForPaths = (byLocale: Partial<Record<Locale, string>>) => ({
  languages: {
    ...Object.fromEntries(
      LOCALES.filter((locale) => byLocale[locale]).map((locale) => [locale, byLocale[locale] as string]),
    ),
    ...(byLocale[DEFAULT_LOCALE] ? { 'x-default': byLocale[DEFAULT_LOCALE] as string } : {}),
  },
})

/**
 * The school itself.
 *
 * Typed as both LocalBusiness and EducationalOrganization: it is a business with a
 * place and opening times, and it teaches. There is deliberately no schema.org
 * "DanceSchool" type, so inventing one would just be ignored.
 *
 * Only fields the CMS actually holds are emitted. No street address and no
 * coordinates, because the CMS stores a city and a venue name and nothing finer —
 * a fabricated address is worse than an absent one, both for Google and for
 * somebody trying to find the door.
 */
export const schoolJsonLd = (settings: SiteSetting, locale: Locale) => {
  const socials = (settings.socials ?? [])
    .map((s) => s.url?.trim())
    .filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': `${base()}#school`,
    name: settings.brandName,
    url: absolute(path('/', locale)),
    ...(mediaUrl(settings.logo, 600) ? { logo: absolute(mediaUrl(settings.logo, 600) as string) } : {}),
    ...(mediaUrl(settings.meta?.image, 1200)
      ? { image: absolute(mediaUrl(settings.meta?.image, 1200) as string) }
      : {}),
    ...(settings.meta?.description ? { description: settings.meta.description } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.addressLine
      ? { address: { '@type': 'PostalAddress', addressLocality: settings.addressLine, addressCountry: 'BG' } }
      : {}),
    ...(settings.addressLine ? { areaServed: settings.addressLine } : {}),
    ...(socials.length ? { sameAs: socials } : {}),
  }
}

/**
 * One course, with an instance per group.
 *
 * hasCourseInstance is what carries the concrete facts — when it starts, where, how
 * it is taught — so two groups of the same course are two instances rather than two
 * courses, which is also how the school describes them.
 */
export const courseJsonLd = (courses: Course[], settings: SiteSetting, locale: Locale) => {
  const first = courses[0]
  if (!first) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: first.title,
    ...(first.summary ? { description: first.summary } : {}),
    url: absolute(path('/', locale)),
    provider: { '@type': 'Organization', name: settings.brandName, '@id': `${base()}#school` },
    inLanguage: locale === 'bg' ? 'bg' : 'en',
    hasCourseInstance: courses.map((course) => ({
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      ...(course.startDate ? { startDate: course.startDate.slice(0, 10) } : {}),
      ...(course.day || course.time
        ? { courseSchedule: [course.day, course.time].filter(Boolean).join(', ') }
        : {}),
      ...(course.venue
        ? {
            location: {
              '@type': 'Place',
              name: course.venue,
              address: { '@type': 'PostalAddress', addressLocality: settings.addressLine ?? 'София', addressCountry: 'BG' },
            },
          }
        : {}),
    })),
  }
}

/**
 * The questions page.
 *
 * Note Google restricted FAQ rich results in 2023 to health and government sites,
 * so this is unlikely to produce the expandable snippet it once did. It stays
 * because it is accurate, costs nothing, and still describes the page to anything
 * else reading the markup.
 */
export const faqJsonLd = (page: FaqPage) => {
  const items = (page.items ?? []).filter((item) => item.question && item.answer)
  if (items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** Parties and festivals, for the schedule page. */
export const eventsJsonLd = (events: Event[], settings: SiteSetting) => {
  const dated = events.filter((event) => event.startsAt)
  if (dated.length === 0) return null

  return dated.map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAt as string,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    // A ticket link is the closest thing to an offer the CMS holds. Only an
    // external URL is usable here; an internal link is not somewhere to buy.
    ...(event.ticket?.type === 'external' && event.ticket.url?.trim()
      ? { offers: { '@type': 'Offer', url: event.ticket.url.trim() } }
      : {}),
    ...(event.venue
      ? {
          location: {
            '@type': 'Place',
            name: event.venue,
            address: { '@type': 'PostalAddress', addressLocality: settings.addressLine ?? 'София', addressCountry: 'BG' },
          },
        }
      : {}),
    organizer: { '@type': 'Organization', name: settings.brandName, '@id': `${base()}#school` },
  }))
}
