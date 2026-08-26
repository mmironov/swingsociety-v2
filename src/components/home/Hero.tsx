import React from 'react'
import type { Course, HomePage, SiteSetting } from '../../payload-types'
import { type Locale, t } from '../../lib/i18n'
import { formatDayMonth } from '../../lib/format'
import { toLines } from '../../lib/format'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { CmsLink } from '../site/CmsLink'

/**
 * The hero leads with the offer.
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

  const facts = next
    ? [
        `${t('heroNextStart', locale)} ${formatDayMonth(next.startDate, locale)}`,
        t('heroNoPartner', locale),
      ]
    : [t('heroFormingSoon', locale), t('heroNoPartner', locale)]

  /**
   * Each group as "where — when". The venue is what decides which group somebody
   * joins, so it is named rather than counted; venueShort keeps the full
   * "Национален Студентски Дом, зала 404" out of a headline, falling back to the
   * full name when nobody has set a short one.
   */
  const where = open.map((course) => ({
    id: course.id,
    place: course.venueShort?.trim() || course.venue?.trim() || '',
    when: [course.day, course.time].filter(Boolean).join(', '),
  }))

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
            {hero.offerHeading}
          </h1>

          <ul className="hero__facts">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          {where.length > 0 ? (
            <ul className="hero__where">
              {where.map((group) => (
                <li key={group.id}>
                  <span className="hero__where-place">{group.place}</span>
                  {group.when ? <span className="hero__where-when">{group.when}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}

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
