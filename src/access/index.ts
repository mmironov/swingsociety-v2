import type { Access } from 'payload'

/** Public read access — everything the website renders. */
export const anyone: Access = () => true

/** Any logged-in user (editor or admin) may write content. */
export const editors: Access = ({ req: { user } }) => Boolean(user)

/** Reserved for account and settings changes. */
export const admins: Access = ({ req: { user } }) => user?.role === 'admin'

/**
 * Published content is public; drafts are visible only to logged-in editors, so
 * an unfinished page can't be found by guessing its URL.
 */
export const publishedOrEditor: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
