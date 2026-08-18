/**
 * Seeds the CMS with the content from the design, in Bulgarian and English.
 *
 * Idempotent by default: it fills what is empty and leaves anything the school
 * has already edited alone. `npm run seed:fresh` wipes the content collections
 * first — useful while developing, destructive on a live site.
 *
 * Localization pattern throughout: create/update in `bg`, then update the same
 * document in `en`. Array and block rows are matched by the ids Payload
 * assigned on the Bulgarian pass, so a translation lands on the right row
 * instead of creating a second one.
 */
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { doc, plain, richText, url as urlRun, type Run } from './lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(dirname, '../..')

const FRESH = process.argv.includes('--fresh')

const SWINGBUZZ = 'https://swingbuzz.eu'
const INSTAGRAM = 'https://www.instagram.com/bgswingsociety/'
const FACEBOOK = 'https://www.facebook.com/profile.php?id=61558998364426'
const GOOGLE_REVIEWS = 'https://www.google.com/search?q=swing+society+sofia+reviews'
const CODE_OF_CONDUCT = 'https://swingbuzz.eu/code-of-conduct.pdf'
const MAP_STUDENTS_HOUSE = 'https://maps.app.goo.gl/fSiSUSPbUf164eir6'
const MAP_KRASNO_SELO = 'https://maps.app.goo.gl/5nsdHMiFuR5NcVKm9'
const VENUE_BG = 'Национален студентски дом, София'
const VENUE_EN = "National Students' House, Sofia"
const TBD_BG = 'уточнява се'
const TBD_EN = 'to be confirmed'

const log = (message: string) => console.log(`  ${message}`)

/* ══ helpers ═══════════════════════════════════════════════════════════════ */

type Row = Record<string, unknown>

const isPlainObject = (value: unknown): value is Row =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Copies the ids Payload assigned on the Bulgarian pass onto the English data,
 * so `update({ locale: 'en' })` writes translations onto the same rows.
 *
 * Recursive on purpose: a block can contain an array (a list's items), and those
 * nested rows have ids of their own. Miss them and Payload creates fresh rows for
 * English, orphaning the Bulgarian text that was keyed to the old ids.
 */
const mergeIds = (created: unknown, translated: unknown): unknown => {
  if (Array.isArray(translated)) {
    const source = Array.isArray(created) ? created : []
    return translated.map((row, i) => {
      const merged = mergeIds(source[i], row)
      const id = isPlainObject(source[i]) ? source[i].id : undefined
      return isPlainObject(merged) && id !== undefined ? { ...merged, id } : merged
    })
  }

  if (isPlainObject(translated)) {
    const source = isPlainObject(created) ? created : {}
    const out: Row = {}
    for (const [key, value] of Object.entries(translated)) {
      out[key] = mergeIds(source[key], value)
    }
    return out
  }

  return translated
}

const withIds = (created: unknown, translated: Row[]): Row[] => mergeIds(created, translated) as Row[]

const external = (label: string, href: string) => ({ label, type: 'external' as const, url: href })
const section = (label: string, name: string) => ({ label, type: 'section' as const, section: name })
const scheduleLink = (label: string) => ({ label, type: 'schedule' as const })
const pageLink = (label: string, page: number) => ({ label, type: 'page' as const, page })

/* ══ media ═════════════════════════════════════════════════════════════════ */

/**
 * Alt text plus a focal point per image.
 *
 * The focal point matters more than it looks. These are full-length studio
 * portraits — 4000×6000 — and every frame that shows them (the 3:4 team tile,
 * the 320px-tall dance card, the page hero) crops vertically. Payload defaults
 * the focal point to dead centre, which on a standing figure lands on the waist
 * and cuts the head off. `focalY` here is roughly where the face sits, so one
 * value per image keeps the crop right everywhere it's used.
 *
 * These replace the per-card `object-position` values the design hard-coded, and
 * the school can drag them in the CMS if a crop ever looks wrong.
 */
const MEDIA_ALT: Record<string, { bg: string; en: string; focal?: [number, number] }> = {
  'logo-dark': { bg: 'Swing Society', en: 'Swing Society' },
  'swing-buzz-logo': { bg: 'Swing Buzz Festival', en: 'Swing Buzz Festival' },
  all: { bg: 'Екипът на Swing Society', en: 'The Swing Society team', focal: [50, 40] },
  // Lower than the others: this one is also the detail-page hero, a wide banner
  // that shows barely a third of a 4000×6000 frame's height, so the dancers'
  // heads only survive if the focal point sits well above centre.
  'kalina-miro-lindy': {
    bg: 'Двойка танцува линди хоп',
    en: 'A couple dancing lindy hop',
    focal: [50, 27],
  },
  'deni-tap': { bg: 'Дени танцува степ', en: 'Deni dancing tap', focal: [50, 30] },
  deni: { bg: 'Дени', en: 'Deni', focal: [50, 24] },
  kalina: { bg: 'Калина', en: 'Kalina', focal: [50, 24] },
  miro: { bg: 'Миро', en: 'Miro', focal: [50, 24] },
  mitko: { bg: 'Митко', en: 'Mitko', focal: [50, 28] },
  rosi: { bg: 'Роси', en: 'Rosi', focal: [50, 30] },
  viki: { bg: 'Виктория', en: 'Viktoria', focal: [50, 26] },

  // Video, plus the poster frame ffmpeg pulled from each clip. Posters are
  // ordinary images, so they get focal points too.
  'kalina-miro-short': { bg: 'Калина и Миро танцуват линди хоп', en: 'Kalina and Miro dancing lindy hop' },
  'kalina-miro-short-poster': {
    bg: 'Калина и Миро танцуват линди хоп',
    en: 'Kalina and Miro dancing lindy hop',
    focal: [50, 45],
  },
  'miro-kalina-slow-motion': {
    bg: 'Линди хоп на забавен кадър',
    en: 'Lindy hop in slow motion',
  },
  'miro-kalina-slow-motion-poster': {
    bg: 'Линди хоп на забавен кадър',
    en: 'Lindy hop in slow motion',
    focal: [50, 45],
  },
  'miro-kalina-apollo-jumps': {
    bg: 'Въздушни фигури в залата',
    en: 'Aerials in the studio',
  },
  'miro-kalina-apollo-jumps-poster': {
    bg: 'Въздушни фигури в залата',
    en: 'Aerials in the studio',
    focal: [50, 35],
  },
  'kalina-miro-savoy-cup': {
    bg: 'Калина и Миро на сцената на Savoy Cup',
    en: 'Kalina and Miro on stage at the Savoy Cup',
  },
  'kalina-miro-savoy-cup-poster': {
    bg: 'Калина и Миро на сцената на Savoy Cup',
    en: 'Kalina and Miro on stage at the Savoy Cup',
    focal: [50, 45],
  },
}

/** Where a photo may be sitting: the school's drop folder wins over the repo. */
const SEARCH_DIRS = [
  // `derived/` first: it holds the web-ready mp4s and posters written by
  // `npm run video:prepare`, and those are what should be served — never the
  // 80 MB .mov originals sitting next to them.
  path.join(ROOT, 'assets-inbox/derived'),
  path.join(ROOT, 'assets-inbox'),
  path.join(ROOT, 'public/img'),
]
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif', '.mp4']

const findAsset = (key: string): string | null => {
  for (const dir of SEARCH_DIRS) {
    if (!fs.existsSync(dir)) continue
    for (const ext of EXTENSIONS) {
      const candidate = path.join(dir, key + ext)
      if (fs.existsSync(candidate)) return candidate
    }
  }
  return null
}

type MediaMap = Record<string, number | null>

const seedMedia = async (payload: Payload): Promise<MediaMap> => {
  const map: MediaMap = {}
  const missing: string[] = []

  for (const key of Object.keys(MEDIA_ALT)) {
    const alt = MEDIA_ALT[key]

    // Match the full filename, never a substring: `like: 'deni'` also matches
    // `deni-tap.webp`, which silently aliases one photo onto another person.
    // Payload re-encodes images to webp, so that extension is a candidate too.
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { in: EXTENSIONS.map((ext) => key + ext) } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      map[key] = existing.docs[0].id
      continue
    }

    const filePath = findAsset(key)
    if (!filePath) {
      map[key] = null
      missing.push(key)
      continue
    }

    const created = await payload.create({
      collection: 'media',
      locale: 'bg',
      data: {
        alt: alt.bg,
        ...(alt.focal ? { focalX: alt.focal[0], focalY: alt.focal[1] } : {}),
      },
      filePath,
      overrideAccess: true,
    })
    await payload.update({
      collection: 'media',
      id: created.id,
      locale: 'en',
      data: { alt: alt.en },
      overrideAccess: true,
    })
    map[key] = created.id
    log(`uploaded ${path.basename(filePath)}`)
  }

  if (missing.length) {
    log(`no file found for: ${missing.join(', ')}`)
    log(`  → drop them in assets-inbox/ (as <name>.jpg) and re-run, or upload in /admin`)
  }
  return map
}

