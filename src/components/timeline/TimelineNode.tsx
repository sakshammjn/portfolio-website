import { motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '@/lib/motion'

/**
 * A milestone marker sitting exactly on the spine. It "lights up" — filling
 * with the accent and emitting a soft glow — as it scrolls into view, so the
 * trail you've already travelled stays lit behind you.
 */
export function TimelineNode() {
  const prefersReduced = useReducedMotion()

  return (
    <span
      aria-hidden
      className="absolute left-7 top-1.5 z-10 -translate-x-1/2 lg:left-1/2"
    >
      <motion.span
        className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-ink"
        initial={prefersReduced ? false : { scale: 0.3, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-45% 0px -45% 0px' }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        {/* inner dot */}
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent"
          initial={prefersReduced ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-45% 0px -45% 0px' }}
          transition={{ duration: 0.4, delay: 0.1, ease: easeOut }}
        />
        {/* soft glow */}
        <span className="absolute inset-0 -z-10 rounded-full bg-accent/40 blur-md" />
      </motion.span>
    </span>
  )
}
