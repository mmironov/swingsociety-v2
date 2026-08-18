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

export const pageBlocks: Block[] = [
  HeadingBlock,
  TextBlock,
  ListBlock,
  QuoteBlock,
  ImageBlock,
  VideoBlock,
]
