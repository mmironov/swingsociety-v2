'use client'

import { useEffect } from 'react'

/**
 * Drives the scroll-reveal animation for every `[data-reveal]` block.
 *
 * The subtle part is *when* blocks appear. This component lives in the locale
 * layout, which stays mounted across client-side navigation, and React commits
 * the incoming page's DOM after this effect has already run — measured at about
 * 250ms after pressing Back. So attaching on mount, or even on a pathname
 * change, observes nothing: the restored page's blocks arrive later, unobserved,
 * and keep the stylesheet's `opacity: 0`. That rendered the home page blank
 * until something remounted the layout, such as switching language.
 *
 * Watching the DOM rather than trying to predict it removes the timing question
 * entirely — blocks are attached whenever they appear, from any cause: a route
 * change, Back/Forward, or content streamed in late.
 *
 * Two backstops remain: `reveal-on` is only added once JS runs, so a visitor
 * without it sees everything; and an 8s timer reveals any block whose observer
 * never fires.
 */
export const Reveal = () => {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('reveal-on')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )

    let safety: number | undefined
    const armSafety = () => {
      // Don't push an already-pending deadline further out.
      if (safety !== undefined) return
      safety = window.setTimeout(() => {
        safety = undefined
        document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('in'))
      }, 8000)
    }

    const attach = () => {
      let pending = 0
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        // Already on screen — including where the browser has just restored a
        // scroll position. Show it rather than animating it in.
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in')
        } else {
          io.observe(el) // idempotent, so re-attaching costs nothing
          pending++
        }
      })
      if (pending > 0) armSafety()
    }

    attach()

    // Coalesced to one pass per frame: a navigation inserts many nodes at once.
    let frame = 0
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(attach)
    })
    // childList only — adding `.in` is an attribute change, so this cannot
    // retrigger itself.
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      cancelAnimationFrame(frame)
      if (safety !== undefined) window.clearTimeout(safety)
      io.disconnect()
      root.classList.remove('reveal-on')
    }
  }, [])

  return null
}
