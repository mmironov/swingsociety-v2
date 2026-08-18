import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзив', plural: 'Отзиви' },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'source', 'published', 'order'],
    group: 'Съдържание',
    description:
      'Отзивите в секция „Какво казват танцуващите“. Копирай ги дословно от Google — не ги преразказвай.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: 'order',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      label: 'Текст на отзива',
      required: true,
      localized: true,
      admin: {
        description:
          'Без кавички — те се добавят от дизайна. Ако отзивът е на български, преводът на английски е по избор.',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Име на автора',
      required: true,
      admin: { description: 'Както е в Google. Само първо име също е добре.' },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Откъде е',
      localized: true,
      defaultValue: 'Google отзив',
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Връзка към отзива',
      admin: { description: 'По желание — прави името на автора връзка.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Показвай на сайта',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ред',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
  hooks: revalidateHooks,
}
