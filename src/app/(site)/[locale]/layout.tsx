import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Manrope, Playfair_Display } from 'next/font/google'
import { HTML_LANG, LOCALES, type Locale, isLocale } from '../../../lib/i18n'
import { getSiteSettings } from '../../../lib/content'
import { mediaUrl } from '../../../lib/media'
import { Reveal } from '../../../components/site/Reveal'
import '../globals.css'

/* Both faces carry Cyrillic — the site is Bulgarian first, and a missing
   subset would fall back to a system serif mid-heading. */
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }))

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const settings = await getSiteSettings(locale)

  const title = settings.meta?.title || settings.brandName
  const description = settings.meta?.description ?? undefined
  const ogImage = mediaUrl(settings.meta?.image, 1200)
  const base = process.env.NEXT_PUBLIC_SERVER_URL

  return {
    ...(base ? { metadataBase: new URL(base) } : {}),
    title: { default: title, template: `%s · ${settings.brandName}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((code) => [HTML_LANG[code], `/${code}`])),
    },
    openGraph: {
      type: 'website',
      siteName: settings.brandName,
      locale: HTML_LANG[locale],
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: { card: 'summary_large_image' },
  }
}

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={HTML_LANG[locale]} className={`${playfair.variable} ${manrope.variable}`}>
      <body>
        <Reveal />
        {children}
      </body>
    </html>
  )
}

export default LocaleLayout
