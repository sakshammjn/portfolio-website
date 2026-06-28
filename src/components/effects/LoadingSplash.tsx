import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { easeOut } from '@/lib/motion'

/**
 * First-paint splash that echoes the landing page: the monogram framed in
 * ember braces in the hero's Clash Display face and a thin accent load bar —
 * then the whole overlay dissolves to reveal the page.
 *
 * Shows once per browser session and is skipped under reduced-motion.
 */

/** Greetings in the languages Saksham actually speaks — cycled fast, once. */
const GREETINGS = ['Hello', 'नमस्ते', 'Bonjour', 'Привет']

export function LoadingSplash() {
  const prefersReduced = useReducedMotion()
  // Steps through GREETINGS once and holds on the last word.
  const [greetIndex, setGreetIndex] = useState(0)
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem('splashShown') !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (prefersReduced) {
      setVisible(false)
      try {
        sessionStorage.setItem('splashShown', '1')
      } catch {
        /* ignore */
      }
      return
    }
    if (!visible) return

    // load bar (~1.4s) + a short hold before the dissolve
    const timer = window.setTimeout(() => setVisible(false), 1900)
    try {
      sessionStorage.setItem('splashShown', '1')
    } catch {
      /* ignore */
    }
    return () => window.clearTimeout(timer)
  }, [visible, prefersReduced])

  // Advance the greeting every ~380ms, stopping on the final language.
  useEffect(() => {
    if (prefersReduced || !visible) return
    const id = window.setInterval(() => {
      setGreetIndex((i) => {
        if (i >= GREETINGS.length - 1) {
          window.clearInterval(id)
          return i
        }
        return i + 1
      })
    }, 380)
    return () => window.clearInterval(id)
  }, [visible, prefersReduced])

  if (prefersReduced) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >


          {/* Monogram framed in braces — the hero motif. */}
          <div className="relative flex items-center font-hero text-6xl font-bold uppercase tracking-tight text-fg sm:text-8xl">
            <motion.span
              className="text-accent"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              {'{'}
            </motion.span>
            <motion.span
              className="mx-3 sm:mx-5"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            >
              SM
            </motion.span>
            <motion.span
              className="text-accent"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              {'}'}
            </motion.span>
          </div>
          {/* Greeting cycle in the languages Saksham speaks — fades to the monogram. */}
          <div className="mb-10 flex h-12 items-center sm:h-16">
            <AnimatePresence mode="wait">
              <motion.span
                key={greetIndex}
                className="font-hero text-4xl font-bold tracking-tight text-fg sm:text-6xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                {GREETINGS[greetIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          {/* Thin ember load bar. */}
          <div className="mt-12 h-[2px] w-44 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease: easeOut }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
