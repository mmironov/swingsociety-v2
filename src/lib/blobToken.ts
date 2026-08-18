/**
 * Finds the Vercel Blob token whatever Vercel decided to call it.
 *
 * Connecting a Blob store to a project normally sets BLOB_READ_WRITE_TOKEN, but
 * the connect dialog offers an environment-variable prefix, and connecting a
 * second store forces one. That yields names like MEDIA_BLOB_READ_WRITE_TOKEN.
 *
 * Reading only the exact name makes that misconfiguration silent in the worst
 * way: the plugin sees no token, disables itself, uploads fall back to the local
 * filesystem, the build still succeeds, the site still works — and every uploaded
 * file disappears on the next deploy. Matching on the suffix removes the whole
 * class of problem.
 *
 * Candidates must look like a blob token (`vercel_blob_rw_…`) so an unrelated
 * variable that happens to end in the same words cannot be picked up. The exact
 * name is trusted as-is, leaving the adapter to report a malformed value.
 */
export type BlobToken = { name: string; token: string }

export const resolveBlobToken = (env: NodeJS.ProcessEnv = process.env): BlobToken | null => {
  const exact = env.BLOB_READ_WRITE_TOKEN?.trim()
  if (exact) return { name: 'BLOB_READ_WRITE_TOKEN', token: exact }

  for (const [name, value] of Object.entries(env)) {
    if (name === 'BLOB_READ_WRITE_TOKEN' || !name.endsWith('BLOB_READ_WRITE_TOKEN')) continue
    const candidate = value?.trim()
    if (candidate && /^vercel_blob_rw_/i.test(candidate)) return { name, token: candidate }
  }

  return null
}

/**
 * Public host the adapter will serve this token's store from.
 *
 * Worth printing after a remote seed: the token decides which store the files go
 * into, and the deployed app rebuilds every media URL from *its own* token. Two
 * tokens for two stores means uploads land in one and the site asks the other, so
 * every image 404s while both halves look correct in isolation.
 *
 * Mirrors the adapter's own construction — store id from the token, `.public.`
 * hardcoded, since public access is all it supports.
 */
export const blobStoreHost = (token: string): string | null => {
  const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  return storeId ? `https://${storeId}.public.blob.vercel-storage.com` : null
}
