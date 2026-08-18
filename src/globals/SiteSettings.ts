import type { GlobalConfig } from 'payload'
import { revalidateGlobalHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки на сайта',
  admin: {
    group: 'Настройки',
    description: 'Лого, контакти, меню и общият бутон „Запиши се“ — важат за целия сайт.',
  },
  access: { read: anyone, update: editors },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Бранд',
          fields: [
            {
              name: 'brandName',
              type: 'text',
              label: 'Име на школата',
              required: true,
              defaultValue: 'Swing Society',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Лого',
              admin: { description: 'Показва се в менюто и долу. Светло лого върху тъмния фон.' },
            },
            {
              name: 'heroBadge',
              type: 'text',
              label: 'Малкият ред най-горе',
              localized: true,
              defaultValue: 'Swing Society · София',
            },
          ],
        },
        {
          label: 'Записване',
          fields: [
            linkField({
              name: 'cta',
              label: 'Главен бутон „Запиши се“',
              defaultLabel: 'Запиши се',
              required: true,
            }),
            {
              name: 'registrationOpen',
              type: 'checkbox',
              label: 'Записването е отворено',
              defaultValue: true,
              admin: {
                description:
                  'Показва „Записването е отворено“ или „Скоро“ в картата на началната страница.',
              },
            },
          ],
        },
        {
          label: 'Контакти',
          fields: [
            { name: 'phone', type: 'text', label: 'Телефон', admin: { description: 'напр. +359 88 555 4597' } },
            { name: 'email', type: 'email', label: 'Имейл' },
            {
              name: 'addressLine',
              type: 'text',
              label: 'Град',
              localized: true,
              defaultValue: 'София, България',
            },
            {
              name: 'venue',
              type: 'text',
              label: 'Основна зала',
              localized: true,
            },
            { name: 'venueMapUrl', type: 'text', label: 'Връзка към картата на залата' },
            {
              name: 'socials',
              type: 'array',
              label: 'Социални мрежи и връзки',
              labels: { singular: 'Връзка', plural: 'Връзки' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Къде',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Сайт', value: 'website' },
                  ],
                },
                { name: 'label', type: 'text', label: 'Текст', required: true },
                { name: 'url', type: 'text', label: 'Адрес', required: true },
              ],
            },
          ],
        },
        {
          label: 'Меню',
          fields: [
            {
              name: 'nav',
              type: 'array',
              label: 'Връзки в менюто',
              labels: { singular: 'Връзка', plural: 'Връзки' },
              admin: { description: 'Редът тук е редът в менюто. Влачи, за да пренаредиш.' },
              fields: [linkField({ name: 'link', label: 'Връзка', required: true })],
            },
            {
              name: 'footerLinks',
              type: 'array',
              label: 'Малките връзки най-долу',
              labels: { singular: 'Връзка', plural: 'Връзки' },
              fields: [linkField({ name: 'link', label: 'Връзка', required: true })],
            },
            {
              name: 'footerNote',
              type: 'text',
              label: 'Бележка най-долу',
              localized: true,
              defaultValue: 'Всеки е добре дошъл — независимо от възраст, пол и опит.',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'По подразбиране за целия сайт',
              fields: [
                { name: 'title', type: 'text', label: 'Заглавие', localized: true },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Описание',
                  localized: true,
                  maxLength: 200,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Снимка при споделяне',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: revalidateGlobalHooks,
}
