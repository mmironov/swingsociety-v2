# Swing Society

Website and CMS for the Swing Society dance school in Sofia. Bulgarian and
English, one Next.js app, one deploy.

- **Site** — `/bg` and `/en`, statically rendered
- **CMS** — Payload 3 at `/admin`, in Bulgarian
- **Database** — Postgres (Neon in production, Docker locally)

The school's own guide to editing content is [`docs/CMS.md`](docs/CMS.md), with a
Bulgarian version alongside it at [`docs/CMS.bg.md`](docs/CMS.bg.md). Both assume
no technical background.

---

## Local setup

```bash
npm install
```

```bash
cp .env.example .env
```

Generate a `PAYLOAD_SECRET` and paste it into `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the database (needs Docker running):

```bash
npm run db:up
```

Load the content — the design's copy in Bulgarian and English, plus the first
admin account from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`:

```bash
npm run seed
```

Run it:

```bash
npm run dev
```

- Site → http://localhost:3000
- CMS → http://localhost:3000/admin

### Scripts

| Command                    | What it does                                                        |
| -------------------------- | ------------------------------------------------------------------- |
| `npm run dev`              | Dev server, schema auto-synced from the Payload config               |
| `npm run build`            | Production build (prerenders every page in both languages)           |
| `npm start`                | Serve the build                                                     |
| `npm run seed`             | Fill anything empty; never overwrites edited content                 |
| `npm run seed:fresh`       | **Deletes all content** and reseeds — local development only         |
| `npm run video:prepare`    | Transcode clips in `assets-inbox/` to web-ready mp4 + poster frames  |
| `npm run db:up` / `:down`  | Start / stop the local Postgres                                     |
| `npm run db:reset`         | Drop the local database volume and start clean                      |
| `npm run generate:types`   | Regenerate `src/payload-types.ts` after changing a collection        |
| `npm run generate:importmap` | Regenerate the admin import map after adding an admin component    |
| `npm run typecheck`        | `tsc --noEmit`                                                      |

After editing anything in `src/collections`, `src/globals`, `src/fields` or
`src/blocks`, run `npm run generate:types` — the whole front end is typed off
that file.

---

## How it fits together

```
src/
├─ app/
│  ├─ (site)/                  the public website
│  │  ├─ globals.css           all site styling, ported from the design
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx         root layout: fonts, <html lang>, metadata
│  │  │  ├─ page.tsx           home page
│  │  │  ├─ schedule/          the schedule tables
│  │  │  └─ [slug]/            CMS pages (courses, dances)
│  │  └─ api/subscribe/        stores emails from the sign-up form
│  └─ (payload)/               the admin panel — Payload scaffolding, leave alone
├─ collections/                Pages, Courses, Events, Teachers, Reviews, Media,
│                              Subscribers, Users
├─ globals/                    HomePage, SchedulePage, SiteSettings
├─ blocks/                     the block types a Page is built from
├─ fields/                     link.ts (one link, five destinations), slug.ts
├─ components/
│  ├─ site/                    nav, footer, blocks, rich text, shared pieces
│  ├─ home/                    one component per home-page section
│  └─ admin/                   the dashboard welcome note
├─ lib/                        content queries, link resolution, media, i18n
├─ hooks/revalidate.ts         refreshes the static pages after every CMS edit
├─ seed/                       the seed script and its content
└─ middleware.ts               locale routing and language negotiation
```

### Decisions worth knowing

**Bulgarian is the source of truth.** Every text field is localized with `bg` as
the default and `fallback: true`, so an empty English field renders the Bulgarian
text rather than a blank. The school can translate gradually.

**Slugs are localized.** `/bg/lindi-hop` and `/en/lindy-hop` are the same
document. The language switcher looks up the sibling slug, so it never lands on a
404.

**Links are one field, not a URL box.** `linkField()` produces a destination that
is an external URL, a CMS page, a home-page section, the schedule, or nothing at
all. `resolveLink()` turns it into an href with the right locale prefix, and
returns `null` when there is nothing to point at — so an unfinished CMS entry
leaves a gap instead of a button that goes to `#`.

**Pages are blocks, not a wysiwyg.** Heading, text, list, quote, image and video,
each styled by the design. Rich text inside a Text block is deliberately limited
to bold, italic and links, so an editor cannot produce a heading the type scale
does not style.

**Dates can be unknown.** Courses and events each have a real date field *and* a
note ("уточнява се"). The note shows until a date is set. This is how the school
actually works, and the design was drawn that way.

**Everything is prerendered, and revalidated on save.** `src/hooks/revalidate.ts`
calls `revalidatePath('/', 'layout')` after any content change, so an edit in the
CMS reaches the live site within seconds without a rebuild.

**Missing photos degrade gracefully.** A teacher without a photo gets a gradient
tile with their initial (the design does this for two of them); a video block
with no URL yet gets the dashed placeholder frame.

### Styling

`src/app/(site)/globals.css` is the whole site's CSS. It carries the design's
tokens and `clamp()` type scales verbatim, with the inline styles turned into
named classes. It is a single dark theme on purpose — the swing-era look *is* the
dark one — so there is no light mode to keep in sync.

Buttons use the heading face (Playfair Display). That is the design system's own
choice, not an oversight.

---

## Deployment — Vercel + Neon

### 1. Database

