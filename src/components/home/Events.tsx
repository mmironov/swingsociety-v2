import Link from 'next/link'
import type { Event, HomePage } from '../../payload-types'
import { type Locale, path } from '../../lib/i18n'
import { eventDateLabel, eventTagClass, eventTypeLabel } from '../../lib/course'
import { resolveLink } from '../../lib/links'
import { CmsLink } from '../site/CmsLink'
import { SectionHead } from '../site/SectionHead'

export const Events = ({
  locale,
  events,
  items,
}: {
  locale: Locale
  events: HomePage['events']
  items: Event[]
}) => {
  if (events?.enabled === false || items.length === 0) return null

  return (
    <section className="section section--tight-top" id="events">
      <div className="wrap" data-reveal>
        <SectionHead
          kicker={events?.kicker}
          heading={events?.heading}
          intro={events?.intro}
          introClass="section__intro"
        >
          <CmsLink link={events?.allLink ?? null} locale={locale}>
            {events?.allLink?.label ? `${events.allLink.label} →` : null}
          </CmsLink>
        </SectionHead>

        <div className="events__list">
          {items.map((event) => {
            // Prefer the event's own ticket link; otherwise send people to the
            // full schedule, which is where every date lives.
            const ticket = resolveLink(event.ticket ?? null, locale)
            const href = ticket?.href ?? path('/schedule', locale)
            const external = ticket?.external ?? false

            const body = (
              <>
                <span className="event-row__date">{eventDateLabel(event, locale)}</span>
                <span className="event-row__title">{event.title}</span>
                <span className={eventTagClass(event.type)}>{eventTypeLabel(event.type, locale)}</span>
              </>
            )

            return external ? (
              <a
                key={event.id}
                className="event-row"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {body}
              </a>
            ) : (
              <Link key={event.id} className="event-row" href={href}>
                {body}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
