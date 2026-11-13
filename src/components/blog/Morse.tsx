import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Morse code you can watch and hear. Two figures share one player:
 *
 * - MorseCode lays a word out letter by letter — dots as beads, dashes as
 *   bars, the letter in mono underneath.
 * - MorseBracelet strings the same signal as beads on a cord, the way the
 *   real bracelet is made. It shows no letters until it's played: the word
 *   types itself out in the caption as each letter finishes.
 *
 * "tap it out" lights each symbol in ember in real Morse timing (dash = 3
 * dots, 3-dot gaps between letters) and sounds a soft tone through Web
 * Audio. Sound only ever starts from that click; if audio is unavailable it
 * stays a light show. Everything stops cleanly on stop or unmount.
 */

const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
}

const UNIT_MS = 85 // one dot; ~14 words per minute
const TONE_HZ = 620
const VOLUME = 0.08

interface Letter {
  char: string
  symbols: string[]
}

function encode(text: string): Letter[] {
  return [...text.toUpperCase()]
    .filter((c) => MORSE[c])
    .map((c) => ({ char: c, symbols: [...MORSE[c]] }))
}

type Lit = { letter: number; symbol: number } | null

/** Plays letters as light (state) and sound (Web Audio), in Morse timing. */
function useMorsePlayer(letters: Letter[]) {
  const [lit, setLit] = useState<Lit>(null)
  const [done, setDone] = useState(0) // letters fully played
  const [playing, setPlaying] = useState(false)
  const timers = useRef<number[]>([])
  const ctxRef = useRef<AudioContext | null>(null)
  const outRef = useRef<GainNode | null>(null)

  const stop = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    // Disconnecting the per-play bus silences any tones already scheduled.
    outRef.current?.disconnect()
    outRef.current = null
    setLit(null)
    setPlaying(false)
  }, [])

  useEffect(
    () => () => {
      stop()
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
    },
    [stop],
  )

  const play = () => {
    stop()
    setDone(0)
    setPlaying(true)

    let ctx: AudioContext | null = null
    let out: GainNode | null = null
    try {
      ctx = ctxRef.current ?? new AudioContext()
      ctxRef.current = ctx
      void ctx.resume()
      out = ctx.createGain()
      out.connect(ctx.destination)
      outRef.current = out
    } catch {
      ctx = null /* no Web Audio: light only */
    }
    const start = ctx ? ctx.currentTime + 0.05 : 0

    const at = (ms: number, fn: () => void) =>
      timers.current.push(window.setTimeout(fn, ms + 50))

    let t = 0
    letters.forEach((letter, l) => {
      letter.symbols.forEach((sym, s) => {
        const len = sym === '.' ? UNIT_MS : UNIT_MS * 3
        at(t, () => setLit({ letter: l, symbol: s }))
        if (ctx && out) tone(ctx, out, start + t / 1000, len / 1000)
        t += len
        at(t, () => setLit(null))
        t += UNIT_MS // gap inside a letter
      })
      at(t, () => setDone(l + 1))
      t += UNIT_MS * 2 // tops the gap up to 3 units between letters
    })
    at(t, stop)
  }

  return { lit, done, playing, play, stop }
}

function tone(ctx: AudioContext, out: AudioNode, at: number, dur: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = TONE_HZ
  // Short ramps at both ends so tones don't click.
  gain.gain.setValueAtTime(0, at)
  gain.gain.linearRampToValueAtTime(VOLUME, at + 0.006)
  gain.gain.setValueAtTime(VOLUME, at + dur - 0.008)
  gain.gain.linearRampToValueAtTime(0, at + dur)
  osc.connect(gain).connect(out)
  osc.start(at)
  osc.stop(at + dur + 0.02)
}

function PlayButton({
  playing,
  onPlay,
  onStop,
}: {
  playing: boolean
  onPlay: () => void
  onStop: () => void
}) {
  return (
    <button
      type="button"
      onClick={playing ? onStop : onPlay}
      className="inline-flex items-center gap-2 font-mono text-[11px] lowercase tracking-[0.15em] text-fg-muted transition-colors hover:text-accent"
    >
      <span aria-hidden className="text-accent">
        {playing ? '❚❚' : '▶'}
      </span>
      {playing ? 'stop' : 'tap it out'}
      <span className="sr-only"> (plays a sound)</span>
    </button>
  )
}

const codeOf = (letters: Letter[]) =>
  letters.map((l) => l.symbols.join('')).join(' ')

/** 'SAKSHAM' → 'Saksham', so screen readers say the word, not the letters. */
const asWord = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

