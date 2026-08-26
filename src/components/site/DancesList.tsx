import Link from 'next/link'
import type { DancesPage, Page } from '../../payload-types'
import { type Locale, path } from '../../lib/i18n'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { CmsLink } from './CmsLink'
import { SectionHead } from './SectionHead'

/**
 * The body of the dances page.
 *
 * Each card mirrors one detail page — title, lead and hero image are read from the
 * page itself, so a dance is described in exactly one place. Lived on the home page
 * until the front page was trimmed; it takes its content explicitly now, so it does
 * not care which global holds it.
 */
export const DancesList = ({
  locale,
  page,
}: {
  locale: Locale
  page: Pick<DancesPage, 'kicker' | 'title' | 'lead' | 'introLink' | 'items' | 'linkLabel'>
}) => {
  const pages = (page.items ?? []).filter(
    (item): item is Page => typeof item === 'object' && Boolean(item?.slug),
  )

  return (
    <section className="section section--tight-top">
      <div className="wrap" data-reveal>
        <SectionHead as="h1" kicker={page.kicker} heading={page.title} intro={page.lead}>
          <CmsLink link={page.introLink ?? null} locale={locale}>
            {page.introLink?.label ? `${page.introLink.label} →` : null}
          </CmsLink>
        </SectionHead>

        {pages.length > 0 ? (
          <div className="grid grid--auto-300">
            {pages.map((item) => {
              const image = mediaUrl(item.hero?.image, 900)
              return (
                <div key={item.id} className="dance">
                  {image ? (
                    <img
                      className="dance__photo"
                      src={image}
                      alt={mediaAlt(item.hero?.image, item.title)}
                      style={{ objectPosition: focalPosition(item.hero?.image, '50% 40%') }}
                    />
                  ) : null}
                  <div className="dance__body">
                    <h2 className="dance__title">{item.title}</h2>
                    {item.lead ? <p>{item.lead}</p> : null}
                    <Link className="dance__more" href={path(`/${item.slug}`, locale)}>
                      {page.linkLabel ?? item.title} →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
