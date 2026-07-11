import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import { easeOut } from '@/lib/motion'
import { getSeasonalDay, SEASONAL_DAYS, type SeasonalDay } from '@/lib/seasonal'
import { Critter, CRITTER_W, Sign } from '@/components/effects/Critter'

/**
 * The critter's home: pacing the footer's top hairline. Its whole personality
 * lives here, driven by one rAF state machine writing to motion values (no
 * per-frame React renders); it only runs while the footer is on screen.
 *
 *  - ambles back and forth, leaning into travel, blinking, eyes tracking you
 *  - hover → stops and stares until your cursor leaves
 *  - click → startle-hop, > < eyes, dashes off the nearest edge, sneaks back
 *  - idle 20s → sits down with a "zzz"; a scroll/key/tap startles it awake
 *  - drag it → legs paddle, eyes go wide; drop it and it plummets, lands with
 *    a squash, shakes off the indignity and storms away
 *  - on special days it wears/carries the day's pixel prop (lib/seasonal +
 *    wardrobe.tsx), and hovering raises a sign naming the day — most of them
 *    are obscure, so the sign is the reveal
 *
 * Reduced motion falls back to a still critter that squints when clicked.
 */

type Mode =
  | 'walk'
  | 'pause'
  | 'sleep'
  | 'flee'
  | 'gone'
  | 'held'
  | 'falling'

const WALK_SPEED = 26 // px/s — an amble
const FLEE_SPEED = 320 // px/s — a panic
const OFFSTAGE = 80 // px past the edge before it counts as gone
const RETURN_AFTER = 7000 // ms of sulking before it sneaks back
const IDLE_SLEEP = 20_000 // ms of no input before it dozes off
const STARE = Number.MAX_SAFE_INTEGER // hover-pause sentinel

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

/** One-shot effect layer descriptor (startle hop / crash landing). */
type Fx = { key: number; type: 'hop' | 'land' | null }

