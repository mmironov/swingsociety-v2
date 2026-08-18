'use client'

import { useEffect } from 'react'

/**
 * Drives the scroll-reveal animation for every `[data-reveal]` block.
 *
 * Two safeguards, both carried over from the design's own logic: the
 * `reveal-on` class is added only once JS is running, so nothing is hidden for
 * a visitor without it, and a timeout reveals everything unconditionally in
 * case an observer never fires.
 */
export const Reveal = () => {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('reveal-on')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )

    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => {
      const rect = el.getBoundingClientRect()
      // Already on screen at load: show it immediately rather than animating.
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('in')
      else observer.observe(el)
    })

    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('in'))
    }, 8000)

    return () => {
      window.clearTimeout(safety)
      observer.disconnect()
      root.classList.remove('reveal-on')
    }
  }, [])

  return null
}
