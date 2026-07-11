import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '@/lib/motion'
import { Critter, Sign } from '@/components/effects/Critter'

/**
 * "release the critters" — the ⌘K parade.
 *
 * A troupe marches across the bottom of the screen in loose size order, some
 * of them hopping as they go, the runt at the back squinting to keep up.
 * When the march ends, one straggler wanders back in, stops mid-screen and
 * holds up an "again?" sign — click it (or re-run the command) and the next
 * wave releases, and every wave escalates: more critters, faster, denser,
 * more hopping, plus a smaller counter-flow lane crossing behind from wave 2.
 * Chaos caps at wave 4; the escalation is per-visit.
 *
 * Purely decorative overlay (only the straggler takes clicks); marches behind
 * the palette (z-80) and skips entirely under reduced motion.
 */

interface Marcher {
  id: string
  lane: 'fwd' | 'rev'
  size: number
  bottom: number
  delay: number
  duration: number
  squint: boolean
  /** Seconds between joy-hops; undefined = a dignified walker. */
  hopDelay?: number
}

// Escalation ladder, indexed by wave (capped).
const COUNT = [7, 12, 17, 22]
const STAGGER = [0.45, 0.32, 0.24, 0.18]
const SPEED = [6.2, 5.4, 4.8, 4.2] // base crossing time in seconds

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

const troupe = (wave: number): Marcher[] => {
  const w = Math.min(wave, COUNT.length) - 1
  const n = COUNT[w]
  const out: Marcher[] = []
  for (let i = 0; i < n; i++) {
    out.push({
      id: `fwd-${i}`,
      lane: 'fwd',
      // Loose family order — big leads, with scatter so it never looks sorted.
      size: Math.max(18, 46 - (i * 28) / n + rand(-4, 4)),
      bottom: 2 + rand(0, 6),
      delay: i * STAGGER[w] + rand(0, 0.15),
      duration: SPEED[w] + rand(0, 1.2),
      squint: i === n - 1, // the runt, panicking at the back
      hopDelay: Math.random() < 0.2 + w * 0.12 ? rand(0.8, 2.4) : undefined,
    })
  }
  // From wave 2: a smaller counter-flow lane crossing behind.
  for (let i = 0; i < 3 * w; i++) {
    out.push({
      id: `rev-${i}`,
      lane: 'rev',
      size: rand(14, 24),
      bottom: 26 + rand(0, 8),
      delay: rand(0.5, n * STAGGER[w] * 0.8),
      duration: SPEED[w] + rand(0.5, 1.5),
      squint: false,
    })
  }
  return out
}

type Finale = 'arriving' | 'standing' | 'leaving'

export function CritterParade() {
  const prefersReduced = useReducedMotion()
  const [run, setRun] = useState<{ wave: number; list: Marcher[] } | null>(null)
  const [finale, setFinale] = useState<Finale | null>(null)
  const wave = useRef(0)
  const done = useRef(0)
  const leaveTimer = useRef<number | undefined>(undefined)

  const release = () => {
    wave.current = Math.min(wave.current + 1, COUNT.length)
    done.current = 0
    window.clearTimeout(leaveTimer.current)
    setFinale(null)
    setRun({ wave: wave.current, list: troupe(wave.current) })
  }

  useEffect(() => {
    if (prefersReduced) return
    const onParade = () => release()
    window.addEventListener('critter-parade', onParade)
    return () => {
      window.removeEventListener('critter-parade', onParade)
      window.clearTimeout(leaveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced])

  if (!run && !finale) return null

  const vw = window.innerWidth

  return (
    <div
      aria-hidden={!finale}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[75] h-20"
    >
      {run?.list.map((m) => (
        <motion.div
          key={`${run.wave}-${m.id}`}
          className="absolute left-0"
          style={{
            bottom: m.bottom,
            zIndex: m.lane === 'fwd' ? 2 : 1,
            opacity: m.lane === 'rev' ? 0.7 : 1,
          }}
          initial={{ x: m.lane === 'fwd' ? -64 : vw + 64 }}
          animate={{ x: m.lane === 'fwd' ? vw + 64 : -64 }}
          transition={{ duration: m.duration, delay: m.delay, ease: 'linear' }}
          onAnimationComplete={() => {
            done.current += 1
            if (done.current === run.list.length) {
              setRun(null)
              setFinale('arriving')
            }
          }}
        >
          {m.hopDelay ? (
            <motion.div
              // Joy-hop with squash on launch and landing.
              animate={{ y: [0, -12, 0], scaleY: [1, 1.06, 0.9, 1] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: m.hopDelay,
                ease: easeOut,
              }}
              style={{ transformOrigin: 'bottom center' }}
            >
              <Critter
                size={m.size}
                walking
                pace={m.squint ? 'dash' : 'amble'}
                lean={m.lane === 'fwd' ? 3 : -3}
                eyes={m.squint ? 'squint' : 'open'}
              />
            </motion.div>
          ) : (
            <Critter
              size={m.size}
              walking
              pace={m.squint ? 'dash' : 'amble'}
              lean={m.lane === 'fwd' ? 3 : -3}
              eyes={m.squint ? 'squint' : 'open'}
            />
          )}
        </motion.div>
      ))}

      {/* The straggler — wanders back in, asks for an encore. */}
      {finale && (
        <motion.div
          className="pointer-events-auto absolute bottom-1 left-0 z-[3]"
          initial={{ x: -80 }}
          animate={{ x: finale === 'leaving' ? vw + 80 : vw / 2 - 20 }}
          transition={{
            duration: finale === 'leaving' ? 1.6 : 1.8,
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            if (finale === 'arriving') {
              setFinale('standing')
              leaveTimer.current = window.setTimeout(
                () => setFinale('leaving'),
                5200,
              )
            } else if (finale === 'leaving') {
              setFinale(null)
            }
          }}
        >
          <button
            type="button"
            aria-label="Release them again"
            onClick={() => {
              if (finale === 'standing') release()
            }}
            className="flex cursor-pointer select-none flex-col items-center"
          >
            <AnimatePresence>
              {finale === 'standing' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  <Sign>again?</Sign>
                </motion.div>
              )}
            </AnimatePresence>
            <Critter
              size={40}
              walking={finale !== 'standing'}
              pace={finale === 'leaving' ? 'dash' : 'amble'}
              lean={finale === 'arriving' ? 4 : finale === 'leaving' ? 10 : 0}
              gaze={finale === 'standing'}
              blink
              eyes={finale === 'leaving' ? 'squint' : 'open'}
            />
          </button>
        </motion.div>
      )}
    </div>
  )
}
