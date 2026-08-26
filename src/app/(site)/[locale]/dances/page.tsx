import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, isLocale, path, t } from '../../../../lib/i18n'
import { getDancesPage, getSiteSettings } from '../../../../lib/content'
import { SiteHeader } from '../../../../components/site/SiteHeader'
import { Footer } from '../../../../components/site/Footer'
import { DancesList } from '../../../../components/site/DancesList'
import { alternatesFor } from '../../../../lib/seo'

type Props = { params: Promise<{ locale: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const page = await getDancesPage(locale)

  return {
    // A CMS-written SEO title is used verbatim; a plain title takes the layout's
    // "· Swing Society" suffix.
    title: page.meta?.title ? { absolute: page.meta.title } : page.title,
    description: page.meta?.description || page.lead || undefined,
    alternates: { canonical: path('/dances', locale), ...alternatesFor('/dances') },
    // Without its own openGraph this page inherited the site title from the layout,
    // so sharing it showed "Swing Society" instead of what the page is about.
    openGraph: {
      url: path('/dances', locale),
      title: page.meta?.title || page.title,
      description: page.meta?.description || page.lead || undefined,
    },
  }
}

const DancesRoute = async ({ params }: Props) => {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [settings, page] = await Promise.all([getSiteSettings(locale), getDancesPage(locale)])

  return (
    <>
      <SiteHeader locale={locale} currentPath="/dances" />
      <div className="shell">
        <main>
          <div className="page-head">
            <Link className="back-link" href={path('/', locale)}>
              {t('backHome', locale)}
            </Link>
          </div>
          <DancesList locale={locale} page={page} />
        </main>
        <Footer locale={locale} settings={settings} cta={null} />
      </div>
    </>
  )
}

export default DancesRoute
