import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '@/data/content'
import { easeOut } from '@/lib/motion'

/**
 * Chapter 00 — the opening. A full-height, centred title card that sets the
 * editorial tone before the timeline begins.
 */
export function Hero() {
  const prefersReduced = useReducedMotion()

  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: easeOut },
        }

  return (
    <section
      id="intro"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.p {...rise(0.1)} className="eyebrow mb-6">
        00 — The Journey of
      </motion.p>

      <motion.h1
        {...rise(0.2)}
        className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-fg sm:text-7xl md:text-8xl"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        {...rise(0.35)}
        className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-accent sm:text-base"
      >
        {profile.role}
      </motion.p>

      <motion.p
        {...rise(0.5)}
        className="mt-8 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg"
      >
        {profile.intro}
      </motion.p>

      {/* Scroll cue */}
      <motion.a
        href="#education"
        aria-label="Begin the journey"
        {...rise(0.7)}
        className="group absolute bottom-10 flex flex-col items-center gap-2 text-fg-faint transition-colors hover:text-fg"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em]">
          Begin
        </span>
        <motion.span
          aria-hidden
          className="block h-8 w-px bg-gradient-to-b from-accent to-transparent"
          animate={prefersReduced ? undefined : { scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
      </motion.a>
    </section>
  )
}
