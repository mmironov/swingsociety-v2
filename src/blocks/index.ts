import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Deliberately narrow rich text: paragraphs, bold, italic and links, nothing
 * else. Headings, quotes, lists and images each have their own block, so an
 * editor can't produce a heading the page's type scale doesn't style.
 */
export const inlineRichText = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ['pages'],
      fields: ({ defaultFields }) => defaultFields,
    }),
  ],
})

const HeadingBlock: Block = {
  slug: 'heading',
  labels: { singular: 'Заглавие', plural: 'Заглавия' },
  fields: [{ name: 'text', type: 'text', label: 'Текст', required: true, localized: true }],
}

const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Текст', plural: 'Текстове' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Текст',
      required: true,
      localized: true,
      editor: inlineRichText,
      admin: {
        description:
          'Маркирай дума и натисни иконата за връзка, за да сложиш линк — може към друга страница от сайта или към външен адрес.',
      },
    },
  ],
}

const ListBlock: Block = {
  slug: 'list',
  labels: { singular: 'Списък', plural: 'Списъци' },
  fields: [
    {
      name: 'ordered',
      type: 'checkbox',
      label: 'Номериран списък',
      defaultValue: false,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Точки',
      labels: { singular: 'Точка', plural: 'Точки' },
      minRows: 1,
      required: true,
      fields: [{ name: 'text', type: 'text', label: 'Текст', required: true, localized: true }],
    },
  ],
}

const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Цитат', plural: 'Цитати' },
  fields: [
    { name: 'text', type: 'textarea', label: 'Цитат', required: true, localized: true },
    { name: 'attribution', type: 'text', label: 'Автор', localized: true },
  ],
}

const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Снимка', plural: 'Снимки' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Снимка', required: true },
    {
      name: 'caption',
      type: 'text',
      label: 'Надпис',
      localized: true,
      admin: { description: 'Оставиш ли празно, се използва надписът от самия файл.' },
    },
  ],
}

const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Видео', plural: 'Видеа' },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: 'Откъде е видеото',
      required: true,
      defaultValue: 'embed',
      options: [
        { label: 'YouTube / Vimeo (връзка)', value: 'embed' },
        { label: 'Качен файл', value: 'file' },
        { label: 'Още няма видео (запазено място)', value: 'placeholder' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Връзка към видеото',
      admin: {
        condition: (_, s) => s?.source === 'embed',
        description: 'Обикновеният адрес от YouTube или Vimeo — превръща се в плеър автоматично.',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Видео файл',
      admin: { condition: (_, s) => s?.source === 'file' },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Кадър преди пускане',
      admin: {
        description: 'Снимката, която се вижда, докато видеото не е пуснато.',
      },
    },
    { name: 'caption', type: 'text', label: 'Надпис', localized: true },
  ],
}

/**
 * Hosts an iframe may point at.
 *
 * An iframe src that any editor can set is a way to put someone else's page
 * inside ours, wearing our design — so it is limited to Google's own form, map
 * and calendar hosts, which is what this block exists for. Video has its own
 * block; YouTube does not belong here.
 */
const EMBED_HOSTS = [
  'docs.google.com',
  'forms.gle',
  'calendar.google.com',
  'www.google.com',
  'maps.google.com',
]

const EmbedBlock: Block = {
  slug: 'embed',
  labels: { singular: 'Вградена форма или карта', plural: 'Вградени форми и карти' },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'Адрес',
      required: true,
      localized: true,
      admin: {
        description:
          'Адресът на Google формата или картата. За форма: отвори формата → „Изпрати“ → иконата < > → копирай адреса от src. Може да е различен за български и английски.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim() === '') return 'Адресът е задължителен.'
        let url: URL
        try {
          url = new URL(value.trim())
        } catch {
          return 'Това не е валиден адрес.'
        }
        if (url.protocol !== 'https:') return 'Адресът трябва да започва с https://'
        if (!EMBED_HOSTS.includes(url.hostname)) {
          return `Може да се вгражда само от: ${EMBED_HOSTS.join(', ')}. За видео използвай блока „Видео“.`
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Описание за екранни четци',
      required: true,
      localized: true,
      defaultValue: 'Форма за записване',
      admin: {
        description:
          'Какво е вграденото — чете се от незрящи посетители, които иначе чуват само „рамка“.',
      },
    },
    {
      name: 'height',
      type: 'number',
      label: 'Височина (пиксели)',
      defaultValue: 1100,
      min: 200,
      max: 4000,
      admin: {
        description:
          'Google формите не могат да си кажат височината, затова се задава тук. Вземи числото от кода, който Google дава („Изпрати“ → < >) — то е в height="…". На тесен екран формата става по-висока, така че ако се реже, увеличи числото.',
      },
    },
  ],
}

export const pageBlocks: Block[] = [
  HeadingBlock,
  TextBlock,
  ListBlock,
  QuoteBlock,
  ImageBlock,
  VideoBlock,
  EmbedBlock,
]
