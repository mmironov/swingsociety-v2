import React from 'react'
import Link from 'next/link'
import type { Locale } from '../../lib/i18n'
import { type CmsLink as CmsLinkValue, resolveLink } from '../../lib/links'

type Props = {
  link: CmsLinkValue
  locale: Locale
  className?: string
  /** Used when the CMS link has no label of its own. */
  fallbackLabel?: string
  /** Overrides the label entirely — for links whose text lives elsewhere. */
  children?: React.ReactNode
}

/**
 * Renders one CMS link, choosing `<Link>` for internal routes and a plain
 * anchor with `rel="noopener noreferrer"` for external ones. Renders nothing at
 * all when the link has no destination, so an unfinished CMS entry leaves a gap
 * rather than a button that goes to `#`.
 */
export const CmsLink = ({ link, locale, className, fallbackLabel, children }: Props) => {
  const resolved = resolveLink(link, locale, fallbackLabel)
  if (!resolved) return null

  const content = children ?? resolved.label
  if (!content) return null

  if (resolved.external) {
    return (
      <a className={className} href={resolved.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link className={className} href={resolved.href}>
      {content}
    </Link>
  )
}
