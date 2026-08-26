import React from 'react'
import type { Course, HomePage } from '../../payload-types'
import { type Locale, t } from '../../lib/i18n'
import { startLabel } from '../../lib/course'
import { CmsLink } from '../site/CmsLink'
import { SectionHead } from '../site/SectionHead'
import { SubscribeForm } from '../site/SubscribeForm'

/** One row of the course spec list; skipped entirely when there's no value. */
const Spec = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="specs__row">
    <span className="specs__label">{label}</span>
    <span className="specs__value">{children}</span>
  </div>
)

/**
 * The one offer card: the course, then its locations.
 *
 * The same beginners course runs at two venues on different days, so it is one
 * course with two ways to attend rather than two products. Two identical cards side
 * by side made the visitor compare titles that were the same; a location list makes
 * the actual choice — which night, which side of town — the thing being compared.
 *
 * Facts shared by every location are shown once at the top; anything that differs
 * per venue sits with that venue.
 */
const OfferCard = ({
  courses,
  locale,
  detailLabel,
}: {
  courses: Course[]
  locale: Locale
  detailLabel?: string | null
}) => {
  const first = courses[0]
  if (!first) return null

  const sameForAll = (pick: (c: Course) => string | null | undefined) => {
    const values = courses.map((c) => pick(c)?.trim() || '')
    return values.every((v) => v === values[0]) ? values[0] : ''
  }
  const sharedDuration = sameForAll((c) => c.duration)
  const sharedPrice = sameForAll((c) => c.price)

  // The button destination is the same for every group, so the card carries one.
  const withPage = courses.find((c) => typeof c.page === 'object' && c.page?.slug)

  return (
    <div className="panel">
      <h3 className="panel__title">{first.title}</h3>

      {sharedDuration || sharedPrice ? (
        <div className="specs">
          {sharedDuration ? <Spec label={t('specDuration', locale)}>{sharedDuration}</Spec> : null}
          {sharedPrice ? <Spec label={t('specPrice', locale)}>{sharedPrice}</Spec> : null}
        </div>
      ) : null}

      <div className="locations">
        {courses.map((course) => (
          <div key={course.id} className="locations__item">
            <div className="locations__name">
              {course.mapUrl ? (
                <a href={course.mapUrl} target="_blank" rel="noopener noreferrer">
                  {course.venue ?? t('specVenue', locale)}
                </a>
              ) : (
                (course.venue ?? t('specVenue', locale))
              )}
            </div>
            <div className="locations__facts">
              {[
                [course.day, course.time].filter(Boolean).join(', '),
                `${t('specStart', locale)}: ${startLabel(course, locale)}`,
                !sharedDuration && course.duration ? course.duration : '',
                !sharedPrice && course.price ? `${t('specPrice', locale)}: ${course.price}` : '',
              ]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
        ))}
      </div>

      <div className="panel__actions">
        <CmsLink link={first.registration ?? null} locale={locale} className="btn btn-primary" />
        {withPage && typeof withPage.page === 'object' && withPage.page?.slug ? (
          <CmsLink
            link={{ type: 'page', page: withPage.page, label: detailLabel ?? null }}
            locale={locale}
            className="btn btn-secondary"
            fallbackLabel={withPage.title}
          />
        ) : null}
      </div>
    </div>
  )
}

export const Beginners = ({
  locale,
  beginners,
}: {
  locale: Locale
  beginners: HomePage['beginners']
}) => {
  if (beginners?.enabled === false) return null

  // `groups` supersedes the single `course`. The fallback keeps the offer on screen
  // if a database still has only the old field populated.
  const groups = (beginners?.groups ?? []).filter(
    (item): item is Course => typeof item === 'object' && item !== null,
  )
  const legacy = typeof beginners?.course === 'object' ? (beginners.course as Course) : null
  const courses = groups.length > 0 ? groups : legacy ? [legacy] : []
  const signup = beginners?.signup

  return (
    <section className="section" id="beginners">
      <div className="wrap" data-reveal>
        <SectionHead
          kicker={beginners?.kicker}
          heading={beginners?.heading}
          intro={beginners?.intro}
          introClass="beginners__intro"
        />

        <div className="grid grid--auto-300 beginners__grid">
          <OfferCard
            courses={courses}
            locale={locale}
            detailLabel={beginners?.courseLinkLabel}
          />

          {beginners?.reassurances?.length ? (
            <div className="panel">
              {beginners.reassuranceHeading ? (
                <h3 className="panel__title panel__title--sm">{beginners.reassuranceHeading}</h3>
              ) : null}
              <div className="checklist">
                {beginners.reassurances.map((item) => (
                  <div key={item.id ?? item.text} className="checklist__item">
                    <span className="checklist__mark" aria-hidden="true">
                      ✓
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {signup?.enabled !== false ? (
            <SubscribeForm
              locale={locale}
              heading={signup?.heading}
              body={signup?.body}
              placeholder={signup?.placeholder}
              buttonLabel={signup?.buttonLabel}
              successMessage={signup?.successMessage}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
