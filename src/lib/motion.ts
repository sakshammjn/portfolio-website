import type { Variants } from 'framer-motion'

/** Shared easing — a gentle, premium ease-out. */
export const easeOut = [0.22, 1, 0.36, 1] as const

/** Fade + rise, used by the <Reveal> wrapper. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}

/** Stagger container for lists of cards. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}
