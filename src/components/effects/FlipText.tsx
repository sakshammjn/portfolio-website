import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface FlipSegment {
  text: string
  /** Render this segment in the accent colour (e.g. the braces). */
  accent?: boolean
}

interface FlipTextProps {
  /** Accessible label (the individual letter spans aren't read sensibly). */
  label: string
  /** Ordered text segments that make up the word. */
  segments: FlipSegment[]
  /** Which way letters slide out on hover. */
  direction?: 'left' | 'right'
  className?: string
}

/**
 * A heavy display word rendered as individual letters. The inner row is
 * scaled on the X axis to exactly fill its container, so two different words
 * (the name and "PORTFOLIO") end up the same width. On hover each letter
 * slides out to the left while an identical clone slides in from the right —
 * odd letters first, then the even ones.
 */
// odd pass (0.26s) then even pass (0.32s delay + 0.26s) = 580ms, plus a buffer.
const SEQUENCE_MS = 640

export function FlipText({
  label,
  segments,
  direction = 'left',
  className = '',
}: FlipTextProps) {
  const slideRight = direction === 'right'
  const wrapRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const [scaleX, setScaleX] = useState(1)

  // Play to completion: start on pointer-enter, clear only after the whole
  // sequence finishes — leaving early doesn't cut it off. Ignore re-entry
  // while a swap is mid-flight.
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const startSwap = () => {
    if (playing) return
    setPlaying(true)
    timer.current = setTimeout(() => setPlaying(false), SEQUENCE_MS)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const measure = () => {
      const natural = inner.scrollWidth // layout width, unaffected by transforms
      if (natural > 0) setScaleX(wrap.clientWidth / natural)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    // Re-measure once the web font has actually loaded.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => ro.disconnect()
  }, [segments])

  // Flatten segments into letters. Each letter is a clipped slot holding the
  // in-flow glyph plus an identical clone parked just off the right edge.
  let index = 0
  const letters = segments.flatMap((seg) =>
    Array.from(seg.text).map((ch) => {
      const i = index++
      const glyph = ch === ' ' ? ' ' : ch
      return (
        <span
          key={i}
          className="flip-letter relative inline-block overflow-hidden align-top leading-[1.1]"
          style={{ color: seg.accent ? 'var(--color-accent)' : undefined }}
        >
          <span className="flip-ch inline-block">{glyph}</span>
          <span
            className={`flip-clone absolute top-0 opacity-0 ${slideRight ? 'right-full' : 'left-full'}`}
            aria-hidden
          >
            {glyph}
          </span>
        </span>
      )
    }),
  )

  return (
    <span
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={`flip-text block w-full overflow-hidden text-center ${className}`}
    >
      <span
        ref={innerRef}
        aria-hidden
        onMouseEnter={startSwap}
        className={`flip-inner inline-block whitespace-nowrap font-hero text-[3rem] font-bold uppercase tracking-tight sm:text-8xl md:text-[8rem] ${slideRight ? 'flip-right' : ''} ${playing ? 'is-playing' : ''}`}
        style={{ transform: `scaleX(${scaleX})`, transformOrigin: 'center' }}
      >
        {letters}
      </span>
    </span>
  )
}
