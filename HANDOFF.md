# Handoff — 28 October 2026

State, not rules. This file goes stale; `CLAUDE.md` does not. Everything below was
verified on 28 Oct 2026, read-only, except where it says the owner confirmed it.

## What is deployed

| | |
| --- | --- |
| Production | Vercel, built from `main` @ `bde29af` (merge of `schedule-mobile-cards`) |
| Pushed | 9 Sep 2026 18:40 UTC — owner confirms no code or Vercel changes since |
| Canonical host | `https://www.swingsociety.bg`; the apex redirects to it. `swingsociety-v2.vercel.app` still serves the whole site on its own hostname |
| Build command | `npm run build:production` |
| Database | Neon, pooled. **Shared by Production and Preview** |
| File storage | Vercel Blob, also shared with Preview |
| Email | Resend **not** configured — no `RESEND_API_KEY` |
| Analytics | Vercel Web Analytics, site only, not `/admin` |

Local branch `schedule-mobile-cards` is merged into `main` and was never pushed; it
can be deleted. `main` is the only branch on the remote.

## State of production data

The school has been editing through `/admin` since the last commit, so the live
content is well ahead of anything in the repo. As of today:

- A third location exists — Стара Загора, with its own course page
  `/bg/swing-jazz-v-stara-zagora` — alongside Лозенец and Цар Освободител.
- Five groups and four events are listed on `/bg/schedule`. `/sitemap.xml` has 22 URLs.
- **There is no backup.** Owner confirmed: no Neon point-in-time restore, no dump.
  `/admin` is the only copy of seven weeks of their work.

## Open items, roughly most urgent first

1. **The live site is advertising dates that have passed.** The hero reads
   "Следващ старт 7 октомври" and the schedule still lists the Swing Buzz Festival of
   25–27 Sept. The filters are correct (`startDate > now`, `endsAt >= now`); nothing
   re-runs them. Pages are prerendered and regenerate only on a CMS save or a deploy —
   there is no `revalidate` export and no cron. Any edit in `/admin` papers over it
   until the next date passes. A real fix is a time-based `revalidate` on the site
   routes or a Vercel cron that redeploys.
2. **Get a backup before anything else touches the database.** Neon branching or a
   scheduled `pg_dump` would both do. A dump must never be committed — the repo is public.
3. **Preview deployments still migrate the production database.** `build:production`
   runs `payload migrate`, and Preview inherits production env vars. Create a Neon
   branch and scope `DATABASE_URI` to Preview before pushing any branch with a migration.
   Procedure is in `README.md` under "Branches and preview deployments".
4. **Course copy disagrees with itself** (school's call, not a code fix): the three
   groups state length as "16 класа по 60 мин", "8 класа по 90 минути" and "60 мин",
   and no price appears anywhere on the site — Цар Освободител shows "Цена: уточнява се".
5. **No `RESEND_API_KEY` in Vercel.** Password resets are written to the log, so a
   forgotten CMS password can only be reset from a command line against the live database.
6. **`/dances`, `/team` and `/faq` have no SEO fields.** Those three globals have no
   `meta` group at all, unlike `SchedulePage`, so their titles are the page headings
   ("Какво танцуваме", "Хората, които водят", "Преди първия час") and carry none of the
   target keywords. Adding the group needs a migration.
7. **Google Business Profile is still not claimed.** Biggest single lever for
   "суинг софия"; only the owner can do it.
8. **Deprecated fields await a drop migration** — `home_page.dances`, `.faq`, `.team`
   and `beginners.course`. Hidden in the admin, data already copied and verified.
9. **`swingsociety-v2.vercel.app` is crawlable.** It is the production deployment, so
   `VERCEL_ENV` is `production` and the preview noindex rule in `src/app/robots.ts` does
   not apply: it answers `Allow: /` with no `X-Robots-Tag`. The canonical tag correctly
   points at `www.swingsociety.bg`, so this is a loose end rather than a live problem.
10. Cosmetic: Иван and Калина Г. have no photo and render the gradient tile; the local
   database has a stray ninth teacher ("Калина G.", Latin G) that production does not.

## Where things live on this machine

| Path | What |
| --- | --- |
| `.env` | Local dev — Docker Postgres on 5433. Gitignored |
| `.env.seed.local` | **Production** values: Neon URI, `PAYLOAD_SECRET`, blob token. Gitignored, read by every `:remote` script |
| `.claude/launch.json` | Dev-server config used by the in-app browser preview |
| `assets-inbox/` | Source photos and video for `npm run seed`. Gitignored |

Contents of the two env files are secrets; see `CLAUDE.md`.

## Toolchain quirks here

- **Docker Desktop was not running at handoff.** `dev`, `seed` and `build` all need it
  (`npm run db:up`), because the build prerenders by querying Payload.
- Node is **v25.9.0**, a non-LTS major and newer than anything this dependency set was
  pinned against (`engines` only sets a floor of 20.9.0). The last `npm run build`
  verified on this machine was 9 Sep; run one before trusting the toolchain.
- `git` uses SSH (`git@github.com:mmironov/swingsociety-v2`); `gh` is authenticated as
  `mmironov`.
- Prettier is **not** a project dependency — it is only present transitively — and
  `src/app/(site)/globals.css` and the schedule page already fail `npx prettier --check`
  on `main`. Don't reformat them as a side effect of an unrelated change.

## Prompt for a fresh session

```
This is the Swing Society site — a bilingual (Bulgarian default) Next.js 15 +
Payload CMS 3 project for a Sofia swing-dance school, live at
https://www.swingsociety.bg and deployed from `main` on Vercel.

Read CLAUDE.md first: it lists the destructive commands, the invariants, and the
silent traps that have already cost time. Then read HANDOFF.md for what is deployed,
the state of the production data, and the open items.

Two things to hold on to before doing anything: there is no backup of the production
database, and preview deployments still run migrations against it.

Do not change anything — no edits, no scripts, no commits — until I have told you
what I want done.
```
