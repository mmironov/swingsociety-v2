import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, isLocale, path, t } from '../../../../lib/i18n'
import { getTeachers, getTeamPage, getSiteSettings } from '../../../../lib/content'
import { SiteHeader } from '../../../../components/site/SiteHeader'
import { Footer } from '../../../../components/site/Footer'
import { TeamGrid } from '../../../../components/site/TeamGrid'

type Props = { params: Promise<{ locale: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const page = await getTeamPage(locale)

  return {
    title: page.meta?.title ? { absolute: page.meta.title } : page.title,
    description: page.meta?.description || page.lead || undefined,
    alternates: { canonical: path('/team', locale) },
  }
}

const TeamRoute = async ({ params }: Props) => {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [settings, page, members] = await Promise.all([
    getSiteSettings(locale),
    getTeamPage(locale),
    getTeachers(locale),
  ])

  return (
    <>
      <SiteHeader locale={locale} currentPath="/team" />
      <div className="shell">
        <main>
          <div className="page-head">
            <Link className="back-link" href={path('/', locale)}>
              {t('backHome', locale)}
            </Link>
          </div>
          <TeamGrid page={page} members={members} />
        </main>
        <Footer locale={locale} settings={settings} cta={null} />
      </div>
    </>
  )
}

export default TeamRoute
