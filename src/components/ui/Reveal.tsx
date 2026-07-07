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
  className?: string
  as?: 'div' | 'li' | 'span'
}

/**
 * Scroll-scrubbed entrance: the block fades and lifts in direct proportion
 * to scroll position as it crosses the bottom ~15% of the viewport. Scroll
 * slowly and it arrives slowly; scroll back and it retreats — no timers,
 * no one-shot triggers, the visitor's hand drives every frame.
 *
 * The window ends at 85% of the viewport so content is always fully solid
 * by reading height, and anything above the fold on load starts complete.
 * Fully disabled (renders statically) when the user prefers reduced motion.
 */
export function Reveal({ children, y = 24, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 1', 'start 0.85'],
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
