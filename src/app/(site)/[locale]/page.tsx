import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, isLocale } from '../../../lib/i18n'
import {
  getHomePage,
  getReviews,
  getSiteSettings,
  getUpcomingEvents,
} from '../../../lib/content'
import { mediaUrl } from '../../../lib/media'
import { SiteHeader } from '../../../components/site/SiteHeader'
import { Footer } from '../../../components/site/Footer'
import { Hero } from '../../../components/home/Hero'
import { PromoCards } from '../../../components/home/PromoCards'
import { Beginners } from '../../../components/home/Beginners'
import { Reviews } from '../../../components/home/Reviews'
import { VideoStrip } from '../../../components/home/VideoStrip'
import { Events } from '../../../components/home/Events'
import { About } from '../../../components/home/About'
import { Contact } from '../../../components/home/Contact'

type Props = { params: Promise<{ locale: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const [settings, home] = await Promise.all([getSiteSettings(locale), getHomePage(locale)])

  const title = settings.meta?.title || settings.brandName
  const description = settings.meta?.description || home.hero?.intro || undefined
  const ogImage = mediaUrl(settings.meta?.image, 1200) ?? mediaUrl(home.hero?.photo, 1200)

  return {
    // `absolute` so the home page isn't titled "Swing Society · Swing Society".
    title: { absolute: title },
    description,
    openGraph: { title, description, ...(ogImage ? { images: [{ url: ogImage }] } : {}) },
  }
}

const HomeRoute = async ({ params }: Props) => {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const [settings, home, reviews] = await Promise.all([
    getSiteSettings(locale),
    getHomePage(locale),
    getReviews(locale),
  ])

  const events = await getUpcomingEvents(locale, {
    featuredOnly: true,
    limit: home.events?.limit ?? 3,
  })

  return (
    <>
      <SiteHeader locale={locale} />
      <div className="shell">
        <Hero locale={locale} hero={home.hero} badge={settings.heroBadge} />
        <PromoCards
          locale={locale}
          courseCard={home.courseCard}
          festivalCard={home.festivalCard}
          registrationOpen={settings.registrationOpen}
        />
        <Beginners locale={locale} beginners={home.beginners} />
        <Reviews locale={locale} reviews={home.reviews} items={reviews} />
        <VideoStrip locale={locale} videoStrip={home.videoStrip} />
        <Events locale={locale} events={home.events} items={events} />
        <About locale={locale} about={home.about} />
        <Contact locale={locale} contact={home.contact} settings={settings} />
        <Footer locale={locale} settings={settings} cta={home.footerCta} />
      </div>
    </>
  )
}

export default HomeRoute
