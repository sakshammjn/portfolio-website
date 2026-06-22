import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/**
 * The container that owns the spine. The faint track spans the whole journey;
 * the accent fill is scroll-linked, drawing itself from top to bottom as the
 * visitor progresses.
 */
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end end'],
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl px-6">
      {/* Spine — faint track */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-7 top-0 w-px bg-line lg:left-1/2 lg:-translate-x-1/2"
      />
      {/* Spine — accent fill, drawn by scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="pointer-events-none absolute bottom-0 left-7 top-0 w-px origin-top bg-gradient-to-b from-accent to-accent-soft lg:left-1/2 lg:-translate-x-1/2"
      />
      {children}
    </div>
  )
}
