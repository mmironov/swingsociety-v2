import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { isLocale } from '../../../../lib/i18n'

/** Bodies are a short JSON object; anything larger is not a real submission. */
const MAX_BODY_BYTES = 2_000

/**
 * Generous on purpose. One person subscribes once, so any limit stops a script —
 * but the key is an IP, and a dance studio's wifi or a mobile carrier's NAT puts
 * many real people behind one. Too tight and the second genuine person of the
 * evening is turned away, which costs more than the abuse it prevents.
 *
 * Rejected requests count too (bad email, oversized body): they are equally cheap
 * to generate in a flood.
 */
const RATE_LIMIT = { max: 10, windowMs: 10 * 60 * 1000 }

/**
 * Best-effort rate limiting, in memory.
 *
 * Each serverless instance keeps its own counters, so this is a speed bump rather
 * than a guarantee — a distributed attacker spread across instances gets more than
 * `max`. It is still worth having: it stops the trivial case of one script hammering
 * one endpoint, which is the realistic threat for a dance school's mailing list.
 * A real limit would need shared state (Vercel KV, Upstash); not worth the
 * dependency until this list is worth attacking.
 *
 * Addresses are used as an in-memory key only and never stored — the Subscribers
 * collection holds no IPs.
 */
const hits = new Map<string, number[]>()

const rateLimited = (key: string): boolean => {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs)

  // Opportunistic cleanup: without it the map grows for the life of the instance.
  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.every((at) => now - at >= RATE_LIMIT.windowMs)) hits.delete(k)
    }
  }

  if (recent.length >= RATE_LIMIT.max) {
    hits.set(key, recent)
    return true
  }
  recent.push(now)
  hits.set(key, recent)
  return false
}

const clientKey = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip')?.trim() ||
  'unknown'

/**
 * Rejects a cross-site POST. Browsers set Origin on any fetch POST, so a mismatch
 * means the request did not come from our own pages. A missing Origin is allowed
 * through to the rate limiter rather than blocked: scripted clients simply omit or
 * forge it, so treating absence as hostile would buy nothing while risking a
 * proxy that strips the header.
 */
const wrongOrigin = (request: Request): boolean => {
  const expected = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  const origin = request.headers.get('origin')
  if (!expected || !origin) return false
  try {
    return new URL(origin).origin !== new URL(expected).origin
  } catch {
    return true
  }
}

/**
 * Stores an email from the "tell me when the next course starts" form.
 *
 * A static route, so it takes precedence over Payload's `/api/[...slug]`
 * catch-all. Always answers 200 for an email we already hold — re-submitting
 * should look like success to the visitor, not an error.
 */
export const POST = async (request: Request) => {
  if (wrongOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(RATE_LIMIT.windowMs / 1000) } },
    )
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { email, locale, source, website } = (body ?? {}) as Record<string, unknown>

  // Honeypot: a field hidden from people but visible to a form-filling bot.
  // Answer as though it worked — telling a bot it was detected only invites a
  // second attempt with the field left blank.
  if (typeof website === 'string' && website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

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
