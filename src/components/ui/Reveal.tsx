import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeOut } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  /** Delay in seconds before the reveal starts. */
  delay?: number
  /** Vertical travel distance in px. */
  y?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}

/**
 * Fades and lifts its children into view once, when scrolled into the viewport.
 * Fully disabled (renders statically) when the user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: RevealProps) {
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as]

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
    >
      {children}
    </MotionTag>
  )
}