Create a Postgres database at [neon.tech](https://neon.tech) and copy the
**pooled** connection string (the host contains `-pooler`). Serverless functions
open many short-lived connections; the pooled endpoint is what survives that.

### 2. Migrations

Development syncs the schema automatically (`push: true`). Production does not —
it applies migrations at build time, so a cold start never tries to alter tables.

Create a migration whenever you change a collection or global:

```bash
npm run payload migrate:create
```

Commit the file from `src/migrations/`. Then set Vercel's build command to:

```bash
npm run payload migrate && npm run build
```

### 3. File storage

Uploads currently go to `public/media` on disk. **Vercel's filesystem is
ephemeral**, so images uploaded through the admin panel there will disappear on
the next deploy. Before going live, add a storage adapter:

```bash
npm i @payloadcms/storage-vercel-blob
```

```ts
// src/payload.config.ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

plugins: [
  vercelBlobStorage({
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
]
```

Create a Blob store in the Vercel dashboard; it sets `BLOB_READ_WRITE_TOKEN`
for you. `@payloadcms/storage-s3` works the same way if you would rather use S3
or Cloudflare R2.

### 4. Environment variables

Set these in the Vercel project (all environments):

| Variable                 | Value                                               |
| ------------------------ | --------------------------------------------------- |
| `DATABASE_URI`           | Neon **pooled** connection string                   |
| `PAYLOAD_SECRET`         | A fresh 32-byte random hex string — not the local one |
| `NEXT_PUBLIC_SERVER_URL` | `https://swingsociety.bg` (no trailing slash)       |

`NEXT_PUBLIC_SERVER_URL` drives canonical URLs, share images and the admin
panel's preview links, so it must match the real domain.

### 5. First deploy

Push the repo, import it in Vercel, deploy. Then open `/admin` and create the
first user — the seed's admin account only exists in your local database.

To load the starting content into production, point `DATABASE_URI` at Neon
locally and run `npm run seed` once. It only fills what is empty, so it is safe
to run against a live database — but `seed:fresh` is not.

### 6. Email (not yet configured)

Payload logs password-reset emails to the console instead of sending them. Before
handing the CMS to people who might forget a password, add an adapter:

```bash
npm i @payloadcms/email-resend
```

Without it, a forgotten password has to be reset from the command line.

---

## Photos and cropping

All nine photographs are loaded. Every frame that shows them crops — the team
tile is 3:4, the dance card is a wide 320px band, the detail-page hero is a wide
banner — and these are full-length studio portraits at 4000×6000. Cropped from
the centre, that lands on the waist and cuts heads off.

So each image carries a **focal point**, set in `MEDIA_ALT` in `src/seed/run.ts`
and stored on the Media record. `focalY` is roughly where the face sits;
`focalPosition()` turns it into `object-position` and every cropped image on the
site honours it. If a crop ever looks wrong, drag the focal point in
`/admin/collections/media` — no code change needed.

These replaced the per-card `object-position` values the design hard-coded, which
could only ever suit one image per slot.

## Video

Clips dropped into `assets-inbox/` are prepared by:

```bash
npm run video:prepare
```

That writes `assets-inbox/derived/<name>.mp4` plus `<name>-poster.jpg`, and
`npm run seed` loads from `derived/` in preference to the originals. `src/seed/prepare-videos.ts`
holds the encode settings; the two that matter are `+faststart` (so playback
starts before the file has finished downloading) and never serving `.mov`, which
Firefox cannot play at all. Poster frames are grabbed two seconds in unless the
clip has an entry in `POSTER_AT` — one of these opens on an empty studio, so its
poster is taken from the aerial at 37.5s instead. The school's phone exports came in at 7–15 Mbps and
land around 1.5–1.9 Mbps, roughly a tenth of the original size.

Uploaded video is stored in the Media collection like any other file. Payload
skips the sharp pipeline for non-image types, so no derivative sizes are
generated, and it serves the file with byte-range support — seeking works.

Two places consume it:

- **Home video tiles** — each tile takes an optional video plus a poster. With a
  video set, the tile keeps the design's poster-and-play-button look and plays
  inline on click (`src/components/site/VideoTile.tsx`). `preload="metadata"`
  means the page costs a few hundred bytes per tile rather than ~8 MB; nothing
  autoplays. Without a video, the tile stays the link-out the design drew.
- **Video blocks on pages** — a YouTube/Vimeo link, an uploaded file, or a dashed
  placeholder if neither is set yet.

For anything longer than a minute or two, prefer a YouTube link: no bandwidth
cost, and adaptive quality on a phone.

## Known gaps

- **Иван and Калина Г. have no photo.** They render the design's gradient tile
  with their initial. Add `ivan.jpg` / `kalina-g.jpg` to `assets-inbox/` and run
  `npm run seed`, or attach a photo in the admin panel.
- **The hero crops the group shot.** The hero frame is nearly square (~513×520 at
  desktop) and `all.jpg` is a 3:2 landscape with six people spread edge to edge,
  so roughly 17% is cut from each side and the two people on the ends are lost.
  No focal point can fix that — it needs either a different hero photo or a
  wider frame. See the notes below.
- **Reviews are empty on purpose.** The design had three placeholder slots; so
  does the site, rendered with a dashed border. Paste real Google reviews into
  the Reviews collection and the placeholders disappear.
- **The beginners and tap pages keep their video placeholders.** None of the
  clips supplied is class footage or tap, so the dashed frames are honest rather
  than filled with something unrelated.
- **Self-hosted video costs bandwidth.** Four clips total ~30 MB. Nothing
  downloads until a visitor presses play, but on Vercel this needs the blob
  storage below, and YouTube remains the cheaper answer for longer films.
- **A CMS page cannot use the slug `schedule`** — that route belongs to the
  schedule page.
