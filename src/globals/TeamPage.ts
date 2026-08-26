import type { GlobalConfig } from 'payload'
import { anyone, editors } from '../access'
import { revalidateGlobalHooks } from '../hooks/revalidate'
import { pageHeader, seoGroup } from './shared'

/**
 * The team page, moved off the home page.
 *
 * The people themselves live in the Teachers collection — this global only carries
 * the page's own words, so adding a teacher never means editing a page.
 */
export const TeamPage: GlobalConfig = {
  slug: 'team-page',
  label: 'Страница „Екип“',
  admin: {
    group: 'Съдържание',
    description: 'Страницата с екипа (/team). Хората се редактират в „Екип“.',
    livePreview: {
      url: ({ locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/${locale?.code ?? 'bg'}/team`,
    },
  },
  access: { read: anyone, update: editors },
  versions: { drafts: false, max: 25 },
  fields: [...pageHeader({ kicker: 'Екип', title: 'Хората, които водят' }), seoGroup()],
  hooks: revalidateGlobalHooks,
}
