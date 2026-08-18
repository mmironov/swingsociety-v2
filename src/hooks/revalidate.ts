import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Every site route is prerendered, so an edit in the admin panel only reaches
 * visitors once Next regenerates the affected pages.
 *
 * The whole tree is revalidated rather than individual paths. It looks blunt,
 * but almost every record here shows up in more than one place — a course
 * appears on the home page and in the schedule, site settings appear in every
 * nav and footer — so targeted invalidation would mostly be a list of "and also"
 * cases waiting to go stale. At this size regenerating everything is cheap and
 * leaves nothing behind.
 */
const revalidateSite = (label: string) => {
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    // The seed script and the Payload CLI run outside a Next request, where
    // revalidatePath has no cache to talk to. Not an error worth failing on.
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[revalidate] skipped for ${label}:`, (error as Error).message)
    }
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ collection, doc }) => {
  revalidateSite(`${collection.slug}#${doc?.id ?? '?'}`)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ collection, doc }) => {
  revalidateSite(`${collection.slug} (deleted)`)
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ global, doc }) => {
  revalidateSite(global.slug)
  return doc
}

/** Spread into a collection config. */
export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}

/** Spread into a global config. */
export const revalidateGlobalHooks = {
  afterChange: [revalidateGlobalAfterChange],
}
