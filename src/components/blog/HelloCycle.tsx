import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { easeOut } from '@/lib/motion'
import { greetings } from '@/data/content'

/**
 * The loading splash, replayed inside the post that explains it: the hellos
 * cycle between ember braces, with the languages listed underneath as quiet
 * mono buttons — the current one lit, any one clickable. The loop runs only
 * while the figure is on screen and pauses under the cursor, so a reader can
 * linger on a word. Reduced motion: all four words, side by side, still.
 */

const STEP_MS = 1500

export function HelloCycle() {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [onScreen, setOnScreen] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // One step per timeout, re-armed on every change, so a click on a
  // language restarts the clock instead of skipping ahead early.
  useEffect(() => {
    if (prefersReduced || !onScreen || hovered) return
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % greetings.length),
      STEP_MS,
    )
    return () => window.clearTimeout(id)
  }, [prefersReduced, onScreen, hovered, index])

  const current = greetings[index]

  return (
    <figure
      ref={ref}
      className="my-10 border-y border-line py-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="sr-only">
        {greetings.map((g) => `${g.word} (${g.language})`).join(', ')}
      </p>

      {prefersReduced ? (
        <div
          aria-hidden
          className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-3 font-hero text-3xl font-bold tracking-tight text-fg sm:text-4xl"
        >
          {greetings.map((g) => (
            <span key={g.lang} lang={g.lang}>
              {g.word}
            </span>
          ))}
        </div>
      ) : (
        <div
          aria-hidden
          className="flex items-center justify-center font-hero text-4xl font-bold tracking-tight text-fg sm:text-6xl"
        >
          <span className="text-accent">{'{'}</span>
          {/* Fixed width so the braces hold still while words change size. */}
          <span className="relative mx-2 inline-flex h-[1.4em] w-[4.4em] items-center justify-center sm:mx-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={index}
                lang={current.lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                {current.word}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-accent">{'}'}</span>
        </div>
      )}

      <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-x-2 font-mono text-[11px] lowercase tracking-[0.15em]">
        {greetings.map((g, i) => (
          <span key={g.lang} className="inline-flex items-center gap-x-2">
            {i > 0 && (
              <span aria-hidden className="text-fg-faint">
                ·
              </span>
            )}
            {prefersReduced ? (
              <span className="text-fg-faint">{g.language}</span>
            ) : (
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={`transition-colors hover:text-accent ${
                  i === index ? 'text-accent' : 'text-fg-faint'
                }`}
              >
                {g.language}
              </button>
            )}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
