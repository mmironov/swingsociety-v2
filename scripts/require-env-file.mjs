/**
 * Fails with an explanation when an --env-file target is missing.
 *
 * Node's own message for this is `node: .env.production.local: not found`, which
 * names the file but not what it is, why it is absent, or how to create it — and
 * it is absent by design, since the file holds production credentials and is
 * gitignored.
 */
import { existsSync } from 'fs'

const file = process.argv[2]

if (!file) {
  console.error('require-env-file: no file given')
  process.exit(1)
}

if (!existsSync(file)) {
  console.error(`
✗ ${file} does not exist.

  It holds the production values for seeding, and is gitignored — so it never
  arrives with a checkout. Create it from the template:

      cp .env.example ${file}

  Then fill in DATABASE_URI (the Neon *pooled* string), BLOB_READ_WRITE_TOKEN,
  PAYLOAD_SECRET, and the SEED_ADMIN_* login you want for the CMS.

  Your .env is untouched by this — it keeps pointing at the local Docker
  Postgres, so npm run dev is unaffected.
`)
  process.exit(1)
}
