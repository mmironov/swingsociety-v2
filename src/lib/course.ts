import type { Course, Event } from '../payload-types'
import { type Locale, t } from './i18n'
import { formatDate } from './format'

/**
 * The status shown on the course card. A site-wide "registration closed" switch
 * overrides an individual course's own state — it exists so the school can shut
 * every sign-up off in one click between seasons.
 */
export const courseStatusLabel = (
  course: Pick<Course, 'status'> | null | undefined,
  registrationOpen: boolean | null | undefined,
  locale: Locale,
): string => {
  if (registrationOpen === false) return t('statusSoon', locale)
  switch (course?.status) {
    case 'open':
      return t('statusOpen', locale)
    case 'full':
      return t('statusFull', locale)
    case 'soon':
    default:
      return t('statusSoon', locale)
  }
}

/**
 * A real date when one is set, otherwise the editor's note ("уточнява се").
 * Falling back to a translated default means a half-filled record never renders
 * an empty table cell.
 */
export const startLabel = (course: Course, locale: Locale): string =>
  formatDate(course.startDate, locale) ?? course.startNote ?? t('tbd', locale)

export const eventDateLabel = (event: Event, locale: Locale): string =>
  event.dateLabel?.trim() || formatDate(event.startsAt, locale) || event.dateNote || t('tbd', locale)

/** Tag colour per event type, using the design's three tag variants. */
export const eventTagClass = (type: Event['type']): string => {
  switch (type) {
    case 'festival':
      return 'tag tag-accent tag-md'
    case 'course':
      return 'tag tag-accent-2 tag-md'
    default:
      return 'tag tag-neutral tag-md'
  }
}

export const eventTypeLabel = (type: Event['type'], locale: Locale): string => {
  switch (type) {
    case 'festival':
      return t('typeFestival', locale)
    case 'course':
      return t('typeCourse', locale)
    case 'workshop':
      return t('typeWorkshop', locale)
    default:
      return t('typeParty', locale)
  }
}
