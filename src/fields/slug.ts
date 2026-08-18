import type { Field, FieldHook } from 'payload'

/**
 * Cyrillic → Latin, following the Bulgarian streamlined transliteration system
 * (the one on Bulgarian passports and road signs), so `Линди хоп` becomes
 * `lindi-hop` rather than a row of dashes.
 */
const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's',
  т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht',
  ъ: 'a', ь: '', ю: 'yu', я: 'ya',
}

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip Latin diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Fills an empty slug from the title. Only ever *fills* — once a page is live
 * its URL is a promise to anyone who linked to it, so an existing slug is never
 * silently rewritten when the title changes.
 */
const formatSlug =
  (fallbackFrom: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string' && value.trim() !== '') return slugify(value)
    if (operation !== 'create' && typeof originalDoc?.[fallbackFrom] === 'string') {
      // Editing an existing doc and the slug was cleared: keep the old one.
      const existing = originalDoc?.slug
      if (typeof existing === 'string' && existing !== '') return existing
    }
    const source = data?.[fallbackFrom] ?? originalDoc?.[fallbackFrom]
    return typeof source === 'string' && source !== '' ? slugify(source) : value
  }

export const slugField = (fallbackFrom = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Адрес (slug)',
  localized: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Частта след адреса на сайта, напр. lindi-hop. Оставиш ли го празно, се генерира от заглавието. Смениш ли го на публикувана страница, старите връзки спират да работят.',
  },
  hooks: { beforeValidate: [formatSlug(fallbackFrom)] },
})
