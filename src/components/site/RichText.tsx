import React from 'react'
import Link from 'next/link'
import type { Locale } from '../../lib/i18n'
import { path } from '../../lib/i18n'

/**
 * Minimal Lexical renderer for the narrow feature set the Text block allows:
 * paragraphs, bold, italic and links. Deliberately hand-rolled rather than
 * pulled from a converter package — the whole grammar is four node types, and
 * this way an unexpected node is skipped instead of throwing on a live page.
 */

type LexNode = {
  type?: string
  text?: string
  format?: number | string
  tag?: string
  children?: LexNode[]
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: 'custom' | 'internal'
    doc?: { relationTo?: string; value?: unknown }
  }
  [key: string]: unknown
}

// Lexical encodes inline styles as a bitmask on each text node.
const IS_BOLD = 1
const IS_ITALIC = 1 << 1

const renderText = (node: LexNode, key: React.Key): React.ReactNode => {
  let out: React.ReactNode = node.text ?? ''
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & IS_BOLD) out = <strong>{out}</strong>
  if (format & IS_ITALIC) out = <em>{out}</em>
  return <React.Fragment key={key}>{out}</React.Fragment>
}

const resolveDocHref = (node: LexNode, locale: Locale): string | null => {
  const doc = node.fields?.doc
  if (!doc || doc.relationTo !== 'pages') return null
  const value = doc.value
  // Depth-2 queries populate this; a bare id can't produce a slug.
  if (value && typeof value === 'object' && 'slug' in value) {
    const slug = (value as { slug?: string }).slug
    return slug ? path(`/${slug}`, locale) : null
  }
  return null
}

const renderNodes = (nodes: LexNode[] | undefined, locale: Locale): React.ReactNode[] =>
  (nodes ?? []).flatMap((node, i): React.ReactNode[] => {
    switch (node.type) {
      case 'text':
        return [renderText(node, i)]

      case 'linebreak':
        return [<br key={i} />]

      case 'link':
      case 'autolink': {
        const children = renderNodes(node.children, locale)
        const internalHref = node.fields?.linkType === 'internal' ? resolveDocHref(node, locale) : null
        const href = internalHref ?? node.fields?.url ?? null
        if (!href) return children

        if (internalHref) {
          return [
            <Link key={i} href={internalHref}>
              {children}
            </Link>,
          ]
        }
        const newTab = node.fields?.newTab || /^https?:\/\//i.test(href)
        return [
          <a key={i} href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>,
        ]
      }

      case 'paragraph': {
        const children = renderNodes(node.children, locale)
        // Lexical keeps an empty trailing paragraph; don't render it as space.
        if (children.length === 0) return []
        return [<p key={i}>{children}</p>]
      }

      case 'list': {
        const Tag = node.tag === 'ol' ? 'ol' : 'ul'
        return [<Tag key={i}>{renderNodes(node.children, locale)}</Tag>]
      }

      case 'listitem':
        return [<li key={i}>{renderNodes(node.children, locale)}</li>]

      default:
        // Unknown node: render whatever is inside it rather than dropping text.
        return renderNodes(node.children, locale)
    }
  })

type RichTextValue = { root?: { children?: LexNode[] } } | null | undefined

export const RichText = ({
  value,
  locale,
  className,
}: {
  value: RichTextValue
  locale: Locale
  className?: string
}) => {
  const children = renderNodes(value?.root?.children, locale)
  if (children.length === 0) return null
  return <div className={className}>{children}</div>
}

/** True when a rich-text value has no renderable content. */
export const isRichTextEmpty = (value: RichTextValue): boolean => {
  const nodes = value?.root?.children ?? []
  const hasText = (list: LexNode[]): boolean =>
    list.some((node) =>
      node.type === 'text' ? (node.text ?? '').trim() !== '' : hasText(node.children ?? []),
    )
  return !hasText(nodes)
}
