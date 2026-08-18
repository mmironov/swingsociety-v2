/**
 * Finding relationship fields by walking the Payload schema, rather than guessing
 * from a value's shape.
 *
 * The guess — "an object with a title and no slug is a course" — is wrong, because
 * globals are full of plain groups that happen to have a `title`: every video
 * tile, the festival card, the SEO meta group. Treating those as relationships
 * turned real content into dangling references. The schema knows exactly which
 * paths are `relationship` or `upload` and what they point at, so ask it.
 */
import type { Field, SanitizedConfig } from 'payload'

export type RefPath = { segments: string[]; relationTo: string }

const ARRAY = '[]'

/** Every relationship/upload path in a field tree, with `[]` marking an array. */
export const collectRefPaths = (fields: Field[], prefix: string[] = []): RefPath[] => {
  const found: RefPath[] = []

  for (const field of fields) {
    const named = 'name' in field ? (field.name as string) : undefined

    switch (field.type) {
      case 'relationship':
      case 'upload': {
        const relationTo = field.relationTo
        // Polymorphic relationships would need the collection stored per value;
        // nothing in this project uses one, so they are skipped deliberately.
        if (named && typeof relationTo === 'string') {
          found.push({ segments: [...prefix, named], relationTo })
        }
        break
      }
      case 'group':
        found.push(...collectRefPaths(field.fields, named ? [...prefix, named] : prefix))
        break
      case 'array':
        if (named) found.push(...collectRefPaths(field.fields, [...prefix, named, ARRAY]))
        break
      case 'row':
      case 'collapsible':
        found.push(...collectRefPaths(field.fields, prefix))
        break
      case 'tabs':
        for (const tab of field.tabs) {
          const tabName = 'name' in tab ? (tab.name as string) : undefined
          found.push(...collectRefPaths(tab.fields, tabName ? [...prefix, tabName] : prefix))
        }
        break
      case 'blocks':
        for (const block of field.blocks) {
          if (named) found.push(...collectRefPaths(block.fields, [...prefix, named, ARRAY]))
        }
        break
      default:
        break
    }
  }

  return found
}

export const globalRefPaths = (config: SanitizedConfig, slug: string): RefPath[] => {
  const global = config.globals.find((g) => g.slug === slug)
  return global ? collectRefPaths(global.fields) : []
}

export const collectionRefPaths = (config: SanitizedConfig, slug: string): RefPath[] => {
  const collection = config.collections.find((c) => c.slug === slug)
  return collection ? collectRefPaths(collection.fields) : []
}

/**
 * Rewrites the value at each ref path. `map` receives the id and the collection
 * it points at; returning undefined leaves the value untouched. Handles hasMany
 * (arrays of ids) and paths that pass through arrays.
 */
export const mapRefs = (
  doc: unknown,
  paths: RefPath[],
  map: (value: unknown, relationTo: string) => unknown,
): unknown => {
  const clone = structuredClone(doc)

  const walk = (node: unknown, segments: string[], relationTo: string): void => {
    if (node === null || typeof node !== 'object') return

    if (segments.length === 0) return

    const [head, ...rest] = segments

    if (head === ARRAY) {
      if (!Array.isArray(node)) return
      for (const item of node) walk(item, rest, relationTo)
      return
    }

    const container = node as Record<string, unknown>

    if (rest.length === 0) {
      if (!(head in container)) return
      const current = container[head]
      container[head] = Array.isArray(current)
        ? current.map((v) => map(v, relationTo))
        : map(current, relationTo)
      return
    }

    walk(container[head], rest, relationTo)
  }

  for (const { segments, relationTo } of paths) walk(clone, segments, relationTo)
  return clone
}

// ─── portable keys ───────────────────────────────────────────────────────────
// Ids are database-local, so references travel as a key derived from content.
// Keys are always built from the Bulgarian locale, even when exporting the English
// document: page slugs and course titles are localized, and keying English values
// against a Bulgarian-keyed lookup resolves to nothing.

/**
 * Media identity across databases. Seeding a machine that already holds
 * public/media makes Payload's collision check store `all-1.webp` where the other
 * database has `all.webp`, so the stable part is the stem minus any `-N`.
 */
export const mediaKey = (filename: string): string =>
  filename.replace(/\.[^.]+$/, '').replace(/-\d+$/, '')

/** Courses have no slug, and two share a title, so the date disambiguates. */
export const courseKey = (doc: Record<string, unknown>): string =>
  `${String(doc.title ?? '').trim()}|${doc.startDate ?? ''}`

export const encodeRef = (relationTo: string, key: string) => `${relationTo}:${key}`

export const decodeRef = (value: unknown): { relationTo: string; key: string } | null => {
  if (typeof value !== 'string') return null
  const at = value.indexOf(':')
  return at === -1 ? null : { relationTo: value.slice(0, at), key: value.slice(at + 1) }
}

export const STRIP_KEYS = new Set(['id', 'createdAt', 'updatedAt', 'globalType'])

export const stripMeta = (doc: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(doc).filter(([k]) => !STRIP_KEYS.has(k)))
