import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LOCALES, type Locale, isLocale, path, t } from '../../../../lib/i18n'
import { getAllPageSlugs, getPageBySlug, getSiteSettings } from '../../../../lib/content'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { focalPosition, mediaAlt, mediaUrl } from '../../../../lib/media'
import { toEmbedUrl } from '../../../../lib/format'
import { alternatesForPaths } from '../../../../lib/seo'
import { SiteHeader } from '../../../../components/site/SiteHeader'
import { Footer } from '../../../../components/site/Footer'
import { Blocks } from '../../../../components/site/Blocks'
import { CmsLink } from '../../../../components/site/CmsLink'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = async () => {
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const slugs = await getAllPageSlugs(locale)
    params.push(...slugs.map((slug) => ({ locale, slug })))
  }
  return params
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const page = await getPageBySlug(slug, locale)
  if (!page) return {}

  const title = page.meta?.title || page.title
  const description = page.meta?.description || page.lead || undefined
  const ogImage = mediaUrl(page.meta?.image, 1200) ?? mediaUrl(page.hero?.image, 1200)

  return {
    // A CMS-authored SEO title is used verbatim; a plain page title gets the
    // layout's "· Swing Society" suffix.
    title: page.meta?.title ? { absolute: page.meta.title } : page.title,
    description,
    alternates: {
      canonical: path(`/${slug}`, locale),
      // Slugs are localized, so the sibling path comes from the document rather
      // than from swapping a prefix.
      ...alternatesForPaths(await localePathsFor(page.id)),
    },
    openGraph: {
      type: 'article',
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

/**
 * The same document's slug in the other locale, so the language switcher lands
 * on the translation rather than a 404.
 */
const localePathsFor = async (id: number): Promise<Partial<Record<Locale, string>>> => {
  const payload = await getPayload({ config })
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const doc = await payload.findByID({
        collection: 'pages',
        id,
        locale,
        depth: 0,
        select: { slug: true },
      })
      return [locale, doc?.slug ? path(`/${doc.slug}`, locale) : `/${locale}`] as const
    }),
  )
  return Object.fromEntries(entries)
}

const PageRoute = async ({ params }: Props) => {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const page = await getPageBySlug(slug, locale)
  if (!page) notFound()

  const [settings, localePaths] = await Promise.all([
    getSiteSettings(locale),
    localePathsFor(page.id),
  ])

  const heroImage = page.hero?.type === 'image' ? mediaUrl(page.hero.image, 1600) : null
  const heroVideo = page.hero?.type === 'video' ? toEmbedUrl(page.hero.videoUrl) : null

  return (
    <>
      <SiteHeader locale={locale} localePaths={localePaths} />
      <div className="shell">
        <article className="article">
          <Link className="back-link" href={path('/', locale)}>
            {t('backHome', locale)}
          </Link>

          {page.kicker ? <div className="kicker article__kicker">{page.kicker}</div> : null}
          <h1 className="article__title">{page.title}</h1>
          {page.lead ? <p className="article__lead">{page.lead}</p> : null}

          {heroImage ? (
            <img
              className="article__hero"
              src={heroImage}
              alt={mediaAlt(page.hero?.image, page.title)}
              // A wide banner cut from a tall portrait shows barely a third of
              // the frame, so this crop needs the focal point most of all.
              style={{ objectPosition: focalPosition(page.hero?.image, '50% 30%') }}
            />
          ) : null}

          {heroVideo ? (
            <div className="article__hero-video embed">
              <iframe
                src={heroVideo}
                title={page.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          <Blocks blocks={page.blocks} locale={locale} />

          <div className="article__actions">
            <CmsLink link={page.cta ?? null} locale={locale} className="btn btn-primary" />
            {/*
              Points at the dances page, not a home-page anchor. It used to be
              `/#dances`, which broke silently when that section became its own
              page: the anchor no longer exists, so the button dropped the visitor
              at the top of the home page. Anchors into another page's internals are
              exactly the links that rot when that page is reorganised.
            */}
            <Link className="btn btn-secondary" href={path('/dances', locale)}>
              {t('allDances', locale)}
            </Link>
          </div>
        </article>

        <Footer locale={locale} settings={settings} variant="slim" />
      </div>
    </>
  )
}

export default PageRoute
