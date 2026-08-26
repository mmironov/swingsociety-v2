import type { GlobalConfig } from 'payload'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'
import { revalidateGlobalHooks } from '../hooks/revalidate'
import { pageHeader, seoGroup } from './shared'

/**
 * The dances page, moved off the home page so the front page stays short.
 *
 * The cards are drawn from Pages: each shows that page's title, lead and hero
 * image, so a dance is described once and appears here automatically.
 */
export const DancesPage: GlobalConfig = {
  slug: 'dances-page',
  label: 'Страница „Танци“',
  admin: {
    group: 'Съдържание',
    description: 'Страницата с танцовите стилове (/dances).',
    livePreview: {
      url: ({ locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/${locale?.code ?? 'bg'}/dances`,
    },
  },
  access: { read: anyone, update: editors },
  versions: { drafts: false, max: 25 },
  fields: [
    ...pageHeader({ kicker: 'Танци', title: 'Три езика на суинга' }),
    linkField({ name: 'introLink', label: 'Връзка в края на въвеждащия текст' }),
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      label: 'Кои страници',
      admin: {
        description:
          'Всяка карта показва заглавието, водещия параграф и голямата снимка на избраната страница. Редът тук е редът на картите.',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: 'Текст на връзката в картите',
      localized: true,
      defaultValue: 'Виж повече',
    },
    seoGroup(),
  ],
  hooks: revalidateGlobalHooks,
}
