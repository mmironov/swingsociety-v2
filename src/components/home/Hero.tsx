import React from 'react'
import type { Course, HomePage, SiteSetting } from '../../payload-types'
import { type Locale, t } from '../../lib/i18n'
import { formatDayMonth } from '../../lib/format'
import { toLines } from '../../lib/format'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { CmsLink } from '../site/CmsLink'

/**
 * MOCK — Option A: the hero leads with the offer.
 *
 * The h1 was the slogan ("Танцувай като през 30-те"), which is the highest-weighted
 * text on the site's most important page spent on words nobody searches for. Here
 * the slogan becomes the tagline above it and the h1 states what is being sold.
 *
 * The facts line is derived from the courses, never typed: next start date and the
 * venues come from the group records, so the hero cannot advertise a date that has
 * passed. With no upcoming group it says so and sends people to the email form
 * instead of to a sign-up for something that has already started.
 */

/** Stand-in for a CMS field. Real version would be hero.offerHeading, localized. */
const MOCK_OFFER_HEADING: Record<Locale, string> = {
  // No hard line breaks: Bulgarian runs about a third longer than English, and
  // fixed breaks wrapped again inside the column — five lines that crowded the
  // photo and pushed the buttons off the first screen. A max-width does the job at
  // every width instead of at one.
  bg: 'Суинг за начинаещи в София',
  en: 'Beginner swing course in Sofia',
}

const upcoming = (groups: Course[]) => {
  const now = Date.now()
  return groups
    .filter((c) => c.startDate && new Date(c.startDate).getTime() > now)
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)))
}

export const Hero = ({
  locale,
  hero,
  badge,
  groups = [],
}: {
  locale: Locale
  hero: HomePage['hero']
  badge: SiteSetting['heroBadge']
  groups?: Course[]
}) => {
  const photo = mediaUrl(hero.photo, 1200)

  const open = upcoming(groups)
  const next = open[0]
  const venues = [...new Set(open.map((c) => c.venue?.trim()).filter(Boolean))] as string[]

  // Venue names are long ("Национален Студентски Дом, зала 404"). One venue is
  // worth naming; more than one is worth counting, and the names are in the card
  // immediately below.
  const where =
    venues.length === 1 ? venues[0] : venues.length > 1 ? `${venues.length} ${t('heroLocations', locale)}` : ''

  const facts = next
    ? [
        `${t('heroNextStart', locale)} ${formatDayMonth(next.startDate, locale)}`,
        where,
        t('heroNoPartner', locale),
      ].filter(Boolean)
    : [t('heroFormingSoon', locale), t('heroNoPartner', locale)]

  return (
    <header className="hero" id="top">
      <div className="hero__glow" />
      <div className={photo ? 'hero__inner' : 'hero__inner hero__inner--no-photo'}>
        <div className="hero__text">
          {badge ? <div className="hero__badge">{badge}</div> : null}

          {/* The slogan, demoted from h1 to tagline. */}
          {hero.heading ? (
            <div className="hero__tagline">{toLines(hero.heading).join(' ')}</div>
          ) : null}

          <h1 className="hero__title hero__title--offer">
            {MOCK_OFFER_HEADING[locale]}
          </h1>

          <ul className="hero__facts">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          <div className="hero__cta">
            {next ? (
              <CmsLink link={next.registration ?? null} locale={locale} className="btn btn-primary" />
            ) : (
              <CmsLink link={hero.primaryCta ?? null} locale={locale} className="btn btn-primary" />
            )}
            <CmsLink link={hero.secondaryCta ?? null} locale={locale} className="btn btn-outline" />
          </div>
        </div>

        {photo ? (
          <img
            className="hero__photo"
            src={photo}
            alt={mediaAlt(hero.photo)}
            style={{ objectPosition: focalPosition(hero.photo) }}
          />
        ) : null}
      </div>
    </header>
  )
}
