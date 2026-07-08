import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Unused since the scrub rewrite — kept so call sites don't churn.
   *  Stagger now comes free from document order: lower blocks enter later. */
  delay?: number
  /** Vertical travel distance in px. */
  y?: number
  /** Viewport fraction (of height, from the top) where the scrub completes.
   *  Default 0.7 = the block finishes arriving at 70% viewport height.
   *  Blocks near the page bottom need a larger value (e.g. 0.88) — they can
   *  never reach the upper viewport, so a long window would strand them
   *  half-faded at max scroll. */
  until?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}

/**
 * Scroll-scrubbed entrance: the block fades and lifts in direct proportion
 * to scroll position as it crosses the bottom ~15% of the viewport. Scroll
 * slowly and it arrives slowly; scroll back and it retreats — no timers,
 * no one-shot triggers, the visitor's hand drives every frame.
 *
 * The scrub spans from the viewport's bottom edge up to `until` (default
 * 70% of the viewport height), so the arrival is long enough to actually
 * watch; anything above the fold on load starts complete.
 * Fully disabled (renders statically) when the user prefers reduced motion.
 */
export function Reveal({
  children,
  y = 24,
  until = 0.7,
  className,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 1', `start ${until}`],
  })
  const yValue = useTransform(scrollYProgress, [0, 1], [y, 0])

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ opacity: scrollYProgress, y: yValue }}
    >
      {children}
    </MotionTag>
  )
}
