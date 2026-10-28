# Swing Society — notes for Claude

Bilingual (bg default, en fallback) Next.js + Payload CMS site for a Sofia swing school.
`README.md` has the background; this file is only what is dangerous, invariant, or has already cost time.

## Do not run these unless asked for them by name

**There is no backup of the production database.** Neon point-in-time restore is not enabled
and no dump exists. `/admin` is the only copy of the school's content.

- `ALLOW_REMOTE_WIPE=1 npm run seed:fresh` — deletes every page, course, event, teacher, review
  and media record. Against Neon that is the entire site, gone.
- `npm run content:import <file> --commit --allow-removals` — `--allow-removals` switches off the
  one check comparing incoming rows against what the target holds. It exists because an import
  once deleted the home page's three video tiles, in the source database and then in production.
- `node --env-file=.env.seed.local scripts/clear-dev-migration.mjs --yes` — removes the marker
  saying the schema changed outside the migration history.
- `npm run db:reset` — local only, but it drops the Docker volume, and local usually holds
  content nobody has exported.

Any script ending `:remote`, and `content:import`, read `.env.seed.local` and write to the **live**
database; treat the suffix as the warning. Changing `PAYLOAD_SECRET` in Vercel logs every CMS user out.

## Invariants

- **Bulgarian is the source of truth.** Fields are localized, `bg` default, `fallback: true`. Never
  write a Bulgarian value into the `en` locale — that once destroyed the English "Sign up" label.
  Keys matching content across databases come from the `bg` document, since slugs are localized too.
- **`src/app/(payload)/admin/importMap.js` is generated but must stay committed** — three files
  import it, and a checkout without it fails to compile.
- **`src/app/robots.ts` and `sitemap.ts` must stay at the app root.** `robots.ts` inside a route
  group compiles and is then silently ignored.
- **Leave `alwaysInsertFields: true` and `prefix: ''` alone in `payload.config.ts`** — removing
  either makes the `media` schema differ between local and production.
- After editing `src/collections`, `globals`, `fields` or `blocks`, run `npm run generate:types`;
  the whole front end is typed off that file.
- **Nothing re-renders on a clock.** Pages are prerendered and regenerate only on a CMS save or a
  deploy: no `revalidate` export, no cron. Date filters such as "upcoming events" freeze at the
  last edit, so the live site can go on advertising dates that have passed.

## Credentials

- `.env` and `.env.seed.local` (production values) are gitignored. Do not read, print or copy their
  contents anywhere — not into chat, a commit, or another file.
- **The GitHub repo is public.** Anything committed is world-readable and stays in the history:
  no secrets, no database dumps, no subscriber emails.
- Scripts print the database host and name only, never credentials. Keep it that way.
- Never create `.env.production.local`. Next loads it before `.env` during `next build`, silently
  pointing a local build at the live database and blob store.

## Traps already paid for, all of them silent

- A leading tab in `NEXT_PUBLIC_SERVER_URL` made every CMS edit fail with "You are not allowed to
  perform this action" while the public site looked fine. Environment values are trimmed in
  `payload.config.ts` because of it.
- A dev-mode push leaves a `batch = -1` row in `payload_migrations`. After that `payload migrate`
  prompts, gets no answer in CI and exits **0** — the Vercel build goes green having skipped every
  migration.
- `migrate:create` indents the SQL it writes, including lines inside quoted strings; check
  multi-line defaults in a generated migration by hand.
- The blob token is matched by name *suffix*; matching the exact name once disabled the plugin
  silently and sent uploads back to the ephemeral filesystem.

## Verifying work

Docker Desktop must be running or everything below fails at the database:

    npm run db:up && npx tsc --noEmit && npm run build

There is **no test suite**. Do not use `npm run lint`: with no ESLint config it hangs on an
interactive setup prompt. macOS has no `timeout`, so a guard test written with it passes
vacuously — that has happened here.

## Working style

Small, focused commits whose message explains why rather than what. Do not push unless asked.
Features go on a branch so Vercel builds a preview, and reach production by merging to `main`,
unless told otherwise. Previews still share the production database, so never push a branch
carrying a migration without saying so.
