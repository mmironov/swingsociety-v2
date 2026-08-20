/**
 * Removes the `dev` marker row from payload_migrations.
 *
 * Payload writes a row with batch = -1 whenever the schema is pushed rather than
 * migrated — any getPayload() call with NODE_ENV unset. While it is present,
 * `payload migrate` asks "data loss will occur, proceed?", and in a
 * non-interactive shell such as a Vercel build `prompts` returns nothing and the
 * code calls process.exit(0). Exit zero: migrations are skipped, the build carries
 * on against an un-migrated schema, and nothing in the log says so.
 *
 * Deleting the row says "I know what that push changed and the migrations account
 * for it". Do not run it without knowing that.
 *
 *   node --env-file=.env.seed.local scripts/clear-dev-migration.mjs        # show
 *   node --env-file=.env.seed.local scripts/clear-dev-migration.mjs --yes  # delete
 */
import { Client } from 'pg'

const COMMIT = process.argv.includes('--yes')
const uri = process.env.DATABASE_URI?.trim()

if (!uri) {
  console.error('✗ DATABASE_URI is not set. Pass --env-file=.env.seed.local for production.')
  process.exit(1)
}

const host = (() => {
  try {
    const u = new URL(uri)
    return `${u.hostname}${u.pathname}`
  } catch {
    return '(unparseable DATABASE_URI)'
  }
})()

const client = new Client({ connectionString: uri })
await client.connect()

const show = async (label) => {
  const { rows } = await client.query('select name, batch from payload_migrations order by id')
  console.log(`  ${label}: ${rows.map((r) => `${r.name} (batch ${r.batch})`).join(', ') || '(none)'}`)
  return rows
}

console.log(`\n▸ ${COMMIT ? 'DELETING' : 'DRY RUN'} on ${host}\n`)
const before = await show('before')
const markers = before.filter((r) => Number(r.batch) === -1)

if (markers.length === 0) {
  console.log('\n✓ No dev marker present — `payload migrate` will run without prompting.\n')
} else if (!COMMIT) {
  console.log(`\n  Would delete ${markers.length} row(s) with batch = -1.`)
  console.log('  Re-run with --yes to apply.\n')
} else {
  const { rowCount } = await client.query('delete from payload_migrations where batch = -1')
  console.log(`  deleted ${rowCount} row(s)`)
  await show('after ')
  console.log('\n✓ Done. `payload migrate` will now run without prompting.\n')
}

await client.end()
