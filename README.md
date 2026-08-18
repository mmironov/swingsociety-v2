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
| `npm run build:production` | `payload migrate` then build — this is Vercel's build command        |
| `npm start`                | Serve the build                                                     |
| `npm run seed`             | Fill anything empty; never overwrites edited content                 |
| `npm run seed:fresh`       | **Deletes all content** and reseeds — refuses a remote database       |
| `npm run seed:remote`      | Seed using `.env.production.local`, so `.env` keeps pointing at Docker |
| `npm run video:prepare`    | Transcode clips in `assets-inbox/` to web-ready mp4 + poster frames  |
| `npm run db:up` / `:down`  | Start / stop the local Postgres                                     |
| `npm run db:reset`         | Drop the local database volume and start clean                      |
| `npm run migrate:create`   | Generate a migration from your config changes                       |
| `npm run migrate`          | Apply pending migrations                                            |
| `npm run migrate:status`   | Which migrations have run                                           |
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
it applies migrations at build time, so a cold serverless start never tries to
alter tables.

The initial migration is committed (`src/migrations/20260818_153035_initial.ts`:
82 tables, 306 indexes, 215 foreign keys). Set Vercel's **build command** to:

```bash
npm run build:production
```

Create a new migration whenever you change a collection, global or field:

```bash
npm run migrate:create
```

⚠️ **Run `migrate:create` against an empty database.** It generates SQL by
diffing your config against the database it connects to, so pointed at your
already-synced dev database it produces an empty migration and you get no
warning. Create a scratch database first:

```bash
docker exec swingsociety-db psql -U swingsociety -d postgres -c "CREATE DATABASE scratch;"
```

Then run `migrate:create` with `DATABASE_URI` pointing at `scratch`, and drop it
afterwards.

⚠️ **Check multi-line default values in the generated file.** `migrate:create`
indents the SQL it writes by two spaces per line — including lines that fall
*inside* a quoted string literal. The home page's hero heading default is three
lines, and it came out as `'Танцувай\n  като през\n  30-те.'` with two spaces
injected into the value. Search the generated migration for string literals
spanning more than one line and dedent them by hand:

```bash
python3 -c "
import re, sys
s = open(sys.argv[1]).read()
for m in re.finditer(r\"'(?:[^']|'')*'\", s):
    if '\n' in m.group(0): print(repr(m.group(0)))
" src/migrations/<your-migration>.ts
```

To verify a migration reproduces what the config actually wants, build one
database with `migrate` and another with dev-mode `push`, then diff
`information_schema.columns`, `pg_indexes` and `pg_constraint` between them. They
should match exactly.

### 3. File storage

Configured, with one thing to do: **create a Blob store** in the Vercel
dashboard and link it to the project. That sets `BLOB_READ_WRITE_TOKEN`, and the
token is the switch:

| `BLOB_READ_WRITE_TOKEN` | Where uploads go | URL in `media.url` |
| --- | --- | --- |
| unset (local dev) | `public/media` on disk | `/api/media/file/all.webp` |
| set (production) | Vercel Blob | `https://<store>.public.blob.vercel-storage.com/all.webp` |

This matters because **Vercel's filesystem is ephemeral and read-only at
runtime**. Without the token, uploads through `/admin` fail and anything already
there disappears on the next deploy.


The token is found by **suffix**, not exact name: `BLOB_READ_WRITE_TOKEN` is
preferred, and otherwise any variable ending in `BLOB_READ_WRITE_TOKEN` whose
value looks like a blob token (`vercel_blob_rw_…`) is used. Vercel's connect
dialog offers an environment-variable prefix and forces one when a second store is
connected, producing names like `MEDIA_BLOB_READ_WRITE_TOKEN`. Matching only the
exact name made that misconfiguration silent in the worst way — plugin disabled,
uploads back on the ephemeral filesystem, build green, files gone on the next
deploy. See `src/lib/blobToken.ts`.

Two options in `src/payload.config.ts` are deliberate and worth not undoing:

- **`alwaysInsertFields: true`** — the plugin adds a `prefix` column to `media`,
  and by default only adds it when the plugin is enabled. Since it is disabled
  locally (no token) and enabled in production, the schema would differ between
  the two, and a migration generated locally would be missing a column
  production expects. Payload v4 makes this the default.
- **`disablePayloadAccessControl: true`** — serves images straight from the blob
  CDN. Without it Payload proxies every image request through
  `/api/media/file/*`, meaning a serverless function invocation to hand back a
  public file. The adapter only supports `access: 'public'` blobs and the Media
  collection is `read: anyone`, so proxying adds cost without adding privacy.

`@payloadcms/storage-s3` works the same way for S3 or Cloudflare R2.

Note that the site renders plain `<img>`, not `next/image`: Payload pre-generates
the five sizes at upload time and `mediaUrl()` picks the smallest that covers the
slot. So there is **no Vercel Image Optimization cost** — and no need to add the
blob host to `remotePatterns` in `next.config.mjs`.

### 4. Environment variables

Set these in the Vercel project (all environments):

| Variable                 | Value                                               |
| ------------------------ | --------------------------------------------------- |
| `DATABASE_URI`           | Neon **pooled** connection string                   |
| `PAYLOAD_SECRET`         | A fresh 32-byte random hex string — not the local one |
| `NEXT_PUBLIC_SERVER_URL` | `https://swingsociety.bg` (no trailing slash)       |
| `BLOB_READ_WRITE_TOKEN`  | Set for you when you link a Vercel Blob store       |

`NEXT_PUBLIC_SERVER_URL` drives canonical URLs, share images and the admin
panel's preview links, so it must match the real domain.

