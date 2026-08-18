import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { bg } from '@payloadcms/translations/languages/bg'
import { en } from '@payloadcms/translations/languages/en'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { resolveBlobToken } from './lib/blobToken'

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set — copy .env.example to .env and fill it in.')
}
if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI is not set — run `npm run db:up` or point it at your Neon database.')
}

const blobToken = resolveBlobToken()
if (blobToken && blobToken.name !== 'BLOB_READ_WRITE_TOKEN') {
  // Surface the name only — never the value.
  console.info(`[storage] using Vercel Blob token from ${blobToken.name}`)
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

  plugins: [
    /**
     * Uploads go to Vercel Blob in production and stay on the local filesystem
     * in development, decided by whether the token is present.
     *
     * `alwaysInsertFields` is the important one. The plugin adds a `prefix`
     * column to `media`, and without this flag it would only add it when the
     * plugin is enabled — so the schema would differ between here and
     * production, and a migration generated locally would be missing a column
     * production expects. With it set, both environments carry the same shape.
     * (Payload v4 makes this the default.)
     *
     * Vercel's filesystem is ephemeral and read-only at runtime, so this is not
     * optional there: without it, uploads through /admin fail, and anything
     * already uploaded disappears on the next deploy.
     */
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      alwaysInsertFields: true,
      collections: {
        media: {
          /**
           * Serve straight from the blob CDN instead of proxying every image
           * through Payload's own /api/media/file route.
           *
           * Without this, each image request wakes a serverless function that
           * fetches the file from blob storage and streams it on — paying for a
           * function invocation to hand back a public file. The adapter only
           * supports `access: 'public'` blobs, and the Media collection is
           * `read: anyone`, so routing through Payload adds cost without adding
           * privacy. The URL stored in `media.url` becomes the absolute blob
           * address. The site uses plain <img>, so no next/image host config is
           * needed for it.
           */
          disablePayloadAccessControl: true,
        },
      },
      token: blobToken?.token,
    }),
  ],
})
