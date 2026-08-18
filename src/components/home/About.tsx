import React from 'react'
import type { HomePage } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { toLines } from '../../lib/format'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'

export const About = ({ about }: { locale: Locale; about: HomePage['about'] }) => {
  if (about?.enabled === false) return null
  const paragraphs = about?.paragraphs ?? []
  const image = mediaUrl(about?.image, 1200)
  if (paragraphs.length === 0 && !image) return null

  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__text">
          {about?.kicker ? <div className="kicker">{about.kicker}</div> : null}
          {about?.heading ? (
            <h2 className="section__heading about__heading">
              {toLines(about.heading).map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? <br /> : null}
                  {line}
                </React.Fragment>
              ))}
            </h2>
          ) : null}
          {paragraphs.map((paragraph) => (
            <p key={paragraph.id ?? paragraph.text}>{paragraph.text}</p>
          ))}
        </div>

        {image ? (
          <img
            className="about__photo"
            src={image}
            alt={mediaAlt(about?.image)}
            style={{ objectPosition: focalPosition(about?.image, '50% 40%') }}
          />
        ) : null}
      </div>
    </section>
  )
}
