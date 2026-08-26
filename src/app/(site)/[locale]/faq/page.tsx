import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, isLocale, path, t } from '../../../../lib/i18n'
import { getFaqPage, getSiteSettings } from '../../../../lib/content'
import { SiteHeader } from '../../../../components/site/SiteHeader'
import { Footer } from '../../../../components/site/Footer'
import { FaqList } from '../../../../components/site/FaqList'

type Props = { params: Promise<{ locale: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const page = await getFaqPage(locale)

  return {
    // A CMS-written SEO title is used verbatim; a plain title takes the layout's
    // "· Swing Society" suffix.
    title: page.meta?.title ? { absolute: page.meta.title } : page.title,
    description: page.meta?.description || page.lead || undefined,
    alternates: { canonical: path('/faq', locale) },
  }
}

const FaqRoute = async ({ params }: Props) => {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [settings, page] = await Promise.all([getSiteSettings(locale), getFaqPage(locale)])

  return (
    <>
      <SiteHeader locale={locale} currentPath="/dances" />
      <div className="shell">
        <main>
          <Link className="back-link" href={path('/', locale)}>
            {t('backHome', locale)}
          </Link>
          <FaqList locale={locale} page={page} />
        </main>
        <Footer locale={locale} settings={settings} cta={null} />
      </div>
    </>
  )
}

export default FaqRoute
