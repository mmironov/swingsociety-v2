# assets-inbox

Drop the school's original photos here and run `npm run seed` — anything it finds
gets uploaded into the CMS Media library with its Bulgarian and English alt text
already filled in.

Name the files exactly like this (any of `.jpg` `.jpeg` `.png` `.webp` `.avif`):

| filename                | where it appears                                      |
| ----------------------- | ----------------------------------------------------- |
| `all`                   | hero photo, "Party" video tile, social share image    |
| `kalina-miro-lindy`     | Lindy hop card, "About us" photo, Lindy hop page hero |
| `deni-tap`              | Tap card, "Tap solo" video tile, video placeholders   |
| `miro`                  | Authentic jazz card + page hero, Miro's portrait       |
| `deni`                  | Deni's portrait                                        |
| `kalina`                | Kalina K.'s portrait                                   |
| `rosi`                  | Rosi's portrait                                        |
| `mitko`                 | Mitko's portrait                                       |
| `viki`                  | Viktoria's portrait                                    |

Portraits look best shot taller than wide (3:4). Upload full-resolution
originals — the CMS generates the phone and desktop sizes itself.

## Videos

Drop clips here in any format your camera or phone produces — `.mov`, `.mp4`,
`.m4v` — then run:

```bash
npm run video:prepare
```

That writes web-ready files to `derived/`: an `.mp4` at a sane bitrate plus a
poster frame taken two seconds in. A 76 MB phone clip comes out around 9 MB with
no visible difference at the sizes the site shows. Then `npm run seed` picks up
the files in `derived/` — never the originals.

Why it's needed: phone exports run at 7–15 Mbps in a QuickTime container.
Firefox won't play `.mov` at all, and no visitor should be asked to download
80 MB to watch half a minute of dancing.

Videos already wired up:

| Prepared name               | Where it appears                          |
| --------------------------- | ----------------------------------------- |
| `kalina-miro-short`         | first tile in the home page's video strip |
| `miro-kalina-slow-motion`   | second tile in the video strip            |
| `miro-kalina-apollo-jumps`  | third tile in the video strip             |
| `kalina-miro-savoy-cup`     | video block on the Lindy hop page         |

**If a poster frame looks wrong**, the grab point is two seconds in by default,
which fails on a clip that opens with a pan or an empty room. Add the clip to
`POSTER_AT` in `src/seed/prepare-videos.ts` with a better timestamp, delete the
old `-poster.jpg` from `derived/`, and re-run — only the poster is redone, not the
whole encode.

For anything longer than a minute or two, prefer YouTube: paste the link into a
Video block in the CMS and it embeds, costing you no bandwidth at all.

Files in this folder are not committed to git.

You can also skip this entirely and upload photos in the admin panel at
`/admin/collections/media`, then attach them to a teacher or a page.
