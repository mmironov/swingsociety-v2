import Link from 'next/link'
import type { HomePage, Page } from '../../payload-types'
import { type Locale, path } from '../../lib/i18n'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { CmsLink } from '../site/CmsLink'
import { SectionHead } from '../site/SectionHead'

/**
 * Each card mirrors one detail page — title, lead and hero image are read from
 * the page itself, so a dance is described in exactly one place.
 */
export const Dances = ({ locale, dances }: { locale: Locale; dances: HomePage['dances'] }) => {
  if (dances?.enabled === false) return null

  const pages = (dances?.items ?? []).filter(
    (item): item is Page => typeof item === 'object' && Boolean(item?.slug),
  )
  if (pages.length === 0) return null

  return (
    <section className="section section--tight-top" id="dances">
      <div className="wrap" data-reveal>
        <SectionHead kicker={dances?.kicker} heading={dances?.heading} intro={dances?.intro}>
          <CmsLink link={dances?.introLink ?? null} locale={locale}>
            {dances?.introLink?.label ? `${dances.introLink.label} →` : null}
          </CmsLink>
        </SectionHead>

        <div className="grid grid--auto-300">
          {pages.map((page) => {
            const image = mediaUrl(page.hero?.image, 900)
            return (
              <div key={page.id} className="dance">
                {image ? (
                  <img
                    className="dance__photo"
                    src={image}
                    alt={mediaAlt(page.hero?.image, page.title)}
                    style={{ objectPosition: focalPosition(page.hero?.image, '50% 40%') }}
                  />
                ) : null}
                <div className="dance__body">
                  <h3 className="dance__title">{page.title}</h3>
                  {page.lead ? <p>{page.lead}</p> : null}
                  <Link className="dance__more" href={path(`/${page.slug}`, locale)}>
                    {dances?.linkLabel ?? page.title} →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
