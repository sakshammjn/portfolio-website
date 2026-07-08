import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface ChapterProps {
  id: string
  /** Two-digit chapter index, e.g. "01". */
  index: string
  /** Short section name, set big and uppercase. */
  label: string
  /** Optional supporting line beneath the title. */
  lede?: string
  children: ReactNode
}

/**
 * A full-width chapter that opens in the hero's voice: a `{ NN }` brace-wrapped
 * index beside a big uppercase Clash Display label, with a hairline rule
 * separating it from the chapter above.
 *
 * The opener performs for the hand: the ember braces start slightly apart
 * and clamp onto the index while the number prints in, scrubbed 1:1 by
 * scroll as the header crosses the lower half of the viewport — scroll back
 * and the mark unlocks again. Transform/opacity only, so nothing reflows.
 */
export function Chapter({ id, index, label, lede, children }: ChapterProps) {
  const headerRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start 0.98', 'start 0.45'],
  })
  const braceL = useTransform(scrollYProgress, [0, 1], [-18, 0])
  const braceR = useTransform(scrollYProgress, [0, 1], [18, 0])
  const numberOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 1])

  return (
    <section
      id={id}
      aria-label={label}
      className="scroll-mt-24 border-t border-line px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <header ref={headerRef} className="mb-12 sm:mb-16">
          <Reveal>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-hero text-[clamp(2.75rem,12vw,4.5rem)] font-bold leading-none tracking-tight">
                {prefersReduced ? (
                  <>
                    <span className="text-accent">{'{'}</span>
                    <span className="px-1.5 text-fg-faint sm:px-2.5">{index}</span>
                    <span className="text-accent">{'}'}</span>
                  </>
                ) : (
                  <>
                    <motion.span
                      className="inline-block text-accent"
                      style={{ x: braceL }}
                    >
                      {'{'}
                    </motion.span>
                    <motion.span
                      className="px-1.5 text-fg-faint sm:px-2.5"
                      style={{ opacity: numberOpacity }}
                    >
                      {index}
                    </motion.span>
                    <motion.span
                      className="inline-block text-accent"
                      style={{ x: braceR }}
                    >
                      {'}'}
                    </motion.span>
                  </>
                )}
              </span>
              <h2 className="font-hero text-[clamp(1.85rem,9vw,3.75rem)] font-bold uppercase leading-none tracking-tight text-fg">
                {label}
              </h2>
            </div>
          </Reveal>
          {lede && (
            <Reveal delay={0.06}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
                {lede}
              </p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
