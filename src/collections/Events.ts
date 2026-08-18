import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Събитие', plural: 'Събития' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startsAt', 'featured'],
    group: 'Съдържание',
    description:
      'Партита, фестивали и начала на групи. Подреждат се по дата; тези без дата излизат последни. Началната страница показва първите три.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: 'startsAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Име на събитието',
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Вид',
      required: true,
      defaultValue: 'party',
      options: [
        { label: 'Фестивал', value: 'festival' },
        { label: 'Парти', value: 'party' },
        { label: 'Курс', value: 'course' },
        { label: 'Работилница', value: 'workshop' },
      ],
      admin: { description: 'Определя цвета на етикета.' },
    },
    {
      name: 'startsAt',
      type: 'date',
      label: 'Начало',
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'd MMM yyyy, HH:mm' },
        description:
          'Остави празно, докато датата не е ясна. Попълнена дата прави датата в графика връзка „Добави в календара“.',
      },
    },
    {
      name: 'endsAt',
      type: 'date',
      label: 'Край',
      admin: {
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'd MMM yyyy, HH:mm' },
        description: 'Нужно за връзката към Google Calendar.',
      },
    },
    {
      name: 'dateNote',
      type: 'text',
      label: 'Бележка вместо дата',
      localized: true,
      defaultValue: 'датата се уточнява',
      admin: { description: 'Показва се, когато няма начална дата.' },
    },
    {
      name: 'dateLabel',
      type: 'text',
      label: 'Как да се изпише датата',
      localized: true,
      admin: {
        description:
          'По желание. За многодневни събития напиши напр. „25—27 септ. 2026“; иначе датата се форматира автоматично.',
      },
    },
    {
      name: 'timeNote',
      type: 'text',
      label: 'Час (текст)',
      localized: true,
      admin: { description: 'напр. „22:00 — 04:00“ или „часът се уточнява“.' },
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Локация',
      localized: true,
    },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Връзка към картата',
    },
    linkField({ name: 'ticket', label: 'Връзка за билети/записване', defaultLabel: 'Записване' }),
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Показвай на началната страница',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'showOnSchedule',
      type: 'checkbox',
      label: 'Показвай в графика',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: revalidateHooks,
}
