import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { bg } from '@payloadcms/translations/languages/bg'
import { en } from '@payloadcms/translations/languages/en'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { resendAdapter } from '@payloadcms/email-resend'
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

/**
 * Environment values, trimmed.
 *
 * A value pasted into a dashboard can carry invisible whitespace — this project
 * shipped with a leading tab in NEXT_PUBLIC_SERVER_URL, and the symptom was
 * "You are not allowed to perform this action" on every edit in the admin panel.
 * Payload compares the browser's Origin header against serverURL as a plain
 * string for CSRF, so a tab makes every authenticated write fail while reads,
 * being public, look perfectly healthy.
 *
 * It is also close to undiagnosable from the outside: the URL parser strips
 * leading whitespace, so canonical URLs and og:image come out correct, and if the
 * variable is marked Sensitive in Vercel the value cannot be read back to see it.
 */
const env = (name: string): string | undefined => process.env[name]?.trim() || undefined

const blobToken = resolveBlobToken()
if (blobToken && blobToken.name !== 'BLOB_READ_WRITE_TOKEN') {
  // Surface the name only — never the value.
  console.info(`[storage] using Vercel Blob token from ${blobToken.name}`)
}

/**
 * Outgoing email, only when a key is present.
 *
 * Without an adapter Payload writes emails to the console, which is fine locally
 * and useless in production: the only mail this site sends is a password reset, so
 * a forgotten password means resetting it from a command line against the live
 * database.
 *
 * Resend will not deliver from an unverified domain. Until swingsociety.bg is
 * verified there, EMAIL_FROM_ADDRESS can be left at Resend's onboarding sender,
 * which delivers to the account owner's address only — enough to test that the
 * flow works, not enough to mail anyone else.
 */
const resendKey = env('RESEND_API_KEY')
const email = resendKey
  ? resendAdapter({
      apiKey: resendKey,
      defaultFromAddress: env('EMAIL_FROM_ADDRESS') ?? 'onboarding@resend.dev',
      defaultFromName: env('EMAIL_FROM_NAME') ?? 'Swing Society',
    })
  : undefined

export default buildConfig({
  serverURL: env('NEXT_PUBLIC_SERVER_URL'),
  secret: env('PAYLOAD_SECRET') as string,
  ...(email ? { email } : {}),

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
    pool: { connectionString: env('DATABASE_URI') },
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
