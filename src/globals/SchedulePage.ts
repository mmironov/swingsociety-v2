import type { GlobalConfig } from 'payload'
import { revalidateGlobalHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'
import { inlineRichText } from '../blocks'

export const SchedulePage: GlobalConfig = {
  slug: 'schedule-page',
  label: 'Страница „График“',
  admin: {
    group: 'Съдържание',
    description:
      'Текстовете на страницата с графика. Самите таблици се пълнят от „Курсове и групи“ и „Събития“.',
    livePreview: {
      url: ({ locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/${locale?.code ?? 'bg'}/schedule`,
    },
  },
  access: { read: anyone, update: editors },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Надзаглавие',
      localized: true,
      defaultValue: 'График',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заглавие',
      localized: true,
      required: true,
      defaultValue: 'Класове, партита, фестивали',
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Водещ текст',
      localized: true,
    },
    {
      name: 'groupsHeading',
      type: 'text',
      label: 'Заглавие на таблицата с групите',
      localized: true,
      defaultValue: 'Групи',
    },
    {
      name: 'groupsNote',
      type: 'richText',
      label: 'Бележка под таблицата с групите',
      localized: true,
      editor: inlineRichText,
      admin: { description: 'Може да съдържа връзки — маркирай дума и натисни иконата за връзка.' },
    },
    {
      name: 'eventsHeading',
      type: 'text',
      label: 'Заглавие на таблицата със събитията',
      localized: true,
      defaultValue: 'Партита и фестивали',
    },
    {
      name: 'emptyNote',
      type: 'text',
      label: 'Текст, когато няма нищо в таблицата',
      localized: true,
      defaultValue: 'Скоро обявяваме следващите дати.',
    },
    linkField({ name: 'primaryCta', label: 'Основен бутон долу', defaultLabel: 'Запиши се за начинаещи' }),
    linkField({ name: 'secondaryCta', label: 'Втори бутон долу', defaultLabel: 'Контакти' }),
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Заглавие', localized: true },
        { name: 'description', type: 'textarea', label: 'Описание', localized: true, maxLength: 200 },
      ],
    },
  ],
  hooks: revalidateGlobalHooks,
}
