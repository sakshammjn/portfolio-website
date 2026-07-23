import { useEffect, useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { WARDROBE, type WardrobeKey } from '@/components/effects/wardrobe'

/**
 * The pixel critter — the site's ember mascot, as a pure visual.
 *
 * One 4px-grid body (44×36) drawn from square rects, accent-token fill, eyes
 * cut out in ink so they read as holes to the page ground in both themes.
 * Everything else is controlled by props so the same creature can pace the
 * footer, watch the ⌘K list, or hold a sign:
 *
 *  - `eyes`     open pixels · > < squint · wide startled saucers
 *  - `gaze`     pupils drift toward the visitor's cursor (springy, ±2.5px)
 *  - `look`     manual pupil offset (px) — e.g. the palette pet watching rows
 *  - `walking`  alternating leg steps + a subtle body bob
 *  - `pace`     amble vs the panicked dash · `lean` tilt into travel
 *  - `blink`    ambient blink every few seconds
 *  - `prop`     a pixel accessory on the crown for special days
 *
 * All motion honours prefers-reduced-motion (gaze/walk/blink freeze).
 */

const U = 4 // px per grid unit — the body is 11×9 units
export const CRITTER_W = 11 * U
export const CRITTER_H = 9 * U

/** Static silhouette (crown, body, ears) as [x, y, w, h] in grid units. */
const SHELL: Array<[number, number, number, number]> = [
  [2, 0, 7, 1],
  [1, 1, 9, 6],
  [0, 3, 1, 2],
  [10, 3, 1, 2],
]

export interface CritterProps {
  /** Rendered width in px; height follows the 44:36 body ratio. */
  size?: number
  /** open pixels · > < squint · startled saucers (grab/fear). */
  eyes?: 'open' | 'squint' | 'wide'
  gaze?: boolean
  look?: { x: number; y: number }
  walking?: boolean
  /** Step cadence — 'dash' is the panicked scurry. */
  pace?: 'amble' | 'dash'
  /** Lean (degrees) into the direction of travel; positive leans right. */
  lean?: number
  blink?: boolean
  /** A little something worn/carried on special days (see wardrobe.tsx). */
  prop?: WardrobeKey | null
  className?: string
}

export function Critter({
  size = CRITTER_W,
  eyes = 'open',
  gaze = false,
  look,
  walking = false,
  pace = 'amble',
  lean = 0,
  blink = false,
  prop = null,
  className,
}: CritterProps) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  // Every critter blinks on its own rhythm — identical intervals across a
  // many critters at once would read as animatronics.
  const blinkDelay = useRef(2.6 + Math.random() * 1.8)

  // Pupil drift — springs so the eyes glide rather than snap.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 160, damping: 18 })
  const sy = useSpring(py, { stiffness: 160, damping: 18 })

  useEffect(() => {
    if (look) {
      px.set(look.x)
      py.set(look.y)
    }
  }, [look, px, py])

  useEffect(() => {
    if (!gaze || look || prefersReduced) return
    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      // Saturates ~80px out: the critter mostly cares about direction.
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      px.set(Math.max(-1, Math.min(1, dx / 80)) * 2.5)
      py.set(Math.max(-1, Math.min(1, dy / 80)) * 2)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [gaze, look, prefersReduced, px, py])

  const stepping = walking && !prefersReduced
  // One footfall per STEP; the dash is a panicked scurry.
  const STEP = pace === 'dash' ? 0.16 : 0.34
  const step = (delay: number) =>
    stepping
      ? {
          animate: { y: [0, -3, 0] },
          transition: {
            duration: STEP,
            repeat: Infinity,
            // Lift fast, hang, land — reads as a step instead of a vibration.
            ease: 'easeOut' as const,
            times: [0, 0.45, 1],
            delay,
          },
        }
      : { animate: { y: 0 } }

  return (
    <motion.svg
      ref={ref}
      width={size}
      height={(size * CRITTER_H) / CRITTER_W}
      viewBox={`0 0 ${CRITTER_W} ${CRITTER_H}`}
      overflow="visible"
      aria-hidden
      className={className}
      shapeRendering="crispEdges"
      // Lean into the direction of travel, pivoting on the feet.
      animate={{ rotate: prefersReduced ? 0 : lean }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* Everything but the legs waddles: a bounce on each footfall plus a
          side-to-side rock across the two-step cycle. */}
      <motion.g
        animate={
          stepping
            ? { y: [0, -1.2, 0, -1.2, 0], rotate: [-1.5, 1.5, -1.5] }
            : { y: 0, rotate: 0 }
        }
        transition={
          stepping
            ? { duration: STEP * 2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      >
        <g className="fill-accent">
          {SHELL.map(([x, y, w, h], i) => (
            <rect key={i} x={x * U} y={y * U} width={w * U} height={h * U} />
          ))}
        </g>

        {eyes === 'squint' ? (
          <g
            className="stroke-ink"
            strokeWidth={3}
            fill="none"
            strokeLinecap="square"
          >
            <path d="M 13 11 L 18 15 L 13 19" />
            <path d="M 31 11 L 26 15 L 31 19" />
          </g>
        ) : (
          <motion.g style={{ x: sx, y: sy }}>
            <motion.g
              className="fill-ink"
              animate={
                blink && !prefersReduced ? { scaleY: [1, 0.15, 1] } : undefined
              }
              transition={{
                duration: 0.22,
                repeat: Infinity,
                repeatDelay: blinkDelay.current,
                delay: 1.5,
              }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              {eyes === 'wide' ? (
                <>
                  {/* Startled saucers — bigger, rounder pupils. */}
                  <rect x={12} y={9} width={6} height={12} rx={1} />
                  <rect x={26} y={9} width={6} height={12} rx={1} />
                </>
              ) : (
                <>
                  <rect x={13} y={10} width={4} height={10} />
                  <rect x={27} y={10} width={4} height={10} />
                </>
              )}
            </motion.g>
          </motion.g>
        )}

        {/* The day's wardrobe piece — drawn after the eyes so masks, shades
            and the halloween sheet can sit over the face. */}
        {prop && WARDROBE[prop]}
      </motion.g>

      {/* Legs — alternate steps while walking. */}
      <motion.g className="fill-accent" {...step(0)}>
        <rect x={2 * U} y={7 * U} width={2 * U} height={2 * U} />
      </motion.g>
      <motion.g className="fill-accent" {...step(STEP / 2)}>
        <rect x={7 * U} y={7 * U} width={2 * U} height={2 * U} />
      </motion.g>
    </motion.svg>
  )
}

/** The placard the critter holds up — mono text on a hairline card + stick. */
export function Sign({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="whitespace-nowrap border border-line bg-surface px-2.5 py-1 font-mono text-[11px] lowercase tracking-wide text-fg">
        {children}
      </div>
      <div className="h-2.5 w-0.5 bg-fg-faint" />
    </div>
  )
}
