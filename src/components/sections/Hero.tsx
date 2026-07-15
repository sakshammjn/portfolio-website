import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { profile, marqueeTop, marqueeBottom } from '@/data/content'
import { easeOut } from '@/lib/motion'
import { SkillMarquee } from '@/components/effects/SkillMarquee'
import { FlipText } from '@/components/effects/FlipText'

/**
 * Chapter 00 — the opening. A hard horizontal split: the name fills the top
 * half, "PORTFOLIO" the bottom. The two halves invert each other using the
 * theme's own ink/fg tokens, so the contrast holds in both dark and light
 * mode. A tilted, faded skill band drifts behind each half.
 *
 * Scrolling splits the page at the seam: the section owns one extra viewport
 * of runway (h-[200svh] with -mb-[100svh], so total page length is unchanged)
 * during which the opening stays pinned while the ink half slides up and the
 * paper half slides down, and chapter 01 rides up through the widening gap.
 * Scrubbed 1:1 with scroll — reversible, no timers. Reduced motion keeps the
 * plain one-viewport hero with no pin and no split.
 */
export function Hero() {
  const prefersReduced = useReducedMotion()
  const split = !prefersReduced

  const sectionRef = useRef<HTMLElement>(null)
  // 0 at the top of the page, 1 when the runway is spent (section bottom
  // meets viewport bottom) — exactly one viewport of scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  // Complete the split by 75% of the runway, not 100%: chapters carry
  // scroll-mt-24, so palette/anchor jumps to #experience land one
  // scroll-margin short of the runway's end — finishing early keeps those
  // landings from showing a stranded sliver of each half. 0.75 clears the
  // 6rem margin even on short landscape viewports.
  const topY = useTransform(scrollYProgress, [0, 0.75], ['0%', '-100%'])
  const bottomY = useTransform(scrollYProgress, [0, 0.75], ['0%', '100%'])

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
      ref={sectionRef}
      id="intro"
      aria-label="Introduction"
      className={
        split
          ? // pointer-events-none so the tall (200lvh) box, which overlaps the
            // next section via the negative margin, doesn't intercept clicks on
            // it; the interactive halves below re-enable pointer events.
            'pointer-events-none relative -mb-[100lvh] h-[200lvh]'
          : 'pointer-events-none relative flex min-h-[100svh] flex-col'
      }
    >
      {/* Pinned viewport for the split. overflow-hidden clips the departed
          halves so they can't paint over chapter 01 once the pin releases;
          pointer-events pass through the gap to the content behind. Sized in
          lvh (not svh) so it still covers the screen on mobile once the URL
          bar collapses — svh left a strip of ground showing below the seam —
          and not dvh, which would resize the document mid-scroll and shift
          every scroll-linked animation further down the page. */}
      <div
        className={
          split
            ? 'pointer-events-none sticky top-0 z-10 flex h-lvh flex-col overflow-hidden'
            : 'contents'
        }
      >
        {/* Top half — name, on the ink surface; sits low, hugging the seam. The
            shared max-w wrapper is what makes the name and PORTFOLIO equal width. */}
        <motion.div
          style={split ? { y: topY } : undefined}
          className="pointer-events-auto relative flex flex-1 items-end justify-center overflow-hidden bg-ink px-6 pb-2 text-fg sm:pb-3"
        >
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
        </motion.div>

        {/* Bottom half — the single word, hugging the seam from below. */}
        <motion.div
          style={split ? { y: bottomY } : undefined}
          className="pointer-events-auto relative flex flex-1 items-start justify-center overflow-hidden bg-fg px-6 pt-2 text-ink sm:pt-3"
        >
          <motion.div {...rise(0.3)} className="relative z-10 mx-auto w-full max-w-5xl">
            <FlipText
              label="Portfolio"
              direction="right"
              segments={[{ text: 'portfolio' }]}
            />
            
          </motion.div>
          {band(marqueeBottom, -1, '✦', 'bottom-[30%]', '-rotate-[4deg]')}
        </motion.div>
      </div>
    </section>
  )
}
