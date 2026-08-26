import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Course } from '../../../payload-types'
import { type Locale, isLocale, path } from '../../../lib/i18n'
import { alternatesFor, courseJsonLd, schoolJsonLd } from '../../../lib/seo'
import { JsonLd } from '../../../components/site/JsonLd'
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
    alternates: { canonical: path('/', locale), ...alternatesFor('/') },
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

  // Shared by the hero and the Course structured data, so both describe the same
  // groups without querying twice.
  const beginnerGroups = (home.beginners?.groups ?? []).filter(
    (group): group is Course => typeof group === 'object' && group !== null,
  )

  const events = await getUpcomingEvents(locale, {
    featuredOnly: true,
    limit: home.events?.limit ?? 3,
  })

  return (
    <>
      <JsonLd data={schoolJsonLd(settings, locale)} />
      <JsonLd data={courseJsonLd(beginnerGroups, settings, locale)} />
      <SiteHeader locale={locale} />
      <div className="shell">
        {/*
          Order is the offer, then the proof, then the story.

          The beginner groups come first because they are what the school sells; the
          promo pair moved below About because the festival card links off-site to
          swingbuzz.eu, and an outbound link does not belong above the thing being
          sold. Reviews and video sit after the offer, where they support a decision
          already forming rather than introducing the school to someone who has not
          seen what is on offer yet.
        */}
        <Hero locale={locale} hero={home.hero} badge={settings.heroBadge} groups={beginnerGroups} />
        <Beginners locale={locale} beginners={home.beginners} />
        <Reviews locale={locale} reviews={home.reviews} items={reviews} />
        <VideoStrip locale={locale} videoStrip={home.videoStrip} />
        <Events locale={locale} events={home.events} items={events} />
        <About locale={locale} about={home.about} />
        <PromoCards
          locale={locale}
          courseCard={home.courseCard}
          festivalCard={home.festivalCard}
          registrationOpen={settings.registrationOpen}
        />
        <Contact locale={locale} contact={home.contact} settings={settings} />
        <Footer locale={locale} settings={settings} cta={home.footerCta} />
      </div>
    </>
  )
}

export default HomeRoute