/**
 * Attaches newly-available media to records that already exist.
 *
 * The documented workflow is "drop the photos into assets-inbox/ and re-run
 * `npm run seed`" — but by then the teachers and pages have been created, and
 * the create-if-missing guards skip right past them. This pass fills image
 * references that are still empty, and only those: a photo the school has since
 * chosen for themselves is never replaced.
 */
const backfillMedia = async (payload: Payload, media: MediaMap) => {
  let filled = 0

  // ── Focal points ──────────────────────────────────────────────────────────
  // Only touch images still sitting on Payload's 50/50 default, which means
  // nobody has dragged the focal point in the CMS yet.
  for (const [key, spec] of Object.entries(MEDIA_ALT)) {
    const id = media[key]
    if (!id || !spec.focal) continue
    const doc = await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true })
    if (doc.focalX !== 50 || doc.focalY !== 50) continue

    await payload.update({
      collection: 'media',
      id,
      data: { focalX: spec.focal[0], focalY: spec.focal[1] },
      overrideAccess: true,
    })
    filled++
  }

  // ── Teachers ──────────────────────────────────────────────────────────────
  for (const teacher of TEACHERS) {
    if (!teacher.key || !media[teacher.key]) continue
    const { docs } = await payload.find({
      collection: 'teachers',
      locale: 'bg',
      where: { name: { equals: teacher.bg.name } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const doc = docs[0]
    if (!doc || doc.photo) continue

    await payload.update({
      collection: 'teachers',
      id: doc.id,
      locale: 'bg',
      data: { photo: media[teacher.key] },
      overrideAccess: true,
    })
    filled++
  }

  // ── Page hero images ──────────────────────────────────────────────────────
  for (const shell of PAGE_SHELLS) {
    const image = media[shell.hero]
    if (!image) continue
    const { docs } = await payload.find({
      collection: 'pages',
      locale: 'bg',
      where: { slug: { equals: shell.bg.slug } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    })
    const doc = docs[0]
    if (!doc || doc.hero?.image) continue

    await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'bg',
      data: { hero: { type: 'image', image }, _status: 'published' },
      overrideAccess: true,
    })
    filled++
  }

  // ── Home page ─────────────────────────────────────────────────────────────
  const home = await payload.findGlobal({ slug: 'home-page', locale: 'bg', depth: 0 })
  const homePatch: Row = {}

  if (!home.hero?.photo && media.all) {
    homePatch.hero = { ...home.hero, photo: media.all }
    filled++
  }
  if (!home.about?.image && media['kalina-miro-lindy']) {
    homePatch.about = { ...home.about, image: media['kalina-miro-lindy'] }
    filled++
  }
  if (!home.festivalCard?.logo && media['swing-buzz-logo']) {
    homePatch.festivalCard = { ...home.festivalCard, logo: media['swing-buzz-logo'] }
    filled++
  }

  const tiles = home.videoStrip?.items ?? []
  const tileSpec: { video?: number | null; image?: number | null }[] = [
    { video: media['kalina-miro-short'], image: media['kalina-miro-short-poster'] },
    { video: media['miro-kalina-slow-motion'], image: media['miro-kalina-slow-motion-poster'] },
    { video: media['miro-kalina-apollo-jumps'], image: media['miro-kalina-apollo-jumps-poster'] },
  ]
  const tileNeedsFill = (tile: { video?: unknown; image?: unknown }, i: number) =>
    Boolean((!tile.video && tileSpec[i]?.video) || (!tile.image && tileSpec[i]?.image))

  if (tiles.some(tileNeedsFill)) {
    homePatch.videoStrip = {
      ...home.videoStrip,
      // Keep each row's id so the English titles stay attached to their tile.
      items: tiles.map((tile, i) => ({
        ...tile,
        video: tile.video ?? tileSpec[i]?.video ?? null,
        image: tile.image ?? tileSpec[i]?.image ?? null,
      })),
    }
    filled += tiles.filter(tileNeedsFill).length
  }

  if (Object.keys(homePatch).length > 0) {
    await payload.updateGlobal({
      slug: 'home-page',
      locale: 'bg',
      data: homePatch as never,
      overrideAccess: true,
    })
  }

  log(filled > 0 ? `attached ${filled} image${filled === 1 ? '' : 's'} to existing records` : 'no images to attach')
}

/* ══ teachers ══════════════════════════════════════════════════════════════ */

const TEACHERS = [
  { key: 'miro', bg: { name: 'Миро', d: 'Линди хоп, Джаз' }, en: { name: 'Miro', d: 'Lindy hop, Jazz' } },
  { key: null, bg: { name: 'Калина Г.', d: 'Линди хоп, Джаз, Степ' }, en: { name: 'Kalina G.', d: 'Lindy hop, Jazz, Tap' } },
  { key: 'deni', bg: { name: 'Дени', d: 'Джаз, Степ' }, en: { name: 'Deni', d: 'Jazz, Tap' } },
  { key: null, bg: { name: 'Иван', d: 'Линди хоп' }, en: { name: 'Ivan', d: 'Lindy hop' } },
  { key: 'kalina', bg: { name: 'Калина К.', d: 'Линди хоп' }, en: { name: 'Kalina K.', d: 'Lindy hop' } },
  { key: 'rosi', bg: { name: 'Роси', d: 'Джаз, Линди хоп' }, en: { name: 'Rosi', d: 'Jazz, Lindy hop' } },
  { key: 'mitko', bg: { name: 'Митко', d: 'Партита' }, en: { name: 'Mitko', d: 'Parties' } },
  { key: 'viki', bg: { name: 'Виктория', d: 'Арт и визия' }, en: { name: 'Viktoria', d: 'Art and visuals' } },
]

const seedTeachers = async (payload: Payload, media: MediaMap) => {
  for (const [index, teacher] of TEACHERS.entries()) {
    const existing = await payload.find({
      collection: 'teachers',
      locale: 'bg',
      where: { name: { equals: teacher.bg.name } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) continue

    const created = await payload.create({
      collection: 'teachers',
      locale: 'bg',
      data: {
        name: teacher.bg.name,
        disciplines: teacher.bg.d,
        photo: teacher.key ? media[teacher.key] : null,
        active: true,
        order: index,
      },
      overrideAccess: true,
    })
    await payload.update({
      collection: 'teachers',
      id: created.id,
      locale: 'en',
      data: { name: teacher.en.name, disciplines: teacher.en.d },
      overrideAccess: true,
    })
  }
  log(`${TEACHERS.length} teachers ready`)
}

/* ══ pages ═════════════════════════════════════════════════════════════════ */

const PAGE_SHELLS = [
  {
    key: 'beginners',
    bg: {
      slug: 'swing-za-nachinaeshti',
      kicker: 'Курс',
      title: 'Swing танци за начинаещи',
      lead: '🎷 Искаш ли да танцуваш един от най-забавните и социални танци? Ще учим най-популярния SWING танц - Линди Хоп, който се появил в Ню Йорк през 30-те години на миналия век.',
    },
    en: {
      slug: 'swing-dance-for-beginners',
      kicker: 'Course',
      title: 'Swing dance for beginners',
      lead: "🎷 Want to dance one of the most fun and social dances there is? We'll learn the most popular SWING dance — Lindy Hop, born in New York in the 1930s.",
    },
    hero: 'kalina-miro-lindy',
    cta: { bg: 'Запиши се', en: 'Sign up' },
  },
  {
    key: 'lindy',
    bg: {
      slug: 'lindi-hop',
      kicker: 'Танц',
      title: 'Линди хоп',
      lead: 'Двойковият танц на суинг ерата — роден в Харлем през 30-те години, танцуван на живата музика на големите бендове.',
    },
    en: {
      slug: 'lindy-hop',
      kicker: 'Dance',
      title: 'Lindy hop',
      lead: 'The partner dance of the swing era — born in Harlem in the 1930s, danced to the live music of the big bands.',
    },
    hero: 'kalina-miro-lindy',
    cta: { bg: 'Влез в група', en: 'Join a group' },
  },
  {
    key: 'jazz',
    bg: {
      slug: 'avtentichen-dzhaz',
      kicker: 'Танц',
      title: 'Автентичен джаз',
      lead: 'Соло стъпките от старите филми и джаз клубове — стил, ритъм и характер, без нужда от партньор.',
    },
    en: {
      slug: 'authentic-jazz',
      kicker: 'Dance',
      title: 'Authentic jazz',
      lead: "The solo steps from the old films and jazz clubs — style, rhythm and character, with no partner needed.",
    },
    hero: 'miro',
    cta: { bg: 'Запиши се', en: 'Sign up' },
  },
  {
    key: 'tap',
    bg: {
      slug: 'step',
      kicker: 'Танц',
      title: 'Степ',
      lead: 'Ти си инструментът. Ритъм с обувки — от бавни основи до истинска джаз импровизация.',
    },
    en: {
      slug: 'tap',
      kicker: 'Dance',
      title: 'Tap',
      lead: 'You are the instrument. Rhythm with your shoes — from slow basics to real jazz improvisation.',
    },
    hero: 'deni-tap',
    cta: { bg: 'Запиши се', en: 'Sign up' },
  },
] as const

type PageKey = (typeof PAGE_SHELLS)[number]['key']
type PageMap = Record<PageKey, number>

/** Pass one: the pages themselves, so cross-links have ids to point at. */
const seedPageShells = async (payload: Payload, media: MediaMap): Promise<PageMap> => {
  const map = {} as PageMap

  for (const shell of PAGE_SHELLS) {
    const existing = await payload.find({
      collection: 'pages',
      locale: 'bg',
      where: { slug: { equals: shell.bg.slug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      map[shell.key] = existing.docs[0].id
      continue
    }

    const created = await payload.create({
      collection: 'pages',
      locale: 'bg',
      data: {
        slug: shell.bg.slug,
        kicker: shell.bg.kicker,
        title: shell.bg.title,
        lead: shell.bg.lead,
        hero: media[shell.hero]
          ? { type: 'image', image: media[shell.hero] }
          : { type: 'none' },
        cta: { ...external(shell.cta.bg, SWINGBUZZ) },
        _status: 'published',
      },
      overrideAccess: true,
    })

    await payload.update({
      collection: 'pages',
      id: created.id,
      locale: 'en',
      data: {
        slug: shell.en.slug,
        kicker: shell.en.kicker,
        title: shell.en.title,
        lead: shell.en.lead,
        cta: { label: shell.cta.en },
        _status: 'published',
      },
      overrideAccess: true,
    })

    map[shell.key] = created.id
  }

  log(`${PAGE_SHELLS.length} pages ready`)
  return map
}

/** Pass two: the block content, now that every page id is known. */
const seedPageBlocks = async (payload: Payload, pages: PageMap, media: MediaMap) => {
  const homeAnchor = (locale: 'bg' | 'en', anchor: string) => `/${locale}/#${anchor}`
  const schedulePath = (locale: 'bg' | 'en') => `/${locale}/schedule`

  type BlockSpec = { bg: Row; en: Row }

  const textBlock = (bgRuns: Run[], enRuns: Run[]): BlockSpec => ({
    bg: { blockType: 'text', content: richText(bgRuns) },
    en: { blockType: 'text', content: richText(enRuns) },
  })
  const headingBlock = (bg: string, en: string): BlockSpec => ({
    bg: { blockType: 'heading', text: bg },
    en: { blockType: 'heading', text: en },
  })
  const listBlock = (bg: string[], en: string[]): BlockSpec => ({
    bg: { blockType: 'list', ordered: false, items: bg.map((text) => ({ text })) },
    en: { blockType: 'list', ordered: false, items: en.map((text) => ({ text })) },
  })
  const quoteBlock = (bg: string, en: string): BlockSpec => ({
    bg: { blockType: 'quote', text: bg },
    en: { blockType: 'quote', text: en },
  })
  const videoSlot = (poster: string, bg: string, en: string): BlockSpec => ({
    bg: { blockType: 'video', source: 'placeholder', poster: media[poster], caption: bg },
    en: { blockType: 'video', source: 'placeholder', poster: media[poster], caption: en },
  })
  /** A real uploaded clip, with the poster frame ffmpeg pulled from it. */
  const videoFile = (key: string, bg: string, en: string): BlockSpec => ({
    bg: { blockType: 'video', source: 'file', file: media[key], poster: media[`${key}-poster`], caption: bg },
    en: { blockType: 'video', source: 'file', file: media[key], poster: media[`${key}-poster`], caption: en },
  })

  const BLOCKS: Record<PageKey, BlockSpec[]> = {
    beginners: [
      headingBlock('Какво включва курсът', 'What the course includes'),
      textBlock(
        [
          plain(
            '📅 Курсът се състои от 11 класа по 70 минути. Записваш се сам или с приятел — партньор не е нужен, сменяме се в час. Учителите са от ',
          ),
          urlRun('екипа на школата', homeAnchor('bg', 'team')),
          plain('.'),
        ],
        [
          plain(
            "📅 The course is 11 classes of 70 minutes. Sign up alone or with a friend — you don't need a partner, we rotate in class. The teachers come from ",
          ),
          urlRun("the school's team", homeAnchor('en', 'team')),
          plain('.'),
        ],
      ),
      listBlock(
        [
          '11 класа по 70 минути',
          'Без предварителен опит и без партньор',
          'Основи на линди хоп и малко соло джаз',
          'Свободно влизане в социалните ни партита',
        ],
        [
          '11 classes of 70 minutes',
          'No previous experience and no partner needed',
          'Lindy hop basics and a little solo jazz',
          'Free entry to our social parties',
        ],
      ),
      headingBlock('След курса', 'After the course'),
      textBlock(
        [
          plain('Продължаваш във второ ниво или добавяш '),
          doc('автентичен джаз', pages.jazz),
          plain(' и '),
          doc('степ', pages.tap),
          plain('. Всяка есен и пролет каним гост-учители, а през септември е '),
          urlRun('Swing Buzz Festival', SWINGBUZZ),
          plain('.'),
        ],
        [
          plain('You carry on into level two, or add '),
          doc('authentic jazz', pages.jazz),
          plain(' and '),
          doc('tap', pages.tap),
          plain('. Every autumn and spring we invite guest teachers, and September brings the '),
          urlRun('Swing Buzz Festival', SWINGBUZZ),
          plain('.'),
        ],
      ),
      quoteBlock(
        'Първият час е най-трудният. После е само танц.',
        "The first class is the hardest. After that it's just dancing.",
      ),
      videoSlot(
        'deni-tap',
        'Място за видео от час — качва се от CMS',
        'Space for a video from class — upload it from the CMS',
      ),
    ],

    lindy: [
      textBlock(
        [
          plain(
            'Танцува се с партньор, но се записваш сам — в час сменяме партньорите. Началните групи започват от нулата: ритъм, водене и първите фигури. ',
          ),
          urlRun('Виж кога започва следващата група', schedulePath('bg')),
          plain('.'),
        ],
        [
          plain(
            'It is danced with a partner, but you sign up on your own — we rotate partners in class. Beginner groups start from zero: rhythm, leading and following, and the first figures. ',
          ),
          urlRun('See when the next group starts', schedulePath('en')),
          plain('.'),
        ],
      ),
      headingBlock('Нива', 'Levels'),
      listBlock(
        ['Начинаещи — от нулата, 11 класа', 'Второ ниво — след първи курс', 'Напреднали — по покана на учителите'],
        [
          'Beginners — from zero, 11 classes',
          'Level two — after the first course',
          "Advanced — by the teachers' invitation",
        ],
      ),
      ...(media['kalina-miro-savoy-cup']
        ? [
            videoFile(
              'kalina-miro-savoy-cup',
              'Калина и Миро на Savoy Cup',
              'Kalina and Miro at the Savoy Cup',
            ),
          ]
        : []),
      ...(media.all
        ? [
            {
              bg: {
                blockType: 'image',
                image: media.all,
                caption: 'Място за снимка от парти — качва се от CMS',
              },
              en: {
                blockType: 'image',
                image: media.all,
                caption: 'Space for a party photo — upload it from the CMS',
              },
            } satisfies BlockSpec,
          ]
        : []),
    ],

    jazz: [
      textBlock(
        [
          plain(
            'Работим по оригинални клипове от 30-те и 40-те: Shim Sham, Big Apple, Tranky Doo. Джазът е и най-бързият начин да подобриш ',
          ),
          doc('линди хопа', pages.lindy),
          plain(' си.'),
        ],
        [
          plain(
            "We work from original clips from the '30s and '40s: Shim Sham, Big Apple, Tranky Doo. Jazz is also the fastest way to improve your ",
          ),
          doc('lindy hop', pages.lindy),
          plain('.'),
        ],
      ),
      quoteBlock(
        'Ти не следваш музиката. Ти си част от нея.',
        "You don't follow the music. You are part of it.",
      ),
    ],

    tap: [
      textBlock(
        [
          plain(
            'Групите са малки, за да чуваме всеки. Започва се с меки основи и бавно темпо; обувки със степове не са нужни в първите седмици. Води ',
          ),
          urlRun('Дени', homeAnchor('bg', 'team')),
          plain('.'),
        ],
        [
          plain(
            "Groups are small so we can hear everyone. We start with gentle basics at a slow tempo; you won't need tap shoes for the first few weeks. Taught by ",
          ),
          urlRun('Deni', homeAnchor('en', 'team')),
          plain('.'),
        ],
      ),
      videoSlot('deni-tap', 'Място за видео — качва се от CMS', 'Space for a video — upload it from the CMS'),
    ],
  }

  for (const shell of PAGE_SHELLS) {
    const id = pages[shell.key]
    const current = await payload.findByID({
      collection: 'pages',
      id,
      locale: 'bg',
      draft: true,
      overrideAccess: true,
    })
    // Never overwrite blocks the school has already written.
    if (current.blocks && current.blocks.length > 0) continue

    const specs = BLOCKS[shell.key]

    const updated = await payload.update({
      collection: 'pages',
      id,
      locale: 'bg',
      data: { blocks: specs.map((spec) => spec.bg) as never, _status: 'published' },
      overrideAccess: true,
    })

    await payload.update({
      collection: 'pages',
      id,
      locale: 'en',
      data: {
        blocks: withIds(updated.blocks, specs.map((spec) => spec.en)) as never,
        _status: 'published',
      },
      overrideAccess: true,
    })
  }

  log('page content written')
}

/* ══ courses ═══════════════════════════════════════════════════════════════ */

const seedCourses = async (payload: Payload, pages: PageMap): Promise<number | null> => {
  const existing = await payload.find({
    collection: 'courses',
    locale: 'bg',
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const created = await payload.create({
    collection: 'courses',
    locale: 'bg',
    data: {
      title: 'Swing танци за начинаещи',
      subtitle: '11 класа по 70 минути · без партньор',
      summary:
        '🎷 Искаш ли да танцуваш един от най-забавните и социални танци? Ще учим най-популярния SWING танц - Линди Хоп, който се появил в Ню Йорк през 30-те години на миналия век.',
      level: 'Начинаещи',
      tags: [
        { label: '11 класа по 70 минути' },
        { label: 'Без партньор' },
        { label: 'Ниво: начинаещи' },
      ],
      duration: '11 класа по 70 мин',
      startNote: TBD_BG,
      day: TBD_BG,
      time: TBD_BG,
      price: TBD_BG,
      venue: VENUE_BG,
      mapUrl: MAP_STUDENTS_HOUSE,
      status: 'open',
      registration: external('Запиши се', SWINGBUZZ),
      page: pages.beginners,
      showOnSchedule: true,
      order: 0,
    },
    overrideAccess: true,
  })

  await payload.update({
    collection: 'courses',
    id: created.id,
    locale: 'en',
    data: {
      title: 'Swing dance for beginners',
      subtitle: '11 classes of 70 minutes · no partner needed',
      summary:
        "🎷 Want to dance one of the most fun and social dances there is? We'll learn the most popular SWING dance — Lindy Hop, born in New York in the 1930s.",
      level: 'Beginners',
      tags: withIds(created.tags, [
        { label: '11 classes of 70 minutes' },
        { label: 'No partner needed' },
        { label: 'Level: beginners' },
      ]) as never,
      duration: '11 classes of 70 min',
      startNote: TBD_EN,
      day: TBD_EN,
      time: TBD_EN,
      price: TBD_EN,
      venue: VENUE_EN,
      registration: { label: 'Sign up' },
    },
    overrideAccess: true,
  })

  log('1 course ready')
  return created.id
}

/* ══ events ════════════════════════════════════════════════════════════════ */

const seedEvents = async (payload: Payload, pages: PageMap) => {
  const existing = await payload.find({ collection: 'events', limit: 1, overrideAccess: true })
  if (existing.totalDocs > 0) return

  const events = [
    {
      bg: {
        title: 'Swing Buzz Festival 2026',
        dateLabel: '25—27 септ. 2026',
        timeNote: '22:00 — 04:00',
        venue: 'ОКИ „Красно село“, София',
        ticket: external('Записване', SWINGBUZZ),
      },
      en: {
        title: 'Swing Buzz Festival 2026',
        dateLabel: '25—27 Sept 2026',
        timeNote: '22:00 — 04:00',
        venue: 'Krasno Selo Culture Centre, Sofia',
        ticket: { label: 'Registration' },
      },
      shared: {
        type: 'festival' as const,
        startsAt: '2026-09-25T19:00:00.000Z',
        endsAt: '2026-09-28T01:00:00.000Z',
        mapUrl: MAP_KRASNO_SELO,
        featured: true,
        showOnSchedule: true,
      },
    },
    {
      bg: {
        title: 'Социални танци',
        dateNote: 'датата се уточнява',
        timeNote: '21:00 — 01:00',
        venue: VENUE_BG,
        ticket: external('Instagram', INSTAGRAM),
      },
      en: {
        title: 'Social dancing',
        dateNote: 'date to be confirmed',
        timeNote: '21:00 — 01:00',
        venue: VENUE_EN,
        ticket: { label: 'Instagram' },
      },
      shared: { type: 'party' as const, mapUrl: MAP_STUDENTS_HOUSE, featured: true, showOnSchedule: true },
    },
    {
      bg: {
        title: 'Нова група за начинаещи',
        dateNote: 'датата се уточнява',
        timeNote: 'часът се уточнява',
        venue: VENUE_BG,
        ticket: pageLink('Детайли', pages.beginners),
      },
      en: {
        title: 'New beginners group',
        dateNote: 'date to be confirmed',
        timeNote: 'time to be confirmed',
        venue: VENUE_EN,
        ticket: { label: 'Details' },
      },
      shared: { type: 'course' as const, mapUrl: MAP_STUDENTS_HOUSE, featured: true, showOnSchedule: true },
    },
  ]

  for (const event of events) {
    const created = await payload.create({
      collection: 'events',
      locale: 'bg',
      data: { ...event.shared, ...event.bg } as never,
      overrideAccess: true,
    })
    await payload.update({
      collection: 'events',
      id: created.id,
      locale: 'en',
      data: event.en as never,
      overrideAccess: true,
    })
  }

  log(`${events.length} events ready`)
}

/* ══ globals ═══════════════════════════════════════════════════════════════ */

const seedSiteSettings = async (payload: Payload, media: MediaMap) => {
  const current = await payload.findGlobal({ slug: 'site-settings', locale: 'bg', depth: 0 })
  // A populated nav means the school has already configured this. On --fresh we
  // rewrite regardless: the media ids the globals point at have just been
  // deleted, so keeping the old values would leave broken image references.
  if (!FRESH && current.nav && current.nav.length > 0) return

  const updated = await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'bg',
    data: {
      brandName: 'Swing Society',
      logo: media['logo-dark'],
      heroBadge: 'Swing Society · София',
      cta: external('Запиши се', SWINGBUZZ),
      registrationOpen: true,
      phone: '+359 88 555 4597',
      email: 'theswingbuzz@gmail.com',
      addressLine: 'София, България',
      venue: VENUE_BG,
      venueMapUrl: MAP_STUDENTS_HOUSE,
      socials: [
        { platform: 'instagram', label: 'Instagram', url: INSTAGRAM },
        { platform: 'facebook', label: 'Facebook', url: FACEBOOK },
        { platform: 'website', label: 'swingbuzz.eu', url: SWINGBUZZ },
      ],
      nav: [
        { link: section('Начинаещи', 'beginners') },
        { link: scheduleLink('График') },
        { link: section('Танци', 'dances') },
        { link: section('Въпроси', 'faq') },
        { link: section('Екип', 'team') },
        { link: section('Контакти', 'contact') },
      ],
      footerLinks: [
        { link: section('За нас', 'about') },
        { link: scheduleLink('График') },
        { link: section('Събития', 'events') },
        { link: external('Safe Space политика', CODE_OF_CONDUCT) },
      ],
      footerNote: 'Всеки е добре дошъл — независимо от възраст, пол и опит.',
      meta: {
        title: 'Swing Society — школа за суинг танци в София',
        description:
          'Линди хоп, автентичен джаз и степ в София. Курсове за начинаещи без партньор и без опит, за хора от 10 до 100 години.',
        image: media.all,
      },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      heroBadge: 'Swing Society · Sofia',
      cta: { label: 'Sign up' },
      addressLine: 'Sofia, Bulgaria',
      venue: VENUE_EN,
      socials: withIds(updated.socials, [
        { platform: 'instagram', label: 'Instagram', url: INSTAGRAM },
        { platform: 'facebook', label: 'Facebook', url: FACEBOOK },
        { platform: 'website', label: 'swingbuzz.eu', url: SWINGBUZZ },
      ]) as never,
      nav: withIds(updated.nav, [
        { link: section('Beginners', 'beginners') },
        { link: scheduleLink('Schedule') },
        { link: section('Dances', 'dances') },
        { link: section('FAQ', 'faq') },
        { link: section('Team', 'team') },
        { link: section('Contact', 'contact') },
      ]) as never,
      footerLinks: withIds(updated.footerLinks, [
        { link: section('About', 'about') },
        { link: scheduleLink('Schedule') },
        { link: section('Events', 'events') },
        { link: external('Safe Space policy', CODE_OF_CONDUCT) },
      ]) as never,
      footerNote: 'Everyone is welcome — whatever your age, gender or experience.',
      meta: {
        title: 'Swing Society — swing dance school in Sofia',
        description:
          'Lindy hop, authentic jazz and tap in Sofia. Beginner courses with no partner and no experience needed, for people from 10 to 100.',
      },
    } as never,
  })

  log('site settings written')
}

const seedHomePage = async (payload: Payload, media: MediaMap, courseId: number | null, pages: PageMap) => {
  const current = await payload.findGlobal({ slug: 'home-page', locale: 'bg', depth: 0 })
  if (!FRESH && current.hero?.intro) return

  const updated = await payload.updateGlobal({
    slug: 'home-page',
    locale: 'bg',
    data: {
      hero: {
        heading: 'Танцувай\nкато през\n30-те.',
        intro:
          'Swing Society е школата за линди хоп, автентичен джаз и степ в София — за хора от 10 до 100 години, за всякакви нива.',
        photo: media.all,
        primaryCta: section('Влез в група за начинаещи', 'beginners'),
        secondaryCta: scheduleLink('Виж графика'),
      },
      courseCard: { enabled: true, badge: 'Следваща група', course: courseId, linkLabel: 'Виж курса' },
      festivalCard: {
        enabled: true,
        badge: 'Фестивал',
        dates: 'София · 25—27 септември 2026',
        heading: 'Swing Buzz\nFestival 2026',
        body: 'Фестивалът за олд скул Джаз и Линди хоп. Партита, класове и толкова с най-добрите Линди хопъри в света.',
        logo: media['swing-buzz-logo'],
        link: external('swingbuzz.eu', SWINGBUZZ),
      },
      beginners: {
        enabled: true,
        kicker: 'Начинаещи',
        heading: 'Влез в група за начинаещи',
        intro:
          'В Swing Society не ти трябва партньор, опит или танцов бекграунд. Първият курс започва от нулата и след 11 класа танцуваш на парти.',
        course: courseId,
        courseLinkLabel: 'Виж курса',
        reassuranceHeading: 'Без притеснения',
        reassurances: [
          { text: 'Идваш сам — сменяме партньорите в час' },
          { text: 'Без опит и без специални обувки' },
          { text: 'От 10 до 100 години, всякакви нива' },
          { text: 'Влизаш свободно в социалните ни партита' },
        ],
        signup: {
          enabled: true,
          heading: 'Още не е моментът?',
          body: 'Остави имейл и ще ти пишем веднага щом обявим следващата група.',
          placeholder: 'твоят имейл',
          buttonLabel: 'Кажи ми кога започва',
          successMessage: 'Готово — ще ти пишем.',
        },
      },
      reviews: {
        enabled: true,
        kicker: 'Отзиви',
        heading: 'Какво казват танцуващите',
        allLink: external('Виж всички отзиви в Google', GOOGLE_REVIEWS),
        placeholderNote: 'Място за отзив.',
      },
      videoStrip: {
        enabled: true,
        kicker: 'Видео',
        heading: 'Как изглежда отвътре',
        handleLink: external('@bgswingsociety', INSTAGRAM),
        items: [
          {
            title: 'Линди хоп в зала',
            video: media['kalina-miro-short'],
            image: media['kalina-miro-short-poster'],
          },
          {
            title: 'Забавен кадър',
            video: media['miro-kalina-slow-motion'],
            image: media['miro-kalina-slow-motion-poster'],
          },
          {
            title: 'Въздушни фигури',
            video: media['miro-kalina-apollo-jumps'],
            image: media['miro-kalina-apollo-jumps-poster'],
          },
        ],
        note: 'Още клипове — в Instagram.',
      },
      dances: {
        enabled: true,
        kicker: 'Танци',
        heading: 'Три езика на суинга',
        intro: 'Всеки от трите се учи от нулата и се танцува заедно с останалите.',
        introLink: external('Виж курсовете', SWINGBUZZ),
        items: [pages.lindy, pages.jazz, pages.tap],
        linkLabel: 'Виж повече',
      },
      faq: {
        enabled: true,
        kicker: 'Въпроси',
        heading: 'Преди първия час',
        items: [
          {
            question: 'Трябва ли ми партньор?',
            answer: 'Не. Записваш се сам и сменяме партньорите в час — така се учи по-бързо.',
          },
          {
            question: 'Нужен ли е опит?',
            answer: 'Не. Началните групи започват от първата стъпка и от първия брой в музиката.',
          },
          {
            question: 'С какви обувки да дойда?',
            answer:
              'С каквито и да е — важното е да не се закачат в пода. Танцови обувки не са нужни в началото.',
          },
          {
            question: 'На колко години са хората?',
            answer:
              'От 10 до 100. В групите има ученици, родители с деца и хора, които танцуват веднъж седмично след работа.',
          },
          {
            question: 'Мога ли да пропусна час?',
            answer: 'Да. Пиши ни и ще ти кажем как да наваксаш материала в друга група.',
          },
          {
            question: 'Друг въпрос?',
            answer: 'Обади се или пиши — отговаряме бързо.',
            link: section('Контакти', 'contact'),
          },
        ],
      },
      events: {
        enabled: true,
        kicker: 'За текущите ученици',
        heading: 'Предстоящи събития',
        intro: 'Класове, партита и фестивали на едно място.',
        allLink: scheduleLink('Целият график'),
        limit: 3,
      },
      team: {
        enabled: true,
        kicker: 'Екип',
        heading: 'Хората, които водят',
        intro: 'Преподаватели, които пътуват по цял свят и се връщат с автентичния материал.',
      },
      about: {
        enabled: true,
        kicker: 'За нас',
        heading: 'Няколко неща в едно',
        paragraphs: [
          {
            text: 'Swing Society е няколко неща в едно - школа за суинг танци за хора от 10 до 100 години за всякакви нива с изключително опитни преподаватели, които пътуват по цял свят и носят в България автентични истории, опит и преживявания.',
          },
          {
            text: 'Swing Society е и ъндърграунд култура, но отворена за всеки. Някои само танцуват при нас веднъж седмично след работа, някои водят децата си и танцуват с тях.',
          },
        ],
        image: media['kalina-miro-lindy'],
      },
      contact: {
        enabled: true,
        kicker: 'Контакти',
        heading: 'Пиши ни',
        intro: 'Въпрос за курс, парти или частен урок — обади се или пиши, отговаряме бързо.',
      },
      footerCta: {
        heading: 'Първият час е най-трудният. После е само танц.',
        cta: external('Запиши се за начинаещи', SWINGBUZZ),
      },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      hero: {
        heading: "Dance\nlike it's\nthe '30s.",
        intro:
          'Swing Society is the school for lindy hop, authentic jazz and tap in Sofia — for people from 10 to 100, at every level.',
        primaryCta: section('Join a beginners group', 'beginners'),
        secondaryCta: scheduleLink('See the schedule'),
      },
      courseCard: { badge: 'Next group', linkLabel: 'See the course' },
      festivalCard: {
        badge: 'Festival',
        dates: 'Sofia · 25—27 September 2026',
        heading: 'Swing Buzz\nFestival 2026',
        body: 'The festival for old-school jazz and lindy hop. Parties, classes and more with some of the best lindy hoppers in the world.',
        link: external('swingbuzz.eu', SWINGBUZZ),
      },
      beginners: {
        kicker: 'Beginners',
        heading: 'Join a beginners group',
        intro:
          'At Swing Society you need no partner, no experience and no dance background. The first course starts from zero, and after 11 classes you are dancing at a party.',
        courseLinkLabel: 'See the course',
        reassuranceHeading: 'Nothing to worry about',
        reassurances: withIds(updated.beginners?.reassurances, [
          { text: 'Come on your own — we rotate partners in class' },
          { text: 'No experience and no special shoes' },
          { text: 'From 10 to 100 years old, every level' },
          { text: 'Free entry to our social parties' },
        ]) as never,
        signup: {
          heading: 'Not the right time yet?',
          body: "Leave your email and we'll write the moment we announce the next group.",
          placeholder: 'your email',
          buttonLabel: 'Tell me when it starts',
          successMessage: "Done — we'll be in touch.",
        },
      },
      reviews: {
        kicker: 'Reviews',
        heading: 'What the dancers say',
        allLink: external('See all reviews on Google', GOOGLE_REVIEWS),
        placeholderNote: 'Space for a review.',
      },
      videoStrip: {
        kicker: 'Video',
        heading: 'What it looks like inside',
        handleLink: external('@bgswingsociety', INSTAGRAM),
        items: withIds(updated.videoStrip?.items, [
          {
            title: 'Lindy hop in the studio',
            video: media['kalina-miro-short'],
            image: media['kalina-miro-short-poster'],
          },
          {
            title: 'Slow motion',
            video: media['miro-kalina-slow-motion'],
            image: media['miro-kalina-slow-motion-poster'],
          },
          {
            title: 'Aerials',
            video: media['miro-kalina-apollo-jumps'],
            image: media['miro-kalina-apollo-jumps-poster'],
          },
        ]) as never,
        note: 'More clips on Instagram.'
      },
      dances: {
        kicker: 'Dances',
        heading: 'Three languages of swing',
        intro: 'Each of the three is taught from scratch, and they are all danced together.',
        introLink: external('See the courses', SWINGBUZZ),
        linkLabel: 'See more',
      },
      faq: {
        kicker: 'Questions',
        heading: 'Before your first class',
        items: withIds(updated.faq?.items, [
          {
            question: 'Do I need a partner?',
            answer: 'No. You sign up on your own and we rotate partners in class — you learn faster that way.',
          },
          {
            question: 'Do I need experience?',
            answer: 'No. Beginner groups start from the first step and the first count in the music.',
          },
          {
            question: 'What shoes should I bring?',
            answer:
              "Any shoes — what matters is that they don't grip the floor. You don't need dance shoes to start.",
          },
          {
            question: 'How old is everyone?',
            answer:
              'From 10 to 100. Our groups have school students, parents with their children, and people who dance once a week after work.',
          },
          {
            question: 'Can I miss a class?',
            answer: "Yes. Write to us and we'll tell you how to catch up with another group.",
          },
          {
            question: 'Another question?',
            answer: 'Call or write — we answer quickly.',
            link: section('Contact', 'contact'),
          },
        ]) as never,
      },
      events: {
        kicker: 'For current students',
        heading: 'Upcoming events',
        intro: 'Classes, parties and festivals in one place.',
        allLink: scheduleLink('The full schedule'),
      },
      team: {
        kicker: 'Team',
        heading: 'The people who teach',
        intro: 'Teachers who travel the world and come back with the authentic material.',
      },
      about: {
        kicker: 'About us',
        heading: 'Several things at once',
        paragraphs: withIds(updated.about?.paragraphs, [
          {
            text: 'Swing Society is several things at once — a swing dance school for people from 10 to 100 at every level, with exceptionally experienced teachers who travel the world and bring authentic stories, skill and experience back to Bulgaria.',
          },
          {
            text: 'Swing Society is also an underground culture, but one open to everyone. Some people just dance with us once a week after work; some bring their children and dance with them.',
          },
        ]) as never,
      },
      contact: {
        kicker: 'Contact',
        heading: 'Get in touch',
        intro: 'A question about a course, a party or a private lesson — call or write, we answer quickly.',
      },
      footerCta: {
        heading: "The first class is the hardest. After that it's just dancing.",
        cta: external('Sign up for beginners', SWINGBUZZ),
      },
    } as never,
  })

  log('home page written')
}

const seedSchedulePage = async (payload: Payload) => {
  const current = await payload.findGlobal({ slug: 'schedule-page', locale: 'bg', depth: 0 })
  if (!FRESH && current.lead) return

  await payload.updateGlobal({
    slug: 'schedule-page',
    locale: 'bg',
    data: {
      kicker: 'График',
      title: 'Класове, партита, фестивали',
      lead: 'Всичко на едно място, подредено по дата. Кликни на датата, за да я добавиш в календара си. Запази страницата — обновяваме я при всяка нова група или парти.',
      groupsHeading: 'Групи',
      groupsNote: richText([
        plain('Следващите групи се обявяват в '),
        urlRun('Instagram', INSTAGRAM),
        plain(' и по имейл — '),
        urlRun('остави адрес тук', '/bg/#beginners'),
        plain('.'),
      ]),
      eventsHeading: 'Партита и фестивали',
      emptyNote: 'Скоро обявяваме следващите дати.',
      primaryCta: external('Запиши се за начинаещи', SWINGBUZZ),
      secondaryCta: section('Контакти', 'contact'),
      meta: {
        title: 'График — Swing Society',
        description: 'Кога започват групите за начинаещи и кога са следващите суинг партита и фестивали в София.',
      },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'schedule-page',
    locale: 'en',
    data: {
      kicker: 'Schedule',
      title: 'Classes, parties, festivals',
      lead: 'Everything in one place, ordered by date. Click a date to add it to your calendar. Bookmark the page — we update it with every new group and party.',
      groupsHeading: 'Groups',
      groupsNote: richText([
        plain('New groups are announced on '),
        urlRun('Instagram', INSTAGRAM),
        plain(' and by email — '),
        urlRun('leave your address here', '/en/#beginners'),
        plain('.'),
      ]),
      eventsHeading: 'Parties and festivals',
      emptyNote: "We'll announce the next dates soon.",
      primaryCta: external('Sign up for beginners', SWINGBUZZ),
      secondaryCta: section('Contact', 'contact'),
      meta: {
        title: 'Schedule — Swing Society',
        description:
          'When the next beginners groups start, and when the next swing parties and festivals happen in Sofia.',
      },
    } as never,
  })

  log('schedule page written')
}

/* ══ admin user ════════════════════════════════════════════════════════════ */

const ensureAdmin = async (payload: Payload) => {
  const { totalDocs } = await payload.count({ collection: 'users', overrideAccess: true })
  if (totalDocs > 0) return

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    log('no SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD — create the first user at /admin')
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Admin', role: 'admin' },
    overrideAccess: true,
  })
  log(`admin user created: ${email}`)
}

/* ══ fresh ═════════════════════════════════════════════════════════════════ */

const wipe = async (payload: Payload) => {
  for (const collection of ['pages', 'courses', 'events', 'teachers', 'reviews', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
  }
  log('content collections emptied')
}

/* ══ main ══════════════════════════════════════════════════════════════════ */

const main = async () => {
  console.log(`\n▸ Seeding Swing Society${FRESH ? ' (fresh — existing content will be deleted)' : ''}\n`)
  const payload = await getPayload({ config })

  if (FRESH) await wipe(payload)

  await ensureAdmin(payload)
  const media = await seedMedia(payload)
  await seedTeachers(payload, media)
  const pages = await seedPageShells(payload, media)
  const courseId = await seedCourses(payload, pages)
  await seedPageBlocks(payload, pages, media)
  await seedEvents(payload, pages)
  await seedSiteSettings(payload, media)
  await seedHomePage(payload, media, courseId, pages)
  await seedSchedulePage(payload)
  // Last: everything it fills has to exist first.
  await backfillMedia(payload, media)

  console.log('\n✓ Done. Start the site with `npm run dev` and open http://localhost:3000\n')
  process.exit(0)
}

main().catch((error) => {
  console.error('\n✗ Seed failed\n', error)
  process.exit(1)
})
