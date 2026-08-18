import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { bg } from '@payloadcms/translations/languages/bg'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Teachers } from './collections/Teachers'
import { Courses } from './collections/Courses'
import { Events } from './collections/Events'
import { Reviews } from './collections/Reviews'
import { Pages } from './collections/Pages'
import { Subscribers } from './collections/Subscribers'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { SchedulePage } from './globals/SchedulePage'

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set — copy .env.example to .env and fill it in.')
}
if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI is not set — run `npm run db:up` or point it at your Neon database.')
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET,

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Swing Society',
    },
    components: {
      // Replaces Payload's default dashboard blurb with a short orientation
      // note pointing at the two places that matter most.
      beforeDashboard: ['@/components/admin/Welcome#Welcome'],
    },
  },

  // The admin panel itself is offered in Bulgarian and English; `bg` is the
  // default so the school sees their own language on first login.
  i18n: {
    supportedLanguages: { bg, en },
    fallbackLanguage: 'bg',
  },

  // Content localization. Bulgarian is the source of truth; an English field
  // left empty falls back to Bulgarian rather than rendering blank.
  localization: {
    locales: [
      { label: 'Български', code: 'bg' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'bg',
    fallback: true,
  },

  collections: [Pages, Courses, Events, Teachers, Reviews, Media, Subscribers, Users],
  globals: [HomePage, SchedulePage, SiteSettings],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    // In development Payload reconciles the schema on boot. In production the
    // schema is applied by `payload migrate` during the build, so a cold serverless
    // start never tries to alter tables.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    disable: true,
  },

  upload: {
    limits: {
      // Room for a full-resolution photograph or a short clip.
      fileSize: 50_000_000,
    },
  },
})
