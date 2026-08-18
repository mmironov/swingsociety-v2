import type { CollectionConfig } from 'payload'
import { editors } from '../access'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Записан имейл', plural: 'Записани имейли' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'locale', 'source', 'createdAt'],
    group: 'Заявки',
    description:
      'Имейлите от формата „Кажи ми кога започва“. Пиши на тези хора, когато обявиш нова група.',
  },
  access: {
    // The public form creates these; only logged-in staff may read them.
    create: () => true,
    read: editors,
    update: editors,
    delete: editors,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Имейл',
      required: true,
      index: true,
    },
    {
      name: 'locale',
      type: 'select',
      label: 'Език на посетителя',
      options: [
        { label: 'Български', value: 'bg' },
        { label: 'English', value: 'en' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Откъде е дошъл',
      admin: { readOnly: true, description: 'Страницата, на която е попълнил формата.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Бележки',
      admin: { description: 'За твои бележки — напр. „писано на 12.09“.' },
    },
  ],
  timestamps: true,
}
