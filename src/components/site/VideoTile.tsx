'use client'

import { useRef, useState } from 'react'
import { type Locale, t } from '../../lib/i18n'

type Props = {
  locale: Locale
  title: string
  videoUrl: string
  posterUrl: string | null
  posterPosition?: string
}

/**
 * A video tile that keeps the design's poster-and-play-button look and only
 * loads the clip when someone asks for it.
 *
 * `preload="metadata"` means the page costs a few hundred bytes per tile rather
 * than the ~8 MB of the clip; the mp4s are encoded with faststart so playback
 * begins almost immediately once clicked. Nothing autoplays — three looping
 * videos behind a hero would be both noisy and expensive on mobile data.
 */
export const VideoTile = ({ locale, title, videoUrl, posterUrl, posterPosition }: Props) => {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const start = () => {
    setPlaying(true)
    // The element already exists behind the poster, so this runs inside the
    // click handler and counts as a user gesture — Safari requires that.
    void videoRef.current?.play()
  }

  return (
    <div className="video-tile video-tile--playable">
      <video
        ref={videoRef}
        className="video-tile__video"
        src={videoUrl}
        poster={posterUrl ?? undefined}
        preload="metadata"
        playsInline
        controls={playing}
        onEnded={() => setPlaying(false)}
        aria-label={title}
        style={{ objectPosition: posterPosition }}
      />

      {!playing ? (
        <button type="button" className="video-tile__trigger" onClick={start}>
          {/* The poster comes from the <video> underneath, so this layer is only
              the gradient, the play affordance and the caption. */}
          <span className="video-tile__play" aria-hidden="true">
            ▶
          </span>
          <span className="video-tile__title">{title}</span>
          <span className="visually-hidden">{t('playVideo', locale)}</span>
        </button>
      ) : null}
    </div>
  )
}