export function MorseCode({ text }: { text: string }) {
  const letters = encode(text)
  const { lit, playing, play, stop } = useMorsePlayer(letters)
  if (!letters.length) return null
  const code = codeOf(letters)

  return (
    <figure className="my-10 border-y border-line py-8">
      <p className="sr-only">{`${asWord(text)} in Morse code: ${code}`}</p>
      <div
        aria-hidden
        className="flex flex-wrap items-end justify-center gap-x-5 gap-y-6 sm:gap-x-7"
      >
        {letters.map((letter, l) => (
          <div key={l} className="flex flex-col items-center gap-2.5">
            <div className="flex h-3 items-center gap-1.5">
              {letter.symbols.map((sym, s) => {
                const on = lit?.letter === l && lit.symbol === s
                return (
                  <span
                    key={s}
                    className={`block h-2.5 rounded-full ${
                      sym === '.' ? 'w-2.5' : 'w-7'
                    } ${on ? 'bg-accent' : 'bg-fg/70'}`}
                  />
                )
              })}
            </div>
            <span
              className={`font-mono text-xs lowercase ${
                lit?.letter === l ? 'text-accent' : 'text-fg-faint'
              }`}
            >
              {letter.char}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <code aria-hidden className="font-mono text-xs tracking-wider text-fg-faint">
          {code}
        </code>
        <PlayButton playing={playing} onPlay={play} onStop={stop} />
      </figcaption>
    </figure>
  )
}

/* ---- the bracelet ---------------------------------------------------- */

const W = 520
const H = 86
const DOT = 10 // bead lengths along the cord, in svg units
const DASH = 22
const GAP = 4 // between beads of a letter
const LETTER_GAP = 16 // between letters (a spacer bead sits in the middle)
const THICK = 10

// The cord: a gentle sag between two clasps.
const P0 = { x: 22, y: 24 }
const P1 = { x: W / 2, y: 112 }
const P2 = { x: W - 22, y: 24 }

const bezier = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
})

// Sample the curve once so beads can be placed by distance along it.
const SAMPLES = Array.from({ length: 401 }, (_, i) => bezier(i / 400))
const LENGTHS = [0]
for (let i = 1; i < SAMPLES.length; i++) {
  const a = SAMPLES[i - 1]
  const b = SAMPLES[i]
  LENGTHS.push(LENGTHS[i - 1] + Math.hypot(b.x - a.x, b.y - a.y))
}
const CORD = LENGTHS[LENGTHS.length - 1]

/** Point and tangent angle (degrees) at distance `d` along the cord. */
function along(d: number) {
  let i = LENGTHS.findIndex((l) => l >= d)
  if (i <= 0) i = 1
  const a = SAMPLES[i - 1]
  const b = SAMPLES[i]
  const span = LENGTHS[i] - LENGTHS[i - 1] || 1
  const k = (d - LENGTHS[i - 1]) / span
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  }
}

interface Bead {
  letter: number
  symbol: number // -1 for a spacer
  len: number
  x: number
  y: number
  angle: number
}

function layout(letters: Letter[]): Bead[] {
  const runs: Omit<Bead, 'x' | 'y' | 'angle'>[] = []
  letters.forEach((letter, l) => {
    if (l > 0) runs.push({ letter: l, symbol: -1, len: LETTER_GAP })
    letter.symbols.forEach((sym, s) => {
      if (s > 0) runs.push({ letter: l, symbol: -2, len: GAP })
      runs.push({ letter: l, symbol: s, len: sym === '.' ? DOT : DASH })
    })
  })
  const total = runs.reduce((sum, r) => sum + r.len, 0)
  const scale = Math.min(1, (CORD * 0.9) / total)
  let d = (CORD - total * scale) / 2
  const beads: Bead[] = []
  for (const r of runs) {
    const len = r.len * scale
    if (r.symbol !== -2) beads.push({ ...r, len, ...along(d + len / 2) })
    d += len
  }
  return beads
}

export function MorseBracelet({ text }: { text: string }) {
  const letters = encode(text)
  const { lit, done, playing, play, stop } = useMorsePlayer(letters)
  if (!letters.length) return null
  const beads = layout(letters)
  const code = codeOf(letters)
  const word = letters.map((l) => l.char).join('').toLowerCase()

  return (
    <figure className="my-10 border-y border-line py-8">
      <p className="sr-only">{`A bracelet of beads spelling “${asWord(text)}” in Morse code: ${code}`}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-xl" aria-hidden>
        <path
          d={`M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
          className="fill-none stroke-fg-faint"
          strokeWidth={1.25}
        />
        {/* Clasps. */}
        {[P0, P2].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4.5}
            className="fill-none stroke-fg-faint"
            strokeWidth={1.5}
          />
        ))}
        {beads.map((b, i) => {
          if (b.symbol === -1) {
            return <circle key={i} cx={b.x} cy={b.y} r={2.2} className="fill-fg-faint" />
          }
          const on = lit?.letter === b.letter && lit.symbol === b.symbol
          return (
            <rect
              key={i}
              x={b.x - b.len / 2}
              y={b.y - THICK / 2}
              width={b.len}
              height={THICK}
              rx={THICK / 2}
              transform={`rotate(${b.angle} ${b.x} ${b.y})`}
              className={on ? 'fill-accent' : 'fill-fg'}
              opacity={on ? 1 : 0.85}
            />
          )
        })}
      </svg>
      <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <span aria-hidden className="font-mono text-xs tracking-wider">
          {done > 0 ? (
            <span className="text-accent">{word.slice(0, done)}</span>
          ) : (
            <span className="text-fg-faint">{code}</span>
          )}
        </span>
        <PlayButton playing={playing} onPlay={play} onStop={stop} />
      </figcaption>
    </figure>
  )
}
