import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { Critter, CRITTER_W } from '@/components/effects/Critter'

/**
 * Peek-a-boo: every so often the critter's head pokes up over a chapter's
 * hairline rule while you read, glancing around — and the instant your cursor
 * comes near, it ducks straight back down. Blink and you miss it.
 *
 * A fixed strip is pinned just above a chapter rule that's sitting in the
 * comfortable middle of the viewport, clipped so only the head shows above
 * the line; it tracks the rule as you scroll and retreats if the rule leaves
 * the sweet spot. Rare and self-cancelling — never while the cursor is close.
 * Skipped under reduced motion.
 */

// Chapter rules with room above them (the six numbered chapters).
const CHAPTER_IDS = [
  'experience',
  'opensource',
  'projects',
  'global',
  'achievements',
  'education',
]

const PEEK_H = 24 // px of head shown above the rule
const DUCK_DIST = 150 // cursor proximity (px) that scares it back down
const FIRST_DELAY = 16_000
const GAP_MIN = 26_000
const GAP_MAX = 55_000

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

type Phase = 'hidden' | 'up' | 'ducking'

export function PeekABoo() {
  const prefersReduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('hidden')
  const [scared, setScared] = useState(false)
  const left = useMotionValue(0)
  const top = useMotionValue(0)
  const section = useRef<HTMLElement | null>(null)
  const timers = useRef<number[]>([])
  // Mirror phase into a ref so the scroll/move listeners read the live value
  // without re-subscribing on every transition.
  const phaseRef = useRef<Phase>('hidden')
  phaseRef.current = phase

  useEffect(() => {
    if (prefersReduced) return

    const clear = () => timers.current.forEach(window.clearTimeout)
    const push = (ms: number, fn: () => void) =>
      timers.current.push(window.setTimeout(fn, ms))

    // A rule is a good target if it sits in the middle band of the viewport
    // (room above the line, comfortably on screen) and the cursor is far.
    const pickTarget = (): HTMLElement | null => {
      const lo = window.innerHeight * 0.3
      const hi = window.innerHeight * 0.75
      const candidates = CHAPTER_IDS.map((id) =>
        document.getElementById(id),
      ).filter((el): el is HTMLElement => {
        if (!el) return false
        const t = el.getBoundingClientRect().top
        return t > lo && t < hi
      })
      return candidates.length
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : null
    }

    const place = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      // Somewhere along the rule, biased to the content column, kept on-screen.
      const x = Math.max(
        24,
        Math.min(vw - CRITTER_W - 24, vw / 2 + rand(-360, 360)),
      )
      left.set(x)
      top.set(rect.top - PEEK_H)
    }

    const retreat = () => {
      setPhase('hidden')
      section.current = null
      schedule()
    }

    const tryPeek = () => {
      if (document.hidden) return schedule()
      const el = pickTarget()
      if (!el) return schedule(rand(6000, 12000)) // nothing suitable; check back
      section.current = el
      place(el)
      setScared(false)
      setPhase('up')
      // Stay up a beat, then duck on its own.
      push(rand(2200, 3600), () => {
        setPhase((p) => (p === 'up' ? 'ducking' : p))
        push(600, retreat)
      })
    }

    const schedule = (ms = rand(GAP_MIN, GAP_MAX)) => push(ms, tryPeek)

    // Follow the rule while peeking; bail if it drifts out of the sweet spot.
    const onScroll = () => {
      const el = section.current
      if (!el || phaseRef.current === 'hidden') return
      const t = el.getBoundingClientRect().top
      if (t < window.innerHeight * 0.15 || t > window.innerHeight * 0.9) {
        setPhase('ducking')
        push(600, retreat)
      } else {
        top.set(t - PEEK_H)
      }
    }

    // Cursor near the poked-up head → it bolts back down.
    const onMove = (e: MouseEvent) => {
      if (phaseRef.current !== 'up') return
      const cx = left.get() + CRITTER_W / 2
      const cy = top.get() + PEEK_H / 2
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < DUCK_DIST) {
        setScared(true)
        setPhase('ducking')
        push(500, retreat)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    schedule(FIRST_DELAY)

    return () => {
      clear()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced])

  if (prefersReduced || phase === 'hidden') return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[55] overflow-hidden"
      style={{ left, top, width: CRITTER_W, height: PEEK_H }}
    >
      <motion.div
        initial={{ y: PEEK_H }}
        animate={{ y: phase === 'up' ? 2 : PEEK_H }}
        transition={
          phase === 'up'
            ? { type: 'spring', stiffness: 320, damping: 22 }
            : { duration: 0.22, ease: 'easeIn' } // a quick duck
        }
      >
        <Critter
          eyes={scared ? 'squint' : 'open'}
          gaze={!scared}
          blink
        />
      </motion.div>
    </motion.div>
  )
}
