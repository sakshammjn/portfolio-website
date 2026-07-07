import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion'

interface SkillMarqueeProps {
  skills: string[]
  /** Idle drift direction: +1 drifts right, -1 drifts left. */
  baseDirection?: 1 | -1
  /** Glyph placed between each skill. */
  separator?: string
  /** Soft-fade the left/right edges. Off when the band bleeds off-screen. */
  edgeFade?: boolean
  className?: string
}

/** Gentle constant drift, in % of one row per second. Matches the previous
 *  CSS animation (50% travel over ~64s ≈ 0.78%/s). */
const BASE_VELOCITY = 0.78

/** Keep a value inside [min, max) so the duplicated track loops seamlessly. */
function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * An edge-faded band of skills that drifts on its own but responds to scroll:
 * scrolling down nudges it left→right, scrolling up right→left, and faster
 * scrolling speeds it up. The track is duplicated so the loop is seamless;
 * honours prefers-reduced-motion by holding still.
 */
export function SkillMarquee({
  skills,
  baseDirection = -1,
  separator = '✦',
  edgeFade = true,
  className = '',
}: SkillMarqueeProps) {
  const prefersReduced = useReducedMotion()

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 250,
  })
  // Map scroll speed to a multiplier, clamped so hard flicks can't lurch the
  // track — ±5× the idle drift is the ceiling.
  const velocityFactor = useTransform(smoothVelocity, [-1000, 1000], [-5, 5])

  // baseX walks freely; wrap() folds it into one row's width as a %.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  /** Seconds for the track's velocity to relax toward its target — the
   *  "mass" of the flywheel. Reversals sweep through zero over ~this long. */
  const DRIFT_TAU = 0.5

  const dirRef = useRef<number>(baseDirection)
  const speedRef = useRef<number>(baseDirection * BASE_VELOCITY)
  useAnimationFrame((_t, delta) => {
    if (prefersReduced) return
    const dt = delta / 1000
    const vf = velocityFactor.get()

    // Remember the last scroll direction. The idle drift keeps flowing the
    // same way, so releasing the scroll never reverses the band — it just
    // decays back to cruise speed. Direction only changes when the visitor's
    // scroll direction does.
    if (vf > 0.1) dirRef.current = 1
    else if (vf < -0.1) dirRef.current = -1

    // One continuous velocity easing toward its target: idle drift in the
    // remembered direction, boosted by scroll speed. A reversal is just the
    // target flipping sign — the actual velocity glides through zero.
    const target = (dirRef.current + vf) * BASE_VELOCITY
    speedRef.current +=
      (target - speedRef.current) * (1 - Math.exp(-dt / DRIFT_TAU))
    baseX.set(baseX.get() + speedRef.current * dt)
  })

  const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <ul
      aria-hidden={ariaHidden}
      // Colour is inherited from the parent half so the band stays tone-on-tone.
      className="flex shrink-0 items-center font-hero text-4xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl"
    >
      {skills.map((skill) => (
        <li key={skill} className="flex items-center whitespace-nowrap">
          <span>{skill}</span>
          <span aria-hidden className="mx-6 text-accent sm:mx-10">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={[
        'relative flex w-full overflow-hidden',
        edgeFade ? 'marquee-mask' : '',
        className,
      ].join(' ')}
      aria-label="Technologies I work with"
    >
      <motion.div className="flex w-max" style={{ x }}>
        <Row />
        <Row ariaHidden />
      </motion.div>
    </div>
  )
}
