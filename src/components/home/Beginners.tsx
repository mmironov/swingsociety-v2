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
 * One open group: what it costs, when it starts, where, and how to join.
 *
 * There is a card per group rather than one featured course, because the school
 * runs two beginner groups at different venues and the venue is often what decides
 * which one someone picks.
 */
const GroupCard = ({
  course,
  locale,
  detailLabel,
}: {
  course: Course
  locale: Locale
  detailLabel?: string | null
}) => (
  <div className="panel">
    <h3 className="panel__title">{course.title}</h3>

    <div className="specs">
      {course.duration ? <Spec label={t('specDuration', locale)}>{course.duration}</Spec> : null}
      <Spec label={t('specStart', locale)}>{startLabel(course, locale)}</Spec>
      {course.day || course.time ? (
        <Spec label={t('specWhen', locale)}>
          {[course.day, course.time].filter(Boolean).join(', ')}
        </Spec>
      ) : null}
      {course.price ? <Spec label={t('specPrice', locale)}>{course.price}</Spec> : null}
      {course.venue ? (
        <Spec label={t('specVenue', locale)}>
          {course.mapUrl ? (
            <a href={course.mapUrl} target="_blank" rel="noopener noreferrer">
              {course.venue}
            </a>
          ) : (
            course.venue
          )}
        </Spec>
      ) : null}
    </div>

    <div className="panel__actions">
      <CmsLink link={course.registration ?? null} locale={locale} className="btn btn-primary" />
      {typeof course.page === 'object' && course.page?.slug ? (
        <CmsLink
          link={{ type: 'page', page: course.page, label: detailLabel ?? null }}
          locale={locale}
          className="btn btn-secondary"
          fallbackLabel={course.title}
        />
      ) : null}
    </div>
  </div>
)

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
          {courses.map((course) => (
            <GroupCard
              key={course.id}
              course={course}
              locale={locale}
              detailLabel={beginners?.courseLinkLabel}
            />
          ))}

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
