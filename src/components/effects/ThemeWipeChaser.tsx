import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Critter } from '@/components/effects/Critter'

/**
 * Theme-switch flourish: the moment the diagonal wipe finishes painting the
 * new palette, the critter comes tearing across the screen in the same
 * direction the wipe travelled — as if it just dragged the new colours in
 * behind it and is bolting off before anyone notices.
 *
 * Fires on the `theme-wipe` event dispatched by applyTheme (CommandPalette),
 * which carries the incoming theme; light-in wipes left→right, dark-in
 * right→left, so the sprint matches. Skipped under reduced motion (the wipe
 * itself is skipped there too).
 */

type Dir = 'ltr' | 'rtl'

export function ThemeWipeChaser() {
  const prefersReduced = useReducedMotion()
  const [run, setRun] = useState<{ id: number; dir: Dir } | null>(null)

  useEffect(() => {
    if (prefersReduced) return
    const onWipe = (e: Event) => {
      const to = (e as CustomEvent<{ to: 'light' | 'dark' }>).detail?.to
      // to light → wipe swept left→right; to dark → right→left.
      setRun({ id: Date.now(), dir: to === 'dark' ? 'rtl' : 'ltr' })
    }
    window.addEventListener('theme-wipe', onWipe)
    return () => window.removeEventListener('theme-wipe', onWipe)
  }, [prefersReduced])

  if (prefersReduced) return null

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 top-0 z-[78] overflow-hidden"
      style={{ visibility: run ? 'visible' : 'hidden' }}
    >
      <AnimatePresence>
        {run && (
          <motion.div
            key={run.id}
            className="absolute"
            style={{ top: '58%' }}
            initial={{ x: run.dir === 'ltr' ? -80 : vw + 80 }}
            animate={{ x: run.dir === 'ltr' ? vw + 80 : -80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.6, 1] }}
            onAnimationComplete={() => setRun(null)}
          >
            <Critter
              size={52}
              walking
              pace="dash"
              lean={run.dir === 'ltr' ? 14 : -14}
              eyes="wide"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
