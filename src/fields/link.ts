import type { Field } from 'payload'

/**
 * Anchors on the home page an editor is allowed to link to. Keep in sync with
 * the `id` attributes rendered by src/app/(site)/[locale]/page.tsx.
 */
export const HOME_SECTIONS = [
  { label: 'Начинаещи / Beginners', value: 'beginners' },
  { label: 'Отзиви / Reviews', value: 'reviews' },
  { label: 'Танци / Dances', value: 'dances' },
  { label: 'Въпроси / FAQ', value: 'faq' },
  { label: 'Събития / Events', value: 'events' },
  { label: 'Екип / Team', value: 'team' },
  { label: 'За нас / About', value: 'about' },
  { label: 'Контакти / Contact', value: 'contact' },
] as const

type LinkOptions = {
  /** Field name. Defaults to `link`. */
  name?: string
  label?: string
  /** Show a localized label field alongside the destination. */
  withLabel?: boolean
  /** Default text for the label field. */
  defaultLabel?: string
  required?: boolean
}

/**
 * One destination, four shapes — the same three the design's `href()` helper
 * understood (external URL, home-page anchor, detail page) plus the schedule
 * page, which has its own route rather than a CMS record.
 *
 * Resolved for rendering by `resolveLink()` in src/lib/links.ts.
 */
export const linkField = ({
  name = 'link',
  label = 'Връзка',
  withLabel = true,
  defaultLabel,
  required = false,
}: LinkOptions = {}): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    ...(withLabel
      ? ([
          {
            name: 'label',
            type: 'text',
            label: 'Текст на бутона/връзката',
            localized: true,
            required,
            ...(defaultLabel ? { defaultValue: defaultLabel } : {}),
          },
        ] as Field[])
      : []),
    {
      name: 'type',
      type: 'select',
      label: 'Вид на връзката',
      required: true,
      // An optional link starts as "none" so a field left untouched simply
      // renders no button, rather than demanding an address.
      defaultValue: required ? 'external' : 'none',
      options: [
        ...(required ? [] : [{ label: 'Без връзка', value: 'none' }]),
        { label: 'Външен адрес (https://…)', value: 'external' },
        { label: 'Страница от сайта', value: 'page' },
        { label: 'Секция от началната страница', value: 'section' },
        { label: 'Графикът', value: 'schedule' },
        { label: 'Началната страница', value: 'home' },
      ],
      admin: { description: 'Определя коя от долните настройки се използва.' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Адрес',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'external',
        description: 'Пълен адрес, например https://swingbuzz.eu',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: unknown }) => {
        const type = (siblingData as { type?: string } | undefined)?.type
        if (type !== 'external') return true
        if (typeof value !== 'string' || value.trim() === '') return 'Въведи адрес.'
        // tel: and mailto: are legitimate destinations for contact buttons.
        if (/^(https?:\/\/|mailto:|tel:)/.test(value)) return true
        return 'Адресът трябва да започва с https://, mailto: или tel:'
      },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Страница',
      admin: { condition: (_, siblingData) => siblingData?.type === 'page' },
    },
    {
      name: 'section',
      type: 'select',
      label: 'Секция',
      options: HOME_SECTIONS.map((s) => ({ label: s.label, value: s.value })),
      admin: { condition: (_, siblingData) => siblingData?.type === 'section' },
    },
  ],
})
