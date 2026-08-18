'use client'

import { useState } from 'react'
import { type Locale, t } from '../../lib/i18n'

type Props = {
  locale: Locale
  heading?: string | null
  body?: string | null
  placeholder?: string | null
  buttonLabel?: string | null
  successMessage?: string | null
}

type State = 'idle' | 'sending' | 'done' | 'error' | 'invalid'

export const SubscribeForm = ({
  locale,
  heading,
  body,
  placeholder,
  buttonLabel,
  successMessage,
}: Props) => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  // Honeypot. Left empty by people, filled in by bots that complete every field.
  const [honeypot, setHoneypot] = useState('')

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    // Deliberately loose: the server validates properly, and this only needs to
    // catch an obvious typo before a round trip.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState('invalid')
      return
    }

    setState('sending')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, locale, source: window.location.pathname, website: honeypot }),
      })
      setState(response.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="panel panel--gradient">
        {heading ? <h3 className="panel__title panel__title--sm">{heading}</h3> : null}
        <p className="signup__note" role="status">
          {successMessage || 'Готово.'}
        </p>
      </div>
    )
  }

  return (
    <form className="panel panel--gradient" onSubmit={submit} noValidate>
      {heading ? <h3 className="panel__title panel__title--sm">{heading}</h3> : null}
      {body ? <p className="signup__body">{body}</p> : null}

      <label className="visually-hidden" htmlFor="subscribe-email">
        {t('emailLabel', locale)}
      </label>
      <input
        id="subscribe-email"
        className="input signup__input"
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder={placeholder ?? undefined}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (state === 'invalid' || state === 'error') setState('idle')
        }}
        aria-invalid={state === 'invalid'}
      />

      {/*
        Hidden from people in three ways at once, because any single one of them
        can be defeated: off-screen rather than display:none (some bots skip
        undisplayed inputs), aria-hidden so screen readers never announce it, and
        tabIndex -1 so keyboard users cannot land on it. autoComplete off keeps a
        password manager from helpfully filling it in.
      */}
      <div aria-hidden="true" className="visually-hidden">
        <label htmlFor="subscribe-website">Website</label>
        <input
          id="subscribe-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <button className="btn btn-primary signup__submit" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t('signupSending', locale) : buttonLabel || t('emailLabel', locale)}
      </button>

      {state === 'invalid' ? (
        <p className="signup__error" role="alert">
          {t('signupInvalid', locale)}
        </p>
      ) : null}
      {state === 'error' ? (
        <p className="signup__error" role="alert">
          {t('signupError', locale)}
        </p>
      ) : null}
    </form>
  )
}
