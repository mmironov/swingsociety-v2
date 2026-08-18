import React from 'react'
import Link from 'next/link'
import type { Course, HomePage, SiteSetting } from '../../payload-types'
import { type Locale, path } from '../../lib/i18n'
import { toLines } from '../../lib/format'
import { courseStatusLabel } from '../../lib/course'
import { mediaAlt, mediaUrl } from '../../lib/media'
import { resolveLink } from '../../lib/links'

const Lines = ({ value }: { value?: string | null }) => (
  <>
    {toLines(value).map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 ? <br /> : null}
        {line}
      </React.Fragment>
    ))}
  </>
)

export const PromoCards = ({
  locale,
  courseCard,
  festivalCard,
  registrationOpen,
}: {
  locale: Locale
  courseCard: HomePage['courseCard']
  festivalCard: HomePage['festivalCard']
  registrationOpen: SiteSetting['registrationOpen']
}) => {
  const course = typeof courseCard?.course === 'object' ? (courseCard.course as Course) : null

  // The whole card is the link, so it needs a single destination: the course's
  // own detail page.
  const coursePage = typeof course?.page === 'object' ? course.page : null
  const courseHref = coursePage?.slug ? path(`/${coursePage.slug}`, locale) : null
  const showCourse = courseCard?.enabled !== false && course && courseHref

  const festivalLink = resolveLink(festivalCard?.link ?? null, locale)
  const showFestival = festivalCard?.enabled !== false && festivalLink
  const festivalLogo = mediaUrl(festivalCard?.logo, 200)

  if (!showCourse && !showFestival) return null

  return (
    <section className="promo">
      <div className="wrap grid grid--auto-320">
        {showCourse ? (
          <Link href={courseHref} className="promo__card card-lift">
            <div className="promo__top">
              {courseCard?.badge ? (
                <span className="tag tag-accent tag-sm">{courseCard.badge}</span>
              ) : null}
              <span className="promo__meta">
                {courseStatusLabel(course, registrationOpen, locale)}
              </span>
            </div>

            <h2 className="promo__title">
              <Lines value={course.title} />
            </h2>

            {course.summary ? <p className="promo__body">{course.summary}</p> : null}

            {course.tags?.length ? (
              <div className="promo__tags">
                {course.tags.map((tag) => (
                  <span key={tag.id ?? tag.label} className="tag tag-neutral tag-md">
                    {tag.label}
                  </span>
                ))}
              </div>
            ) : null}

            {courseCard?.linkLabel ? (
              <span className="promo__more">{courseCard.linkLabel} →</span>
            ) : null}
          </Link>
        ) : null}

        {showFestival ? (
          <a
            className="promo__card promo__card--festival card-lift"
            href={festivalLink.href}
            {...(festivalLink.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <div className="promo__top">
              {festivalCard?.badge ? (
                <span className="tag tag--festival tag-sm">{festivalCard.badge}</span>
              ) : null}
              {festivalCard?.dates ? <span className="promo__meta">{festivalCard.dates}</span> : null}
            </div>

            {festivalCard?.heading ? (
              <h2 className="promo__title">
                <Lines value={festivalCard.heading} />
              </h2>
            ) : null}

            {festivalCard?.body ? <p className="promo__body">{festivalCard.body}</p> : null}

            {festivalLogo ? (
              <img
                className="promo__logo"
                src={festivalLogo}
                alt={mediaAlt(festivalCard?.logo, festivalCard?.badge ?? '')}
              />
            ) : null}

            {festivalLink.label ? <span className="promo__more">{festivalLink.label} →</span> : null}
          </a>
        ) : null}
      </div>
    </section>
  )
}
