import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Курс / група', plural: 'Курсове и групи' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', 'status', 'startDate', 'order'],
    group: 'Съдържание',
    description:
      'Групите, които се показват в таблицата на графика и в секция „Начинаещи“. Полетата за дата и цена може да останат празни — тогава се показва бележката до тях („уточнява се“).',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: 'order',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основно',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Име на групата',
              required: true,
              localized: true,
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Подзаглавие',
              localized: true,
              admin: {
                description: 'Малкият ред под името в таблицата, напр. „11 класа по 70 минути · без партньор“.',
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Кратко описание',
              localized: true,
              admin: { description: 'Използва се в картата на началната страница.' },
            },
            {
              name: 'level',
              type: 'text',
              label: 'Ниво',
              localized: true,
              admin: { description: 'напр. „Начинаещи“' },
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Етикети',
              labels: { singular: 'Етикет', plural: 'Етикети' },
              admin: {
                description: 'Малките капсули в картата, напр. „11 класа по 70 минути“, „Без партньор“.',
              },
              fields: [{ name: 'label', type: 'text', label: 'Текст', localized: true, required: true }],
            },
          ],
        },
        {
          label: 'Кога и къде',
          fields: [
            {
              name: 'duration',
              type: 'text',
              label: 'Продължителност',
              localized: true,
              admin: { description: 'напр. „11 класа по 70 мин“' },
            },
            {
              name: 'startDate',
              type: 'date',
              label: 'Начална дата',
              admin: {
                date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
                description: 'Остави празно, докато датата не е ясна — тогава се показва бележката отдолу.',
              },
            },
            {
              name: 'startNote',
              type: 'text',
              label: 'Бележка вместо дата',
              localized: true,
              defaultValue: 'уточнява се',
              admin: { description: 'Показва се само когато няма начална дата.' },
            },
            {
              name: 'day',
              type: 'text',
              label: 'Ден от седмицата',
              localized: true,
              defaultValue: 'уточнява се',
            },
            {
              name: 'time',
              type: 'text',
              label: 'Час',
              localized: true,
              defaultValue: 'уточнява се',
            },
            {
              name: 'price',
              type: 'text',
              label: 'Цена',
              localized: true,
              defaultValue: 'уточнява се',
            },
            {
              name: 'venue',
              type: 'text',
              label: 'Зала',
              localized: true,
              admin: { description: 'напр. „Национален студентски дом, София“' },
            },
            {
              name: 'venueShort',
              type: 'text',
              label: 'Кратко име на залата',
              localized: true,
              admin: {
                description:
                  'Как да се напише залата, когато мястото е малко — на началната страница например. Едно-две разпознаваеми думи: „Лозенец“, „Студентски дом“. Празно означава пълното име.',
              },
            },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Връзка към картата',
              admin: { description: 'Google Maps адрес на залата.' },
            },
          ],
        },
        {
          label: 'Записване',
          fields: [
            {
              name: 'status',
              type: 'select',
              label: 'Състояние на записването',
              required: true,
              defaultValue: 'open',
              options: [
                { label: 'Записването е отворено', value: 'open' },
                { label: 'Скоро', value: 'soon' },
                { label: 'Запълнена', value: 'full' },
              ],
              admin: { description: 'Показва се като етикет в картата на началната страница.' },
            },
            linkField({
              name: 'registration',
              label: 'Бутон „Запиши се“',
              defaultLabel: 'Запиши се',
            }),
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Страница с подробности',
              admin: { description: 'Страницата, която се отваря от „Виж курса“.' },
            },
          ],
        },
      ],
    },
    {
      name: 'showOnSchedule',
      type: 'checkbox',
      label: 'Показвай в графика',
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
