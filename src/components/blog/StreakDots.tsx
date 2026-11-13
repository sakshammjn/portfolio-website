import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

/**
 * A streak as one dot per day — the number made physical. Days sit in quiet
 * faint dots; the ember accent is spent only where the story is: the ring
 * around the one day that was missed (and bought back), and today's dot,
 * which breathes. The count and the grid fill together, scrubbed by scroll
 * like the site's Reveal: scroll on and the days pile up, scroll back and
 * they drain away.
 *
 * The fill is transform-only: the lit layer sits in a clipping frame that
 * slides down while the layer itself slides up by the same amount, so the
 * visible edge sweeps top to bottom without touching a single dot per frame.
 * Hovering (or touching) a dot names its day. Reduced motion: everything is
 * simply there, and today doesn't pulse.
 */

const COLS_WIDE = 75
const COLS_NARROW = 50 // phones: fewer, bigger dots, so the missed one still shows
const NARROW = '(max-width: 639px)' // below Tailwind's `sm`
const STEP = 8 // dot pitch, in svg units
const R = 2.75 // dot radius
const PAD = 8 // room for the ring and today's ping at the edges

function useNarrow() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(NARROW).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia?.(NARROW)
    if (!mq) return
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return narrow
}

export function StreakDots({ days, missed }: { days: number; missed?: number }) {
  const prefersReduced = useReducedMotion()
  const cols = useNarrow() ? COLS_NARROW : COLS_WIDE
  const ref = useRef<HTMLElement>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  const rows = Math.ceil(days / cols)
  const width = (cols - 1) * STEP + PAD * 2
  const height = (rows - 1) * STEP + PAD * 2
  const cx = (i: number) => PAD + (i % cols) * STEP
  const cy = (i: number) => PAD + Math.floor(i / cols) * STEP
  const missedIdx = missed && missed >= 1 && missed < days ? missed - 1 : -1
  const lastIdx = days - 1

  const { scrollYProgress } = useScroll({
    target: ref,
    // Complete by the time the grid's centre is just below mid-screen, so
    // the full count is showing while it's being looked at.
    offset: ['start 0.95', 'center 0.6'],
  })
  const frameY = useTransform(scrollYProgress, [0, 1], ['-100%', '0%'])
  const layerY = useTransform(scrollYProgress, [0, 1], ['100%', '0%'])
  const count = useTransform(scrollYProgress, (p) =>
    Math.round(Math.min(1, Math.max(0, p)) * days).toLocaleString('en-IN'),
  )

  const total = days.toLocaleString('en-IN')

  // One path per dot style keeps the DOM to a handful of nodes, not 1,700.
  const dots = (skip: number[]) => {
    let d = ''
    for (let i = 0; i < days; i++) {
      if (skip.includes(i)) continue
      const x = cx(i)
      const y = cy(i)
      d += `M${x - R} ${y}a${R} ${R} 0 1 0 ${R * 2} 0a${R} ${R} 0 1 0 ${-R * 2} 0`
    }
    return d
  }

  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    const box = plotRef.current?.getBoundingClientRect()
    if (!box) return
    const scale = box.width / width
    const col = Math.round(((e.clientX - box.left) / scale - PAD) / STEP)
    const row = Math.round(((e.clientY - box.top) / scale - PAD) / STEP)
    const i = row * cols + col
    setHover(col >= 0 && col < cols && row >= 0 && i < days ? i : null)
  }

  const label = (i: number) =>
    i === missedIdx
      ? `around day ${missed} · the midnight i forgot`
      : i === lastIdx
        ? `day ${total} · as i write this`
        : `day ${(i + 1).toLocaleString('en-IN')}`

  const lit = (
    <svg viewBox={`0 0 ${width} ${height}`} className="block w-full" aria-hidden>
      <path d={dots([missedIdx, lastIdx])} className="fill-fg-faint" />
      {missedIdx >= 0 && (
        <circle
          cx={cx(missedIdx)}
          cy={cy(missedIdx)}
          r={R + 0.6}
          className="fill-none stroke-accent"
          strokeWidth={1.2}
        />
      )}
      <circle
        cx={cx(lastIdx)}
        cy={cy(lastIdx)}
        r={R}
        className={`fill-accent ${prefersReduced ? '' : 'streak-ping'}`}
      />
      <circle cx={cx(lastIdx)} cy={cy(lastIdx)} r={R} className="fill-accent" />
    </svg>
  )

  return (
    <figure ref={ref} className="my-10 border-y border-line py-8">
      <p className="sr-only">
        {`A grid of ${total} dots, one for each day of my Duolingo streak. One dot, around day ${missed}, is an empty ring: the night I forgot.`}
      </p>

      <div aria-hidden className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="inline-block min-w-[4ch] font-hero text-4xl font-bold tracking-tight text-accent sm:text-5xl">
          {prefersReduced ? total : <motion.span>{count}</motion.span>}
        </span>
        <span className="font-mono text-[11px] lowercase tracking-[0.2em] text-fg-faint">
          days in a row
        </span>
      </div>

      <div
        ref={plotRef}
        aria-hidden
        className="relative touch-pan-y"
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={() => setHover(null)}
      >
        {/* Ground: every day as a hairline dot, so the shape is there first. */}
        <svg viewBox={`0 0 ${width} ${height}`} className="block w-full">
          <path d={dots([])} className="fill-line" />
        </svg>

        {/* The lit days, revealed by scroll (see the doc-block). */}
        {prefersReduced ? (
          <div className="absolute inset-0">{lit}</div>
        ) : (
          <motion.div className="absolute inset-0 overflow-hidden" style={{ y: frameY }}>
            <motion.div style={{ y: layerY }}>{lit}</motion.div>
          </motion.div>
        )}

        {hover !== null && (
          <>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="pointer-events-none absolute inset-0 block w-full"
            >
              <circle
                cx={cx(hover)}
                cy={cy(hover)}
                r={R + 1.6}
                className="fill-none stroke-fg"
                strokeWidth={1}
              />
            </svg>
            <span
              className={`pointer-events-none absolute z-10 -translate-y-full whitespace-nowrap border border-fg/10 bg-surface px-2 py-1 font-mono text-[10px] lowercase tracking-wider text-fg ${
                // Anchor toward the middle near the edges, so it stays on screen.
                hover % cols < cols * 0.2
                  ? '-translate-x-2'
                  : hover % cols > cols * 0.8
                    ? '-translate-x-[calc(100%-0.5rem)]'
                    : '-translate-x-1/2'
              }`}
              style={{
                left: `${(cx(hover) / width) * 100}%`,
                top: `calc(${(cy(hover) / height) * 100}% - 10px)`,
              }}
            >
              {label(hover)}
            </span>
          </>
        )}
      </div>

      <figcaption className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] lowercase tracking-[0.15em] text-fg-faint">
        <span>one dot per day</span>
        {missedIdx >= 0 && (
          <span className="inline-flex items-center gap-2">
            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden>
              <circle cx="5" cy="5" r="3.6" className="fill-none stroke-accent" strokeWidth={1.4} />
            </svg>
            around day {missed}, the one i missed
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden>
            <circle cx="5" cy="5" r="3.6" className="fill-accent" />
          </svg>
          day {total}
        </span>
      </figcaption>
    </figure>
  )
}
