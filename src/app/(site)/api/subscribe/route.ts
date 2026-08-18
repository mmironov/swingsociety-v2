import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { isLocale } from '../../../../lib/i18n'

/**
 * Stores an email from the "tell me when the next course starts" form.
 *
 * A static route, so it takes precedence over Payload's `/api/[...slug]`
 * catch-all. Always answers 200 for an email we already hold — re-submitting
 * should look like success to the visitor, not an error.
 */
export const POST = async (request: Request) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { email, locale, source } = (body ?? {}) as Record<string, unknown>

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }
  const address = email.trim().toLowerCase()
  if (address.length > 254) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }

  try {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: address } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    await payload.create({
      collection: 'subscribers',
      data: {
        email: address,
        locale: isLocale(locale) ? locale : 'bg',
        source: typeof source === 'string' ? source.slice(0, 200) : undefined,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[subscribe] failed to store address', error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
