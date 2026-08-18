import React from 'react'
import type { Page } from '../../payload-types'
import { type Locale, t } from '../../lib/i18n'
import { toEmbedUrl } from '../../lib/format'
import { focalPosition, mediaAlt, mediaCaption, mediaUrl } from '../../lib/media'
import { RichText } from './RichText'

type Block = NonNullable<Page['blocks']>[number]

/** A 16:9 frame that holds an embed, an uploaded file, or an empty placeholder. */
const VideoFrame = ({
  locale,
  embedUrl,
  fileUrl,
  posterUrl,
  posterPosition,
  title,
}: {
  locale: Locale
  embedUrl: string | null
  fileUrl: string | null
  posterUrl: string | null
  posterPosition?: string
  title: string
}) => {
  if (embedUrl) {
    return (
      <div className="embed">
        <iframe
          src={embedUrl}
          title={title || t('playVideo', locale)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    )
  }

  if (fileUrl) {
    return (
      <div className="embed">
        <video src={fileUrl} poster={posterUrl ?? undefined} controls playsInline preload="metadata" />
      </div>
    )
  }

  // Nothing uploaded yet: the design's dashed slot, so the gap is obviously
  // intentional rather than looking like a broken player.
  return (
    <div className="embed embed--placeholder">
      {posterUrl ? <img src={posterUrl} alt="" style={{ objectPosition: posterPosition }} /> : null}
      <div className="embed__play" aria-hidden="true">
        ▶
      </div>
    </div>
  )
}

const renderBlock = (block: Block, locale: Locale): React.ReactNode => {
  switch (block.blockType) {
    case 'heading':
      return <h2 className="block__heading">{block.text}</h2>

    case 'text':
      return <RichText value={block.content} locale={locale} className="block__text" />

    case 'list': {
      const items = block.items ?? []
      if (items.length === 0) return null
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className="block__list">
          {items.map((item) => (
            <li key={item.id ?? item.text}>{item.text}</li>
          ))}
        </Tag>
      )
    }

    case 'quote':
      return (
        <blockquote className="block__quote">
          {block.text}
          {block.attribution ? <footer>— {block.attribution}</footer> : null}
        </blockquote>
      )

    case 'image': {
      const url = mediaUrl(block.image, 1200)
      if (!url) return null
      const caption = block.caption?.trim() || mediaCaption(block.image)
      return (
        <figure className="block__figure">
          <img src={url} alt={mediaAlt(block.image)} />
          {caption ? <figcaption className="block__caption">{caption}</figcaption> : null}
        </figure>
      )
    }

    case 'video': {
      const embedUrl = block.source === 'embed' ? toEmbedUrl(block.url) : null
      const fileUrl = block.source === 'file' ? mediaUrl(block.file) : null
      return (
        <figure className="block__figure">
          <VideoFrame
            locale={locale}
            embedUrl={embedUrl}
            fileUrl={fileUrl}
            posterUrl={mediaUrl(block.poster, 900)}
            posterPosition={focalPosition(block.poster, '50% 30%')}
            title={block.caption ?? ''}
          />
          {block.caption ? <figcaption className="block__caption">{block.caption}</figcaption> : null}
        </figure>
      )
    }

    default:
      return null
  }
}

export const Blocks = ({ blocks, locale }: { blocks: Page['blocks']; locale: Locale }) => {
  const list = blocks ?? []
  if (list.length === 0) return null

  return (
    <div className="blocks">
      {list.map((block, i) => {
        const rendered = renderBlock(block, locale)
        return rendered ? <div key={block.id ?? i}>{rendered}</div> : null
      })}
    </div>
  )
}
