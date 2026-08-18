import type { Locale } from './i18n'

const INTL_LOCALE: Record<Locale, string> = { bg: 'bg-BG', en: 'en-GB' }

/** `25 септ. 2026` / `25 Sept 2026` */
export const formatDate = (iso: string | null | undefined, locale: Locale): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Sofia',
  }).format(date)
}

/** `22:00` — the school is in Sofia, so times are always rendered in its zone. */
export const formatTime = (iso: string | null | undefined, locale: Locale): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Sofia',
  }).format(date)
}

/** `22:00 — 04:00`, collapsing to a single time when there is no end. */
export const formatTimeRange = (
  start: string | null | undefined,
  end: string | null | undefined,
  locale: Locale,
): string | null => {
  const from = formatTime(start, locale)
  if (!from) return null
  const to = formatTime(end, locale)
  return to ? `${from} — ${to}` : from
}

/** Google Calendar wants `YYYYMMDDTHHMMSSZ` in UTC. */
const toCalendarStamp = (iso: string): string =>
  new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/**
 * "Add to calendar" URL. Returns null without a start time — the design made the
 * date itself the link, and a link that opens an empty calendar entry is worse
 * than plain text.
 */
export const googleCalendarUrl = ({
  title,
  start,
  end,
  location,
  details,
}: {
  title: string
  start?: string | null
  end?: string | null
  location?: string | null
  details?: string | null
}): string | null => {
  if (!start) return null
  const startStamp = toCalendarStamp(start)
  // Default to a three-hour slot when no end is given — long enough to read as
  // an evening event rather than a moment.
  const endStamp = toCalendarStamp(end ?? new Date(new Date(start).getTime() + 3 * 3600_000).toISOString())

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStamp}/${endStamp}`,
  })
  if (location) params.set('location', location)
  if (details) params.set('details', details)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Normalises a YouTube or Vimeo watch URL into its embeddable form. Returns null
 * for anything unrecognised, so an editor pasting a random link gets the
 * placeholder tile instead of a broken iframe.
 */
export const toEmbedUrl = (url: string | null | undefined): string | null => {
  if (!url) return null
  const trimmed = url.trim()
  if (trimmed === '') return null

  // Already an embed URL.
  if (/^https?:\/\/(www\.)?(youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/i.test(trimmed)) {
    return trimmed
  }

  const youtube =
    trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i)?.[1]
  if (youtube) return `https://www.youtube.com/embed/${youtube}`

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i)?.[1]
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}`

  return null
}

/** Splits a textarea value into lines so a CMS newline becomes a real <br>. */
export const toLines = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')
