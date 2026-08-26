import type { Field } from 'payload'

/**
 * Field shapes common to the globals that back a standalone page.
 *
 * Kept here rather than duplicated because Dances, FAQ and Team moved off the home
 * page into pages of their own, and all four page globals should present the same
 * way in the admin panel: a kicker, a title, a lead paragraph and an SEO tab.
 */
export const pageHeader = ({
  kicker,
  title,
  lead,
}: {
  kicker: string
  title: string
  lead?: string
}): Field[] => [
  {
    name: 'kicker',
    type: 'text',
    label: 'Надзаглавие',
    localized: true,
    defaultValue: kicker,
    admin: { description: 'Малкият текст над заглавието.' },
  },
  {
    name: 'title',
    type: 'textarea',
    label: 'Заглавие',
    localized: true,
    required: true,
    defaultValue: title,
    admin: { description: 'Нов ред в текста става нов ред на сайта.' },
  },
  {
    name: 'lead',
    type: 'textarea',
    label: 'Водещ текст',
    localized: true,
    ...(lead ? { defaultValue: lead } : {}),
    admin: { description: 'Параграфът под заглавието. Може да остане празен.' },
  },
]

/**
 * Title and description for search engines. Both optional: the routes fall back to
 * the page's own title and lead, which is right often enough that filling these in
 * should be a choice rather than a chore.
 */
export const seoGroup = (): Field => ({
  name: 'meta',
  type: 'group',
  label: 'SEO',
  fields: [
    { name: 'title', type: 'text', label: 'Заглавие', localized: true },
    { name: 'description', type: 'textarea', label: 'Описание', localized: true, maxLength: 200 },
  ],
})