### 5. First deploy

**The order matters, and not in the obvious way.** Do it in exactly these steps:

**1. Import the repo in Vercel and deploy.** Set the build command to
`npm run build:production` — Vercel's default is `npm run build`, which skips both
the migration and the import-map regeneration.

The build starts with `scripts/check-env.mjs`, which reports every missing or
wrong environment variable at once rather than failing on the first one. It also
catches things nothing else would: a `NEXT_PUBLIC_SERVER_URL` still pointing at
localhost (inlined into the bundle, so it would silently ship a site whose
canonical URLs and share image point at your laptop), a trailing slash, a
`PAYLOAD_SECRET` shorter than 32 characters, an unpooled Neon host, and a missing
`BLOB_READ_WRITE_TOKEN`. The build runs `payload migrate`,
which creates the schema, then prerenders against a database that has tables but
no content. This works — verified — and gives you 8 pages instead of the usual
16, since there are no CMS pages to prerender yet. The site renders a sparse but
valid skeleton: the hero shows the `defaultValue` from the config, empty sections
hide themselves, and the review tiles show their dashed placeholders.

**2. Seed the content.** Put the production values in a separate file rather
than editing `.env` — otherwise `npm run dev` quietly starts talking to
production later:

```bash
cp .env.example .env.production.local
```

Fill in the Neon `DATABASE_URI`, the production `PAYLOAD_SECRET`, the real
`NEXT_PUBLIC_SERVER_URL` and `BLOB_READ_WRITE_TOKEN`, then:

```bash
npm run seed:remote
```

(`.env.production.local` is gitignored by the `.env*.local` rule.)

The photos and videos in `assets-inbox/` upload through Payload, so with the
token set they land in blob storage on the way through. The seed only fills what
is empty, so it is safe to re-run against a live database.

`seed:fresh` is **not** safe there — it deletes every page, course, event,
teacher, review and media record. It now refuses to run against a non-local
database unless you pass `ALLOW_REMOTE_WIPE=1`, and prints the target host (never
the credentials) so you can see what you are pointed at.

You will see a Postgres warning that `sslmode=require` is currently treated as
`verify-full`. It is advisory, about a future `pg` major, and Neon connections
work as-is.

**3. Redeploy.** In Vercel: project → Deployments → latest → **Redeploy**. No
commit needed.

Step 3 is the one that is easy to miss. Every page is prerendered, and the hooks
that refresh them call Next's `revalidatePath`, which only works *inside* the
running app. The seed is a separate process on your machine, so it cannot reach
the deployed cache — Vercel keeps serving the pages it built in step 1, and the
site looks empty even though Neon is full. The seed prints a reminder when it
notices it is writing to a non-local database.

This applies only to writes from outside the app. **Edits through the deployed
`/admin` panel need none of it** — those run inside the Next server, so they
reach the live site within seconds, which is the whole point of the setup.

Finally, open `/admin` and create your real user. The seed's admin account uses
`SEED_ADMIN_PASSWORD`; don't carry `changeme` into production.

### 6. Email (not yet configured)

Payload logs password-reset emails to the console instead of sending them. Before
handing the CMS to people who might forget a password, add an adapter:

```bash
npm i @payloadcms/email-resend
```

Without it, a forgotten password has to be reset from the command line.

---

## Moving content from local to production

`npm run seed` and `npm run seed:remote` load the *design's* baseline content and
fill only what is empty. Neither copies your local database — so anything you
entered in the local admin panel stays local. Two scripts move it:

```bash
npm run content:export /tmp/content.json   # reads .env        (local Docker)
npm run content:import /tmp/content.json   # reads .env.production.local (Neon)
```

The import is a **dry run unless you pass `--commit`**, and prints exactly which
rows it would update or create first.

It covers **Courses, Reviews, and the three globals** (home page, schedule page,
site settings). Media is deliberately excluded: those files are already in blob
storage under the names the seed assigned, and re-uploading would duplicate them.

Four things it handles that a database copy would get wrong:

- **Relationships travel as content-derived keys, not ids.** Media by filename
  stem, pages by slug, courses by title plus start date. Row ids differ between
  databases, so a copied id points at something unrelated. Anything unresolvable
  becomes null and is listed before any write happens.
- **Which fields are relationships comes from the Payload schema**, via
  `src/scripts/refs.ts`. Inferring it from a value's shape does not work: globals
  are full of plain groups that have a `title` — every video tile, the festival
  card, the SEO meta group — and treating those as course references turns real
  content into dangling nulls.
- **Keys are always built from the Bulgarian locale.** Page slugs and course titles
  are localized, so keying the English document against its own values finds
  nothing.
- **Localized arrays keep their ids, and nothing is deleted.** Writing the English
  pass without the ids Payload assigned on the Bulgarian pass makes it create fresh
  rows and orphan the Bulgarian text. And the home page references courses by id,
  so the seeded course is adopted and updated rather than left beside a copy —
  matching on title plus start date, since two courses share a title, so a re-run
  updates instead of duplicating.

Media filenames are matched on the stem with any `-N` suffix removed: seeding from
a machine that already has `public/media` makes Payload's collision check store
`all-1.webp` where local has `all.webp`.

Content written this way does **not** appear on the deployed site until you
redeploy, for the same reason the seed does not — see step 3 of First deploy.

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
- **Self-hosted video costs bandwidth.** Four clips total ~30 MB, served from
  Vercel Blob, whose data transfer is metered. Nothing downloads until a visitor
  presses play (`preload="metadata"`), but YouTube remains the cheaper answer for
  anything longer.
- **A CMS page cannot use the slug `schedule`** — that route belongs to the
  schedule page.
