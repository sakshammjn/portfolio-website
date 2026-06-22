import { useEffect, useRef } from 'react'

interface ClickSparkProps {
  /** Spark colour — defaults to the brand ember accent. */
  sparkColor?: string
  /** Length of each spark line at its start, in px. */
  sparkSize?: number
  /** How far the sparks travel from the click point, in px. */
  sparkRadius?: number
  /** Number of sparks per burst. */
  sparkCount?: number
  /** Burst lifetime in ms. */
  duration?: number
}

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

/**
 * A soothing radial "spark" burst on every click, rendered on a single
 * full-viewport canvas overlay (pointer-events: none, so it never blocks
 * the UI). Inspired by the ClickSpark effect on manixh.dev.
 *
 * The render loop only runs while sparks are alive, and the whole effect is
 * disabled for visitors who prefer reduced motion.
 */
export function ClickSpark({
  sparkColor = '#ff6a3d',
  sparkSize = 12,
  sparkRadius = 22,
  sparkCount = 12,
  duration = 520,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // ease-out — quick launch, gentle settle
    const easeOut = (t: number) => t * (2 - t)

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineWidth = 2

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime
        if (elapsed >= duration) return false

        const progress = elapsed / duration
        const eased = easeOut(progress)
        const distance = eased * sparkRadius
        const lineLength = sparkSize * (1 - eased)

        const cos = Math.cos(spark.angle)
        const sin = Math.sin(spark.angle)
        const x1 = spark.x + distance * cos
        const y1 = spark.y + distance * sin
        const x2 = spark.x + (distance + lineLength) * cos
        const y2 = spark.y + (distance + lineLength) * sin

        ctx.globalAlpha = 1 - eased
        ctx.strokeStyle = sparkColor
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return true
      })
      ctx.globalAlpha = 1

      if (sparksRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(draw)
      } else {
        rafRef.current = null
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      const now = performance.now()
      for (let i = 0; i < sparkCount; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / sparkCount,
          startTime: now,
        })
      }
      // Kick the loop only if it isn't already running.
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', handlePointerDown)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  )
}
