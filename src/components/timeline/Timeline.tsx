import { motion, useScroll, useSpring } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

// The spine ends this far *above* the final (Contact) section, leaving a
// clean gap so the terminal dot never collides with the closing heading.
const TERMINUS_GAP = 72

/**
 * The container that owns the spine. The faint track and the scroll-linked
 * accent fill run from the first node down to a terminal dot that sits just
 * above the closing section — so the line resolves cleanly into its endpoint
 * instead of bleeding through the final content and footer.
 */
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [spineHeight, setSpineHeight] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end end'],
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  })

  // Measure where the last node sits so the spine ends exactly there.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const sections = el.querySelectorAll<HTMLElement>(':scope > section')
      const last = sections[sections.length - 1]
      if (last) setSpineHeight(Math.max(0, last.offsetTop - TERMINUS_GAP))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const spineSize =
    spineHeight != null ? { height: spineHeight } : { bottom: 0 }

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl px-6">
      {/* Spine — faint track */}
      <div
        aria-hidden
        style={spineSize}
        className="pointer-events-none absolute left-7 top-0 w-px bg-line lg:left-1/2 lg:-translate-x-1/2"
      />
      {/* Spine — accent fill, drawn by scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleY, ...spineSize }}
        className="pointer-events-none absolute left-7 top-0 w-px origin-top bg-gradient-to-b from-accent to-accent-soft lg:left-1/2 lg:-translate-x-1/2"
      />
      {/* Terminal dot — the journey's endpoint */}
      {spineHeight != null && (
        <span
          aria-hidden
          style={{ top: spineHeight }}
          className="pointer-events-none absolute left-7 z-10 -translate-x-1/2 -translate-y-1/2 lg:left-1/2"
        >
          <span className="relative flex h-3.5 w-3.5 rounded-full bg-accent">
            <span className="absolute inset-0 -z-10 rounded-full bg-accent/50 blur-md" />
          </span>
        </span>
      )}
      {children}
    </div>
  )
}
