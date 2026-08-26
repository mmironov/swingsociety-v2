export const LOCALES = ['bg', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'bg'

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value)

export const LOCALE_LABELS: Record<Locale, string> = { bg: 'Български', en: 'English' }
export const HTML_LANG: Record<Locale, string> = { bg: 'bg-BG', en: 'en' }

/**
 * Navigational micro-copy — back links, table column headings, form status.
 *
 * The dividing line: anything the school would want to *rewrite* lives in the
 * CMS; the structural labels that only ever need translating live here, so the
 * admin panel stays about content rather than button words.
 */
const STRINGS = {
  home: { bg: 'Начало', en: 'Home' },
  openInNewTab: { bg: 'Отвори в нов таб', en: 'Open in a new tab' },
  embedFallback: {
    bg: 'Ако формата не се показва, отвори я директно:',
    en: 'If the form does not appear, open it directly:',
  },
  backHome: { bg: '← Начало', en: '← Home' },
  allDances: { bg: 'Всички танци', en: 'All dances' },
  schedule: { bg: 'График', en: 'Schedule' },
  menu: { bg: 'Меню', en: 'Menu' },
  closeMenu: { bg: 'Затвори менюто', en: 'Close menu' },
  switchLanguage: { bg: 'Смени езика', en: 'Switch language' },

  // Schedule tables
  colGroup: { bg: 'Група', en: 'Group' },
  colDay: { bg: 'Ден', en: 'Day' },
  colTime: { bg: 'Час', en: 'Time' },
  colLocation: { bg: 'Локация', en: 'Location' },
  colStart: { bg: 'Старт', en: 'Starts' },
  colDate: { bg: 'Дата', en: 'Date' },
  colEvent: { bg: 'Събитие', en: 'Event' },
  colTickets: { bg: 'Билети', en: 'Tickets' },
  addToCalendar: { bg: 'Добави в календара', en: 'Add to calendar' },
  details: { bg: 'Детайли', en: 'Details' },

  // Event type tags
  typeFestival: { bg: 'Фестивал', en: 'Festival' },
  typeParty: { bg: 'Парти', en: 'Party' },
  typeCourse: { bg: 'Курс', en: 'Course' },
  typeWorkshop: { bg: 'Работилница', en: 'Workshop' },

  // Course spec table
  specDuration: { bg: 'Продължителност', en: 'Duration' },
  specStart: { bg: 'Начало', en: 'Starts' },
  specWhen: { bg: 'Кога', en: 'When' },
  specPrice: { bg: 'Цена', en: 'Price' },
  specVenue: { bg: 'Зала', en: 'Venue' },
  statusOpen: { bg: 'Записването е отворено', en: 'Registration open' },
  statusSoon: { bg: 'Скоро', en: 'Coming soon' },
  statusFull: { bg: 'Запълнена', en: 'Full' },
  tbd: { bg: 'уточнява се', en: 'to be confirmed' },

  // Signup form
  emailLabel: { bg: 'Имейл адрес', en: 'Email address' },
  signupSending: { bg: 'Изпраща се…', en: 'Sending…' },
  signupError: {
    bg: 'Нещо не се получи. Опитай пак или ни писни на имейла.',
    en: 'That did not go through. Try again, or send us an email.',
  },
  signupInvalid: { bg: 'Провери имейл адреса.', en: 'Please check the email address.' },

  // 404
  notFoundTitle: { bg: 'Тази страница я няма', en: 'This page does not exist' },
  notFoundBody: {
    bg: 'Може да е преместена или адресът да е сгрешен. Опитай от началото.',
    en: 'It may have moved, or the address has a typo. Try starting from the home page.',
  },
  playVideo: { bg: 'Пусни видеото', en: 'Play video' },
} as const

export type StringKey = keyof typeof STRINGS

/** `t('colGroup', 'en')` → `'Group'` */
export const t = (key: StringKey, locale: Locale): string => STRINGS[key][locale]

/** Builds a locale-prefixed path: `path('/schedule', 'en')` → `/en/schedule`. */
export const path = (to: string, locale: Locale): string => {
  const clean = to === '/' ? '' : to.startsWith('/') ? to : `/${to}`
  return `/${locale}${clean}`
}
