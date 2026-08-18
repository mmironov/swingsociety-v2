import type { HomePage } from '../../payload-types'
import { type Locale, t } from '../../lib/i18n'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { VideoTile } from '../site/VideoTile'
import { CmsLink } from '../site/CmsLink'
import { SectionHead } from '../site/SectionHead'

export const VideoStrip = ({
  locale,
  videoStrip,
}: {
  locale: Locale
  videoStrip: HomePage['videoStrip']
}) => {
  if (videoStrip?.enabled === false) return null
  const items = videoStrip?.items ?? []
  if (items.length === 0) return null

  return (
    <section className="videos">
      <div className="wrap" data-reveal>
        <div className="videos__head">
          <div>
            <SectionHead kicker={videoStrip?.kicker} heading={videoStrip?.heading} />
          </div>
          <CmsLink
            link={videoStrip?.handleLink ?? null}
            locale={locale}
            className="btn btn-secondary videos__handle"
          />
        </div>

        <div className="videos__grid">
          {items.map((item) => {
            const image = mediaUrl(item.image, 600)
            const video = mediaUrl(item.video)

            // An uploaded clip plays in place; otherwise the tile stays the
            // link-out the design drew.
            if (video) {
              return (
                <VideoTile
                  key={item.id ?? item.title}
                  locale={locale}
                  title={item.title}
                  videoUrl={video}
                  posterUrl={image}
                  posterPosition={focalPosition(item.image, '50% 30%')}
                />
              )
            }

            const body = (
              <>
                {image ? (
                  <img
                    className="video-tile__img"
                    src={image}
                    alt={mediaAlt(item.image)}
                    style={{ objectPosition: focalPosition(item.image, '50% 30%') }}
                  />
                ) : null}
                <div className="video-tile__body">
                  <div className="video-tile__play" aria-hidden="true">
                    ▶
                  </div>
                  <div className="video-tile__title">{item.title}</div>
                </div>
              </>
            )

            const tileClass = image ? 'video-tile' : 'video-tile video-tile--empty'

            return item.url ? (
              <a
                key={item.id ?? item.title}
                className={tileClass}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('playVideo', locale)}: ${item.title}`}
              >
                {body}
              </a>
            ) : (
              <div key={item.id ?? item.title} className={tileClass}>
                {body}
              </div>
            )
          })}
        </div>

        {videoStrip?.note ? <p className="videos__note">{videoStrip.note}</p> : null}
      </div>
    </section>
  )
}
