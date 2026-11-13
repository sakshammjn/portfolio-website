import { useReducedMotion } from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'

/**
 * A section rail for long posts, after ChatGPT's conversation scroller: one
 * short hairline tick per section, pinned to the right edge. The section
 * being read is a longer ember tick; sections already read sit a shade
 * brighter than those still to come, so the rail doubles as progress.
 * Hover (or tab into) the rail and a frosted panel opens beside it, naming
 * each section with the same numbering as the inline Contents; a click
 * glides to that heading.
 *
 * Wide screens only (lg+), where the article leaves a gutter for it. It
 * fades in once the reader is past the header, so it never doubles up with
 * the Contents list at the top. Transform and opacity only.
 */

const SHOW_AFTER = 320 // px scrolled before the rail fades in
const ACTIVE_LINE = 0.3 // a section is current once its heading passes 30% down the viewport

export function SectionRail({
  headings,
}: {
  headings: { id: string; text: string }[]
}) {
  const prefersReduced = useReducedMotion()
  const [active, setActive] = useState(-1)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setShown(window.scrollY > SHOW_AFTER)
      const line = window.innerHeight * ACTIVE_LINE
      let current = -1
      headings.forEach((h, i) => {
        const el = document.getElementById(h.id)
        if (el && el.getBoundingClientRect().top <= line) current = i
      })
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [headings])

  if (headings.length < 2) return null

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    })
    history.replaceState(null, '', `#${id}`)
    // Hand focus to the heading: keyboard and screen-reader users land where
    // they jumped, and the panel (held open by focus-within) closes instead
    // of hanging over the article.
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  const num = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <nav
      aria-label="Sections"
      className={`group fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-300 focus-within:pointer-events-auto focus-within:opacity-100 motion-reduce:transition-none lg:block ${
        shown ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="relative">
        {/* The panel. Its transparent right padding bridges the gap to the
            ticks, so the cursor can cross over without it closing. Rows are
            h-7 on both sides, so each name lines up with its tick. */}
        <div className="pointer-events-none absolute right-full top-0 translate-x-1 pr-2 opacity-0 transition duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none">
          <ol className="border border-fg/10 bg-ink/85 px-4 py-2 shadow-2xl shadow-black/40 backdrop-blur-2xl backdrop-saturate-150">
            {headings.map((h, i) => (
              <li key={h.id} className="flex h-7 items-center">
                <a
                  href={`#${h.id}`}
                  onClick={(e) => go(e, h.id)}
                  aria-current={i === active ? 'location' : undefined}
                  className={`flex max-w-[18rem] items-baseline gap-3 whitespace-nowrap font-mono text-xs transition-colors hover:text-accent ${
                    i === active ? 'text-fg' : 'text-fg-muted'
                  }`}
                >
                  <span className="text-accent">{num(i)}</span>
                  <span className="truncate">{h.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* The ticks — the always-visible half. Mouse-only shortcuts; the
            panel links above are the accessible ones. */}
        <ol aria-hidden className="flex flex-col py-2.25">
          {headings.map((h, i) => (
            <li key={h.id} className="flex h-7 items-center justify-end">
              <a
                href={`#${h.id}`}
                tabIndex={-1}
                onClick={(e) => go(e, h.id)}
                className="group/tick flex h-full w-9 items-center justify-end pr-1"
              >
                <span
                  className={`block h-0.5 w-5 origin-right rounded-full transition duration-300 motion-reduce:transition-none ${
                    i === active
                      ? 'scale-x-100 bg-accent'
                      : `scale-x-50 group-hover/tick:scale-x-75 ${
                          i < active ? 'bg-fg/55' : 'bg-fg/20'
                        }`
                  }`}
                />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
