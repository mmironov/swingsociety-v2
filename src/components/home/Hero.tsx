import React from 'react'
import type { HomePage, SiteSetting } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { toLines } from '../../lib/format'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { CmsLink } from '../site/CmsLink'

export const Hero = ({
  locale,
  hero,
  badge,
}: {
  locale: Locale
  hero: HomePage['hero']
  badge: SiteSetting['heroBadge']
}) => {
  const photo = mediaUrl(hero.photo, 1200)

  return (
    <header className="hero" id="top">
      <div className="hero__glow" />
      <div className={photo ? 'hero__inner' : 'hero__inner hero__inner--no-photo'}>
        <div className="hero__text">
          {badge ? <div className="hero__badge">{badge}</div> : null}

          <h1 className="hero__title">
            {toLines(hero.heading).map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 ? <br /> : null}
                {line}
              </React.Fragment>
            ))}
          </h1>

          {hero.intro ? <p className="hero__intro">{hero.intro}</p> : null}

          <div className="hero__cta">
            <CmsLink link={hero.primaryCta ?? null} locale={locale} className="btn btn-primary" />
            <CmsLink link={hero.secondaryCta ?? null} locale={locale} className="btn btn-outline" />
          </div>
        </div>

        {photo ? (
          <img
            className="hero__photo"
            src={photo}
            alt={mediaAlt(hero.photo)}
            style={{ objectPosition: focalPosition(hero.photo) }}
          />
        ) : null}
      </div>
    </header>
  )
}
