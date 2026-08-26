import type { GlobalConfig } from 'payload'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'
import { revalidateGlobalHooks } from '../hooks/revalidate'
import { pageHeader, seoGroup } from './shared'

/** The questions page, moved off the home page. */
export const FaqPage: GlobalConfig = {
  slug: 'faq-page',
  label: 'Страница „Въпроси“',
  admin: {
    group: 'Съдържание',
    description: 'Често задаваните въпроси (/faq).',
    livePreview: {
      url: ({ locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/${locale?.code ?? 'bg'}/faq`,
    },
  },
  access: { read: anyone, update: editors },
  versions: { drafts: false, max: 25 },
  fields: [
    ...pageHeader({ kicker: 'Въпроси', title: 'Преди първия час' }),
    {
      name: 'items',
      type: 'array',
      label: 'Въпроси',
      labels: { singular: 'Въпрос', plural: 'Въпроси' },
      fields: [
        { name: 'question', type: 'text', label: 'Въпрос', localized: true, required: true },
        { name: 'answer', type: 'textarea', label: 'Отговор', localized: true, required: true },
        linkField({ name: 'link', label: 'Връзка след отговора', withLabel: true }),
      ],
    },
    seoGroup(),
  ],
  hooks: revalidateGlobalHooks,
}
