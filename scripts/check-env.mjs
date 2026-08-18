/**
 * Preflight for the production build.
 *
 * Without this, a misconfigured deploy fails one variable at a time: the Payload
 * config throws on the first missing value, deep inside "Failed to collect page
 * data", and you fix it, redeploy, and meet the next one. This reports
 * everything at once, before the build starts.
 *
 * It also covers NEXT_PUBLIC_SERVER_URL, which nothing else checks. That one is
 * inlined into the bundle at build time and drives canonical URLs, the share
 * image and the admin panel's preview links — so getting it wrong does not fail
 * the build, it silently ships a site that points at the wrong origin.
 */
const onVercel = process.env.VERCEL === '1'
const errors = []
const warnings = []

const required = {
  DATABASE_URI: 'Postgres connection string. On Neon use the *pooled* host (contains "-pooler").',
  PAYLOAD_SECRET: 'Signs auth tokens. Generate: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
  NEXT_PUBLIC_SERVER_URL: 'Public origin, no trailing slash, e.g. https://swingsociety.bg',
}

for (const [name, hint] of Object.entries(required)) {
  if (!process.env[name]?.trim()) errors.push(`${name} is not set\n      ${hint}`)
}

const secret = process.env.PAYLOAD_SECRET?.trim()
if (secret && secret.length < 32) {
  errors.push(`PAYLOAD_SECRET is only ${secret.length} characters — use at least 32.\n      Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
if (serverUrl) {
  let parsed
  try {
    parsed = new URL(serverUrl)
  } catch {
    errors.push(`NEXT_PUBLIC_SERVER_URL is not a valid URL: ${serverUrl}`)
  }
  if (parsed) {
    if (serverUrl.endsWith('/')) {
      errors.push(`NEXT_PUBLIC_SERVER_URL must not end with a slash: ${serverUrl}`)
    }
    const isLocal = ['localhost', '127.0.0.1'].includes(parsed.hostname)
    if (onVercel && isLocal) {
      errors.push(`NEXT_PUBLIC_SERVER_URL points at ${parsed.hostname} in a deployed build.\n      It is baked into the bundle, so canonical URLs, og:image and admin preview links would all point at localhost.`)
    }
  }
}

const dbUri = process.env.DATABASE_URI?.trim()
if (onVercel && dbUri && /@(localhost|127\.0\.0\.1)/.test(dbUri)) {
  errors.push('DATABASE_URI points at localhost in a deployed build — a serverless function cannot reach it.')
}
if (onVercel && dbUri?.includes('neon.tech') && !dbUri.includes('-pooler')) {
  warnings.push('DATABASE_URI looks like Neon but is not the pooled host. Serverless opens many short-lived connections; prefer the host containing "-pooler".')
}

// Mirrors src/lib/blobToken.ts — kept inline because this script runs as plain
// JS before the TypeScript build. Change both together.
const blobVar = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  ? 'BLOB_READ_WRITE_TOKEN'
  : Object.entries(process.env).find(
      ([name, value]) =>
        name.endsWith('BLOB_READ_WRITE_TOKEN') && /^vercel_blob_rw_/i.test(value?.trim() ?? ''),
    )?.[0]

if (onVercel && !blobVar) {
  warnings.push('No Vercel Blob token found. Uploads will be written to the local filesystem, which on Vercel is ephemeral and read-only at runtime: uploading through /admin will fail, and any existing file disappears on the next deploy.\n      Create a Blob store (Storage → Create → Blob) and connect it to this project. Any variable name ending in BLOB_READ_WRITE_TOKEN is accepted, so a prefix is fine.')
} else if (onVercel && blobVar !== 'BLOB_READ_WRITE_TOKEN') {
  console.log(`  note: blob token found in ${blobVar}`)
}

for (const w of warnings) console.warn(`\n⚠  ${w}`)

if (errors.length > 0) {
  console.error(`\n✗ Cannot build — ${errors.length} problem${errors.length > 1 ? 's' : ''} with the environment:\n`)
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}\n`))
  console.error('  Set these in Vercel: Project → Settings → Environment Variables.\n')
  process.exit(1)
}

console.log(`✓ Environment looks good${warnings.length ? ` (${warnings.length} warning${warnings.length > 1 ? 's' : ''})` : ''}`)
