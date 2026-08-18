import type { Media } from '../payload-types'

export type MediaRef = number | Media | null | undefined

/** Narrows an upload relationship to a populated Media doc. */
export const asMedia = (ref: MediaRef): Media | null =>
  ref && typeof ref === 'object' ? ref : null

type SizeEntry = { url?: string | null; width?: number | null; height?: number | null }

/**
 * Best URL for a given display width, picking the smallest generated size that
 * still covers it so a phone never downloads the 2400px hero.
 *
 * Sizes that changed the aspect ratio are skipped: `thumbnail` and `portrait`
 * are hard crops, and serving one for a logo or a landscape photo would cut the
 * subject off. Wherever a crop is actually wanted the CSS does it with
 * `object-fit: cover`, which respects the focal point.
 */
export const mediaUrl = (ref: MediaRef, minWidth = 0): string | null => {
  const media = asMedia(ref)
  if (!media) return null

  const originalRatio =
    media.width && media.height ? media.width / media.height : null

  const preservesShape = (size: SizeEntry) => {
    if (!originalRatio || !size.width || !size.height) return true
    return Math.abs(size.width / size.height - originalRatio) / originalRatio < 0.02
  }

  const candidates = Object.values(media.sizes ?? {})
    .filter((size): size is SizeEntry => Boolean(size?.url))
    .filter(preservesShape)
    .filter((size) => (size.width ?? 0) >= minWidth)
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))

  return candidates[0]?.url ?? media.url ?? null
}

export const mediaAlt = (ref: MediaRef, fallback = ''): string =>
  asMedia(ref)?.alt?.trim() || fallback

export const mediaCaption = (ref: MediaRef): string | null =>
  asMedia(ref)?.caption?.trim() || null

export const mediaDimensions = (ref: MediaRef): { width: number; height: number } | null => {
  const media = asMedia(ref)
  if (!media?.width || !media?.height) return null
  return { width: media.width, height: media.height }
}

/**
 * Percent offsets from Payload's focal point, as an `object-position` value.
 * Defaults to the design's `50% 22%` for portraits — swing photography is
 * shot loose and faces sit high in the frame.
 */
export const focalPosition = (ref: MediaRef, fallback = '50% 22%'): string => {
  const media = asMedia(ref)
  if (typeof media?.focalX !== 'number' || typeof media?.focalY !== 'number') return fallback
  return `${media.focalX}% ${media.focalY}%`
}

const VIDEO_MIMES = ['video/mp4', 'video/webm']
export const isVideo = (ref: MediaRef): boolean => {
  const media = asMedia(ref)
  return Boolean(media?.mimeType && VIDEO_MIMES.includes(media.mimeType))
}
