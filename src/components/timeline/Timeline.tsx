import { motion, useScroll, useSpring } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

// Distance from a section's top to its node's centre:
// node is at top-1.5 (6px) and is 16px tall (h-4) → centre ≈ 14px.
const NODE_CENTER_OFFSET = 14

/**
 * The container that owns the spine. The faint track and the scroll-linked
 * accent fill run from the first node down to the *last* node (Contact), so
 * the line terminates cleanly at the final milestone instead of bleeding
 * through the closing content and footer.
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
      if (last) setSpineHeight(last.offsetTop + NODE_CENTER_OFFSET)
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
      {children}
    </div>
  )
}
