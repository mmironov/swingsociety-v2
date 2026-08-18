import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Файлове и снимки' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Съдържание',
    description:
      'Всички снимки и видеа на сайта. Качи оригиналите — размерите за телефон и десктоп се правят автоматично.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  upload: {
    staticDir: 'public/media',
    // The site's photographs are shot on full-frame bodies; without a cap a
    // single 24MP hero would ship 8MB to a phone.
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 480, position: 'centre' },
      { name: 'card', width: 900 },
      { name: 'portrait', width: 800, height: 1066, position: 'centre' },
      { name: 'wide', width: 1600 },
      { name: 'hero', width: 2400 },
    ],
    focalPoint: true,
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Описание на снимката (alt)',
      localized: true,
      admin: {
        description:
          'Какво се вижда на снимката. Чете се от незрящи посетители и от Google. Остави празно само за чисто декоративни снимки.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Надпис под снимката',
      localized: true,
      admin: { description: 'Показва се под снимката, когато блокът го поддържа.' },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Фотограф',
      admin: { description: 'Не се показва автоматично — за твой архив.' },
    },
  ],
  hooks: revalidateHooks,
}
