import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, isLocale, path, t } from '../../../../lib/i18n'
import { getFaqPage, getSiteSettings } from '../../../../lib/content'
import { SiteHeader } from '../../../../components/site/SiteHeader'
import { Footer } from '../../../../components/site/Footer'
import { FaqList } from '../../../../components/site/FaqList'
import { alternatesFor, faqJsonLd } from '../../../../lib/seo'
import { JsonLd } from '../../../../components/site/JsonLd'

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
    // This page has no lead, so the first questions stand in. A result with no
    // description is a result nobody clicks.
    description:
      page.meta?.description ||
      page.lead ||
      (page.items ?? [])
        .map((item) => item.question)
        .filter(Boolean)
        .slice(0, 3)
        .join(' · ') ||
      undefined,
    alternates: { canonical: path('/faq', locale), ...alternatesFor('/faq') },
  }
}

const FaqRoute = async ({ params }: Props) => {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [settings, page] = await Promise.all([getSiteSettings(locale), getFaqPage(locale)])

  return (
    <>
      <JsonLd data={faqJsonLd(page)} />
      <SiteHeader locale={locale} currentPath="/faq" />
      <div className="shell">
        <main>
          <div className="page-head">
            <Link className="back-link" href={path('/', locale)}>
              {t('backHome', locale)}
            </Link>
          </div>
          <FaqList locale={locale} page={page} />
        </main>
        <Footer locale={locale} settings={settings} cta={null} />
      </div>
    </>
  )
}

export default FaqRoute
