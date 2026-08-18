/**
 * Turns the raw clips dropped in assets-inbox/ into something a website can
 * actually serve, writing the results to assets-inbox/derived/.
 *
 * The originals are phone and camera exports: H.264 in a QuickTime container at
 * 7–15 Mbps, which is 36–80 MB for half a minute. The codec is already fine —
 * it's the bitrate and the container that make them unservable, so this
 * re-encodes at a sane quality and remuxes to MP4.
 *
 * Two details that matter more than they look:
 *   • `-movflags +faststart` moves the index to the front of the file, so a
 *     browser can start playing before the whole thing has downloaded. Without
 *     it a 3 MB clip appears to hang.
 *   • `.mov` is deliberately never served. Safari plays it, Chrome usually does,
 *     Firefox does not. MP4 plays everywhere.
 *
 * Run with: npm run video:prepare
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(dirname, '../..')
const INBOX = path.join(ROOT, 'assets-inbox')
const OUT = path.join(INBOX, 'derived')

const SOURCE_EXTENSIONS = ['.mov', '.mp4', '.m4v', '.avi', '.mkv']

/**
 * Where to grab each clip's poster frame, keyed by prepared name.
 *
 * Two seconds in is a reasonable default — it skips the black frames and the
 * shaky start — but it is only a guess. `miro-kalina-apollo-jumps` opens with a
 * pan across an empty studio, so its default poster was a photo of a floor; the
 * aerial worth showing happens at 37.5s. Add an entry here when a clip's opening
 * seconds don't represent it.
 */
const POSTER_AT: Record<string, string> = {
  'miro-kalina-apollo-jumps': '00:00:37.5',
}
const DEFAULT_POSTER_AT = '00:00:02'

if (!ffmpegPath) {
  throw new Error('ffmpeg-static did not provide a binary. Run `npm install`.')
}
// Narrowed once here so every call site below is plainly a string.
const FFMPEG: string = ffmpegPath

/** `KalinaMiroSavoyCup` → `kalina-miro-savoy-cup`, `IMG_5495` → `img-5495`. */
const slugify = (name: string): string =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // split camelCase
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ffmpeg = (args: string[]) =>
  execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })

const probe = (file: string) => {
  // ffprobe isn't in ffmpeg-static, but ffmpeg itself will report the streams.
  const out = execFileSync(FFMPEG, ['-hide_banner', '-i', file], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  }).toString()
  return out
}

const dimensionsOf = (file: string): { width: number; height: number } | null => {
  let text = ''
  try {
    text = probe(file)
  } catch (error) {
    // ffmpeg exits non-zero when given no output target; the stream info we want
    // is on stderr regardless.
    text = String((error as { stderr?: Buffer }).stderr ?? '')
  }
  const match = text.match(/Stream #\d+:\d+.*Video:.*?(\d{2,5})x(\d{2,5})/)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

const mb = (bytes: number) => (bytes / 1048576).toFixed(1) + ' MB'

const main = () => {
  if (!fs.existsSync(INBOX)) {
    console.error('assets-inbox/ does not exist.')
    process.exit(1)
  }
  fs.mkdirSync(OUT, { recursive: true })

  const sources = fs
    .readdirSync(INBOX)
    .filter((f) => SOURCE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort()

  if (sources.length === 0) {
    console.log('No video files in assets-inbox/. Nothing to do.')
    return
  }

  console.log(`\n▸ Preparing ${sources.length} video${sources.length === 1 ? '' : 's'}\n`)

  for (const source of sources) {
    const input = path.join(INBOX, source)
    const slug = slugify(source)
    const videoOut = path.join(OUT, `${slug}.mp4`)
    const posterOut = path.join(OUT, `${slug}-poster.jpg`)

    const dims = dimensionsOf(input)
    if (!dims) {
      console.log(`  ${source}: could not read dimensions, skipping`)
      continue
    }
    const portrait = dims.height > dims.width

    // Up-to-date but modest: the tiles are ~300px wide and the widest video
    // block is 820px, so 720p on the long edge is already more than the layout
    // can show. Halving the resolution is most of the size win.
    const longEdge = 1280
    const scale = portrait
      ? `scale=-2:'min(${longEdge},ih)'`
      : `scale='min(${longEdge},iw)':-2`

    // Checked separately so retiming a poster doesn't force a re-encode.
    const inputTime = fs.statSync(input).mtimeMs
    const fresh = (out: string) => fs.existsSync(out) && fs.statSync(out).mtimeMs > inputTime
    const videoFresh = fresh(videoOut)
    const posterFresh = fresh(posterOut)

    if (videoFresh && posterFresh) {
      console.log(`  ${slug}: already prepared (${mb(fs.statSync(videoOut).size)})`)
      continue
    }

    if (!videoFresh) ffmpeg([
      '-i', input,
      '-map', '0:v:0',
      '-map', '0:a:0?',           // audio if present; the '?' keeps silent clips working
      '-dn',                      // no data streams copied from the source
      // ...and don't let the mp4 muxer synthesise a fresh timecode track from
      // the source's `timecode` tag, which is what -dn alone leaves behind.
      '-write_tmcd', '0',
      '-vf', scale,
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-preset', 'slow',
      // 26 rather than the usual 23: these are short clips that play in a 300px
      // tile or an 820px block, and the extra compression halves the download
      // without anything visible at that size. A maxrate cap keeps the busiest
      // seconds of fast footwork from spiking the file.
      '-crf', '26',
      '-maxrate', '2500k',
      '-bufsize', '5000k',
      '-pix_fmt', 'yuv420p',      // required for Safari and older Android
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ac', '2',
      '-movflags', '+faststart',
      '-map_metadata', '-1',      // drop camera metadata, including location
      videoOut,
    ])

    const posterAt = POSTER_AT[slug] ?? DEFAULT_POSTER_AT
    if (!posterFresh) {
      // -ss before -i seeks to the nearest keyframe first, which is fast and
      // accurate enough for a still.
      ffmpeg(['-ss', posterAt, '-i', input, '-frames:v', '1', '-vf', scale, '-q:v', '3', posterOut])
    }

    const before = fs.statSync(input).size
    const after = fs.statSync(videoOut).size
    const what = !videoFresh ? `${mb(before)} → ${mb(after)} (${Math.round((1 - after / before) * 100)}% smaller)` : 'video unchanged'
    console.log(
      `  ${slug}: ${dims.width}x${dims.height} ${portrait ? 'portrait' : 'landscape'} — ` +
        `${what}, poster @ ${posterAt}`,
    )
  }

  console.log(`\n✓ Written to assets-inbox/derived/ — run \`npm run seed\` to load them.\n`)
}

main()
