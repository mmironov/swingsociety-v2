import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { editors, publishedOrEditor } from '../access'
import { slugField } from '../fields/slug'
import { linkField } from '../fields/link'
import { pageBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Страница', plural: 'Страници' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kicker', 'slug', '_status', 'updatedAt'],
    group: 'Съдържание',
    description:
      'Отделните страници — курсове, танци, всичко, което има свой адрес. Съдържанието се сглобява от блокове.',
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/${locale?.code ?? 'bg'}/${data?.slug ?? ''}`,
    },
  },
  access: { read: publishedOrEditor, create: editors, update: editors, delete: editors },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Съдържание',
          fields: [
            {
              name: 'kicker',
              type: 'text',
              label: 'Надзаглавие',
              localized: true,
              admin: { description: 'Малкият текст над заглавието, напр. „Курс“ или „Танц“.' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Заглавие',
              required: true,
              localized: true,
            },
            {
              name: 'lead',
              type: 'textarea',
              label: 'Водещ параграф',
              localized: true,
              admin: { description: 'Големият текст под заглавието. Едно-две изречения.' },
            },
            {
              name: 'hero',
              type: 'group',
              label: 'Голяма снимка или видео',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Вид',
                  defaultValue: 'image',
                  options: [
                    { label: 'Снимка', value: 'image' },
                    { label: 'Видео', value: 'video' },
                    { label: 'Без', value: 'none' },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Снимка',
                  admin: { condition: (_, s) => s?.type === 'image' },
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  label: 'Връзка към видеото',
                  admin: {
                    condition: (_, s) => s?.type === 'video',
                    description: 'YouTube или Vimeo адрес.',
                  },
                },
                {
                  name: 'poster',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Кадър преди пускане',
                  admin: { condition: (_, s) => s?.type === 'video' },
                },
              ],
            },
            {
              name: 'blocks',
              type: 'blocks',
              label: 'Блокове',
              labels: { singular: 'блок', plural: 'блокове' },
              blocks: pageBlocks,
              admin: {
                description:
                  'Добавяй заглавия, текст, списъци, цитати, снимки и видеа. Влачи ги, за да смениш реда.',
              },
            },
          ],
        },
        {
          label: 'Бутон долу',
          fields: [
            linkField({ name: 'cta', label: 'Бутон в края на страницата', defaultLabel: 'Запиши се' }),
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Как изглежда в Google и в социалните мрежи',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Заглавие',
                  localized: true,
                  admin: { description: 'Оставиш ли празно, се използва заглавието на страницата.' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Описание',
                  localized: true,
                  maxLength: 200,
                  admin: { description: 'Оставиш ли празно, се използва водещият параграф.' },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Снимка при споделяне',
                  admin: { description: 'Оставиш ли празно, се използва голямата снимка на страницата.' },
                },
              ],
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
  hooks: revalidateHooks,
}