export function FooterWalker() {
  const prefersReduced = useReducedMotion()
  const laneRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0) // 0 = feet on the line; <0 lifted, >0 dropped low
  const [seasonal, setSeasonal] = useState(getSeasonalDay)

  const [mode, setMode] = useState<Mode>('walk')
  const [dir, setDirState] = useState(1)
  const [hovering, setHovering] = useState(false)
  const [fx, setFx] = useState<Fx>({ key: 0, type: null })
  const machine = useRef({
    mode: 'walk' as Mode,
    dir: 1,
    nextPauseAt: 0,
    resumeAt: 0,
    lastInput: 0,
  })

  const go = (next: Mode) => {
    machine.current.mode = next
    setMode(next)
  }
  const setDir = (d: number) => {
    machine.current.dir = d
    setDirState(d)
  }
  const playFx = (type: 'hop' | 'land') =>
    setFx((f) => ({ key: f.key + 1, type }))

  // The ⌘K critter calendar dresses the walker in a chosen day's outfit —
  // ta-da hop included — and brings the footer on screen so you see it.
  useEffect(() => {
    const onDress = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug
      const day = SEASONAL_DAYS.find((d) => d.slug === slug)
      if (!day) return
      setSeasonal(day)
      playFx('hop')
      window.setTimeout(() => {
        document.querySelector('footer')?.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'end',
        })
      }, 50) // let the palette finish closing first
    }
    window.addEventListener('critter-dress', onDress)
    return () => window.removeEventListener('critter-dress', onDress)
  }, [prefersReduced])

  useEffect(() => {
    if (prefersReduced) return
    const lane = laneRef.current
    if (!lane) return

    const trackWidth = () => Math.max(lane.clientWidth - CRITTER_W, 0)
    x.set(trackWidth() / 2) // start centre-stage

    const m = machine.current
    m.lastInput = performance.now()
    let raf = 0
    let last = 0
    let returnTimer = 0
    let running = false

    const wander = (fromRight: boolean) => {
      x.set(fromRight ? -OFFSTAGE : trackWidth() + OFFSTAGE)
      setDir(fromRight ? 1 : -1)
      m.nextPauseAt = performance.now() + rand(4000, 8000)
      go('walk')
    }

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      const max = trackWidth()

      if (m.mode === 'walk') {
        if (t - m.lastInput > IDLE_SLEEP) {
          go('sleep')
        } else if (t >= m.nextPauseAt) {
          m.resumeAt = t + rand(1200, 3200)
          m.nextPauseAt = t + rand(5000, 10000)
          go('pause')
        } else {
          let nx = x.get() + m.dir * WALK_SPEED * dt
          if (nx <= 0) (nx = 0), setDir(1)
          if (nx >= max) (nx = max), setDir(-1)
          x.set(nx)
        }
      } else if (m.mode === 'pause') {
        if (m.resumeAt !== STARE && t - m.lastInput > IDLE_SLEEP) go('sleep')
        else if (t >= m.resumeAt) go('walk')
      } else if (m.mode === 'flee') {
        const nx = x.get() + m.dir * FLEE_SPEED * dt
        x.set(nx)
        if (nx < -OFFSTAGE || nx > max + OFFSTAGE) {
          go('gone')
          returnTimer = window.setTimeout(() => wander(x.get() > 0), RETURN_AFTER)
        }
      }
      // sleep / held / falling / gone: position is left alone.
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      if (m.nextPauseAt === 0) m.nextPauseAt = last + rand(4000, 8000)
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Wake from a nap and bolt.
    const startleAwake = () => {
      if (m.mode !== 'sleep') return
      const max = trackWidth()
      setDir(x.get() > max / 2 ? 1 : -1)
      playFx('hop')
      go('flee')
    }
    // Any of these both reset the idle timer and can wake a sleeper.
    const onStartleInput = () => {
      m.lastInput = performance.now()
      startleAwake()
    }
    // Mouse movement counts as "still here" but doesn't spook it awake.
    const onActivity = () => {
      m.lastInput = performance.now()
    }

    window.addEventListener('scroll', onStartleInput, { passive: true })
    window.addEventListener('keydown', onStartleInput)
    window.addEventListener('touchstart', onStartleInput, { passive: true })
    window.addEventListener('mousemove', onActivity, { passive: true })

    // Only animate while the footer is in view.
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop(),
    )
    io.observe(lane)

    return () => {
      io.disconnect()
      stop()
      window.clearTimeout(returnTimer)
      window.removeEventListener('scroll', onStartleInput)
      window.removeEventListener('keydown', onStartleInput)
      window.removeEventListener('touchstart', onStartleInput)
      window.removeEventListener('mousemove', onActivity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, x, y])

  const spook = () => {
    const m = machine.current
    if (m.mode === 'flee' || m.mode === 'gone' || m.mode === 'held') return
    if (m.mode === 'sleep') {
      m.lastInput = performance.now()
    }
    const lane = laneRef.current
    const max = lane ? lane.clientWidth - CRITTER_W : 0
    setDir(x.get() > max / 2 ? 1 : -1)
    playFx('hop')
    go('flee')
  }

  // Hover: stop mid-stride and stare until the cursor leaves.
  const stare = () => {
    const m = machine.current
    if (m.mode !== 'walk') return
    m.resumeAt = STARE
    go('pause')
  }
  const unstare = () => {
    const m = machine.current
    if (m.mode !== 'pause' || m.resumeAt !== STARE) return
    const now = performance.now()
    m.lastInput = now
    m.resumeAt = now + 350
    m.nextPauseAt = now + rand(5000, 10000)
  }

  // Grab & drop.
  const onDragStart = () => go('held')
  const onDragEnd = () => {
    const m = machine.current
    const lane = laneRef.current
    const max = lane ? lane.clientWidth - CRITTER_W : 0
    const landX = Math.max(0, Math.min(max, x.get()))
    go('falling')
    // Plummet to the line (gravity-ish) with a settle, drifting back in-bounds.
    animate(x, landX, { duration: 0.42, ease: easeOut })
    animate(y, [y.get(), 0, -7, 0], {
      duration: 0.5,
      ease: [0.5, 0, 0.9, 0.4],
      times: [0, 0.7, 0.85, 1],
      onComplete: () => {
        playFx('land') // squash + indignant shake
        m.lastInput = performance.now()
        setDir(landX > max / 2 ? -1 : 1)
        window.setTimeout(() => {
          if (machine.current.mode === 'falling') go('flee')
        }, 620)
      },
    })
  }

  if (prefersReduced) {
    return (
      <div
        ref={laneRef}
        className="pointer-events-none absolute inset-x-6 top-0 flex justify-center"
      >
        <StaticCritter day={seasonal} />
      </div>
    )
  }

  const asleep = mode === 'sleep'
  const held = mode === 'held'
  // The hover sign that names the day — only while it's calmly on the ground.
  const showDaySign =
    hovering && seasonal && (mode === 'walk' || mode === 'pause' || asleep)

  return (
    <div
      ref={laneRef}
      aria-hidden={mode === 'gone'}
      className="pointer-events-none absolute inset-x-6 top-0"
    >
      <motion.button
        type="button"
        aria-label={
          seasonal
            ? `The pixel critter — today is ${seasonal.label}. Click to spook it, or drag it around`
            : 'The pixel critter — click to spook it, or drag it around'
        }
        onClick={spook}
        onMouseEnter={() => {
          setHovering(true)
          stare()
        }}
        onMouseLeave={() => {
          setHovering(false)
          unstare()
        }}
        drag
        dragMomentum={false}
        dragElastic={0.5}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        style={{ x, y }}
        className="pointer-events-auto absolute bottom-0 block cursor-grab select-none active:cursor-grabbing"
        tabIndex={mode === 'gone' ? -1 : 0}
      >
        {/* zzz while dozing */}
        {asleep && <Zzz />}

        {/* Hover reveal: the sign naming today's (usually obscure) day. */}
        {showDaySign && (
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2">
            <Sign>{seasonal.label}</Sign>
          </span>
        )}

        {/* One-shot effects: startle hop or crash-landing squash + shake. */}
        <motion.div
          key={fx.key}
          animate={
            fx.type === 'hop'
              ? { y: [0, -9, 0] }
              : fx.type === 'land'
                ? { scaleY: [0.55, 1.08, 0.96, 1], rotate: [0, -9, 7, -3, 0] }
                : undefined
          }
          transition={{ duration: fx.type === 'land' ? 0.55 : 0.32, ease: easeOut }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {/* Sit lower while asleep. */}
          <motion.div
            animate={{ y: asleep ? 5 : 0, scaleY: asleep ? 0.9 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformOrigin: 'bottom center' }}
          >
            <Critter
              prop={seasonal?.prop ?? null}
              eyes={
                mode === 'flee' || asleep
                  ? 'squint'
                  : held
                    ? 'wide'
                    : 'open'
              }
              walking={mode === 'walk' || mode === 'flee' || held}
              pace={mode === 'flee' || held ? 'dash' : 'amble'}
              lean={
                held
                  ? 0
                  : mode === 'flee'
                    ? dir * 9
                    : mode === 'walk'
                      ? dir * 3
                      : 0
              }
              blink={mode !== 'flee' && !asleep}
              gaze={!held}
            />
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  )
}

/** Floating "z z z" over a sleeping critter. */
function Zzz() {
  return (
    <div className="pointer-events-none absolute -right-1 -top-1 font-mono text-[10px] font-bold text-accent">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ right: i * 5, bottom: i * 4 }}
          initial={{ opacity: 0, y: 4, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], y: -10, scale: 1 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        >
          z
        </motion.span>
      ))}
    </div>
  )
}

/** Reduced-motion fallback: the critter just stands there; click = squint. */
function StaticCritter({ day }: { day: SeasonalDay | null }) {
  const [squint, setSquint] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <button
      type="button"
      aria-label={
        day ? `The pixel critter — today is ${day.label}` : 'The pixel critter'
      }
      title={day?.label}
      onClick={() => {
        setSquint(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setSquint(false), 650)
      }}
      className="pointer-events-auto absolute bottom-0 cursor-pointer select-none"
    >
      <Critter eyes={squint ? 'squint' : 'open'} prop={day?.prop ?? null} />
    </button>
  )
}
