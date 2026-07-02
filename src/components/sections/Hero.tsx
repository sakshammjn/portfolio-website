import { motion, useReducedMotion } from 'framer-motion'
import { profile, marqueeTop, marqueeBottom } from '@/data/content'
import { easeOut } from '@/lib/motion'
import { SkillMarquee } from '@/components/effects/SkillMarquee'
import { FlipText } from '@/components/effects/FlipText'

/**
 * Chapter 00 — the opening. A hard horizontal split: the name fills the top
 * half, "PORTFOLIO" the bottom. The two halves invert each other using the
 * theme's own ink/fg tokens, so the contrast holds in both dark and light
 * mode. A tilted, faded skill band drifts behind each half.
 */
export function Hero() {
  const prefersReduced = useReducedMotion()

  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: easeOut },
        }

  // Faded tone-on-tone band, tilted across its half. Rotation/centring live on
  // a static wrapper so framer's opacity tween can't clobber the transform.
  const band = (
    skills: string[],
    baseDirection: 1 | -1,
    separator: string,
    position: string,
    rotation: string,
  ) => (
    <div
      className={`pointer-events-none absolute left-1/2 w-[106%] -translate-x-1/2 ${rotation} ${position}`}
    >
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0 }}
        animate={prefersReduced ? undefined : { opacity: 0.16 }}
        transition={{ duration: 1.2, delay: 0.4, ease: easeOut }}
        className={prefersReduced ? 'opacity-[0.16]' : undefined}
      >
        <SkillMarquee
          skills={skills}
          baseDirection={baseDirection}
          separator={separator}
        />
      </motion.div>
    </div>
  )

  return (
    <section
      id="intro"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col"
    >
      {/* Top half — name, on the ink surface; sits low, hugging the seam. The
          shared max-w wrapper is what makes the name and PORTFOLIO equal width. */}
      <div className="relative flex flex-1 items-end justify-center overflow-hidden bg-ink px-6 pb-2 text-fg sm:pb-3">
        {band(marqueeTop, -1, '✧', 'top-[30%]', 'rotate-[4deg]')}
        <motion.h1 {...rise(0.15)} className="relative z-10 mx-auto w-full max-w-5xl">
          {/* Full name as real text for search engines + screen readers; the
              styled wordmark below is decorative. */}
          <span className="sr-only">Saksham Mahajan — Software Engineer</span>
          <span aria-hidden>
            <FlipText
              label={profile.name}
              segments={[
                { text: '{ ', accent: true },
                { text: profile.name },
                { text: ' }', accent: true },
              ]}
            />
          </span>
        </motion.h1>
      </div>

      {/* Bottom half — the single word, hugging the seam from below. */}
      <div className="relative flex flex-1 items-start justify-center overflow-hidden bg-fg px-6 pt-2 text-ink sm:pt-3">
        <motion.div {...rise(0.3)} className="relative z-10 mx-auto w-full max-w-5xl">
          <FlipText
            label="Portfolio"
            direction="right"
            segments={[{ text: 'portfolio' }]}
          />
        </motion.div>
        {band(marqueeBottom, -1, '✦', 'bottom-[30%]', '-rotate-[4deg]')}
      </div>
    </section>
  )
}
