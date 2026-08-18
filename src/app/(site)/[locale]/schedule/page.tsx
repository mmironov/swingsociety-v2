import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, isLocale, path, t } from '../../../../lib/i18n'
import {
  getSchedulePage,
  getScheduleCourses,
  getSiteSettings,
  getUpcomingEvents,
} from '../../../../lib/content'
import { eventTagClass, eventTypeLabel, eventDateLabel, startLabel } from '../../../../lib/course'
import { formatTimeRange, googleCalendarUrl } from '../../../../lib/format'
import { resolveLink } from '../../../../lib/links'
import { SiteHeader } from '../../../../components/site/SiteHeader'
import { Footer } from '../../../../components/site/Footer'
import { CmsLink } from '../../../../components/site/CmsLink'
import { RichText, isRichTextEmpty } from '../../../../components/site/RichText'
import { CalendarIcon } from '../../../../components/site/Icons'

type Props = { params: Promise<{ locale: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const page = await getSchedulePage(locale)

  return {
    // An SEO title written in the CMS is used verbatim — the editor already
    // decided whether the brand name belongs in it. Only the plain page title
    // gets the "· Swing Society" suffix from the layout template.
    title: page.meta?.title ? { absolute: page.meta.title } : page.title,
    description: page.meta?.description || page.lead || undefined,
    alternates: { canonical: path('/schedule', locale) },
  }
}

const MapLink = ({ venue, mapUrl }: { venue?: string | null; mapUrl?: string | null }) => {
  if (!venue) return null
  if (!mapUrl) return <>{venue}</>
  return (
    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="cell--strong">
      {venue}
    </a>
  )
}

const ScheduleRoute = async ({ params }: Props) => {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [settings, page, courses, events] = await Promise.all([
    getSiteSettings(locale),
    getSchedulePage(locale),
    getScheduleCourses(locale),
    getUpcomingEvents(locale),
  ])

  return (
    <>
      <SiteHeader locale={locale} currentPath="/schedule" />
      <div className="shell">
        <main className="schedule">
          <Link className="back-link" href={path('/', locale)}>
            {t('backHome', locale)}
          </Link>

          {page.kicker ? <div className="kicker article__kicker">{page.kicker}</div> : null}
          <h1 className="schedule__title">{page.title}</h1>
          {page.lead ? <p className="schedule__lead">{page.lead}</p> : null}

          {/* ── Groups ─────────────────────────────────────────────────── */}
          <h2 className="schedule__h2">{page.groupsHeading}</h2>
          {courses.length > 0 ? (
            <div className="table-wrap">
              <table className="table table--groups">
                <thead>
                  <tr>
                    <th>{t('colGroup', locale)}</th>
                    <th>{t('colDay', locale)}</th>
                    <th>{t('colTime', locale)}</th>
                    <th>{t('colLocation', locale)}</th>
                    <th>{t('colStart', locale)}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const detailPage = typeof course.page === 'object' ? course.page : null
                    return (
                      <tr key={course.id}>
                        <td style={{ minWidth: 250 }}>
                          {detailPage?.slug ? (
                            <Link className="group-name" href={path(`/${detailPage.slug}`, locale)}>
                              {course.title}
                            </Link>
                          ) : (
                            <span className="group-name">{course.title}</span>
                          )}
                          {course.subtitle ? <div className="group-sub">{course.subtitle}</div> : null}
                        </td>
                        <td className="cell--nowrap cell--strong">{course.day ?? t('tbd', locale)}</td>
                        <td className="cell--nowrap">{course.time ?? t('tbd', locale)}</td>
                        <td>
                          <MapLink venue={course.venue} mapUrl={course.mapUrl} />
                        </td>
                        <td className="cell--nowrap">
                          <span className="tag tag-accent-2 tag-md">{startLabel(course, locale)}</span>
                        </td>
                        <td className="cell--right">
                          <CmsLink
                            link={course.registration ?? null}
                            locale={locale}
                            className="btn btn-primary"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="schedule__note">{page.emptyNote}</p>
          )}

          {!isRichTextEmpty(page.groupsNote) ? (
            <RichText value={page.groupsNote} locale={locale} className="schedule__note" />
          ) : null}

          {/* ── Parties and festivals ──────────────────────────────────── */}
          <h2 className="schedule__h2">{page.eventsHeading}</h2>
          {events.length > 0 ? (
            <div className="table-wrap">
              <table className="table table--events">
                <thead>
                  <tr>
                    <th>{t('colDate', locale)}</th>
                    <th>{t('colTime', locale)}</th>
                    <th>{t('colEvent', locale)}</th>
                    <th>{t('colLocation', locale)}</th>
                    <th style={{ textAlign: 'right' }}>{t('colTickets', locale)}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const dateText = eventDateLabel(event, locale)
                    const calendar = googleCalendarUrl({
                      title: event.title,
                      start: event.startsAt,
                      end: event.endsAt,
                      location: event.venue,
                      details: resolveLink(event.ticket ?? null, locale)?.href,
                    })
                    const timeText =
                      event.timeNote?.trim() ||
                      formatTimeRange(event.startsAt, event.endsAt, locale) ||
                      t('tbd', locale)

                    return (
                      <tr key={event.id}>
                        <td className="cell--nowrap">
                          {calendar ? (
                            <a
                              className="cal-link"
                              href={calendar}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={t('addToCalendar', locale)}
                            >
                              <CalendarIcon />
                              {dateText}
                            </a>
                          ) : (
                            <span className="cell--strong">{dateText}</span>
                          )}
                        </td>
                        <td className="cell--nowrap cell--muted">{timeText}</td>
                        <td style={{ minWidth: 230 }}>
                          {event.title}{' '}
                          <span className={eventTagClass(event.type)} style={{ marginLeft: 8 }}>
                            {eventTypeLabel(event.type, locale)}
                          </span>
                        </td>
                        <td>
                          <MapLink venue={event.venue} mapUrl={event.mapUrl} />
                        </td>
                        <td className="cell--right">
                          <CmsLink link={event.ticket ?? null} locale={locale} className="cell--strong">
                            {event.ticket?.label ? `${event.ticket.label} →` : null}
                          </CmsLink>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="schedule__note">{page.emptyNote}</p>
          )}

          <div className="schedule__actions">
            <CmsLink link={page.primaryCta ?? null} locale={locale} className="btn btn-primary" />
            <CmsLink link={page.secondaryCta ?? null} locale={locale} className="btn btn-secondary" />
          </div>
        </main>

        <Footer locale={locale} settings={settings} variant="slim" />
      </div>
    </>
  )
}

export default ScheduleRoute
