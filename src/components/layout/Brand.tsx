import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '@/lib/motion'
import { relative, useLastShipped } from '@/lib/useLastShipped'
import { resume, socials } from '@/data/content'

/**
 * Menu entries shown in the slide-in panel.
 *
 * ✏️  Add more here as the site grows (sections, theme toggle…).
 *     `soon: true` renders the row unclickable with a "coming soon" tag —
 *     the route itself stays live for anyone who types the URL.
 */
const menuLinks: Array<{
  label: string
  href: string
  external?: boolean
  soon?: boolean
}> = [
  { label: 'Home', href: '/' },
  { label: 'Blogs', href: '/blogs' },
]

/**
 * The top-left wordmark, now a menu trigger.
 *
 * At rest it reads "SM." (white via `mix-blend-difference` so it inverts
 * against whatever scrolls behind it; the dot is repainted ember on a separate
 * un-blended layer). On hover the mark dissolves as a hamburger draws itself in
 * bar-by-bar; clicking opens a frosted-glass panel and the icon rotates into ✕.
 */
export function Brand() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const prefersReduced = useReducedMotion()
  const shipped = useLastShipped()

  // Close on Escape and lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const showBurger = hovered && !open
  const showLogo = !hovered && !open

  return (
    <>
      {/* Progressive glass under the mark — content scrolling past the top
          edge dissolves into stacked blur layers instead of colliding with
          the logo. Phone-only (hidden from sm up): on wider screens the
          content's centred margins keep it clear of the mark. Sits below
          the logo layers (z-40) and above everything that scrolls. */}
      <span
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 sm:hidden"
      >
        <span className="top-glass-soft absolute inset-0" />
        <span className="top-glass-mid absolute inset-0" />
        <span className="top-glass-heavy absolute inset-0" />
      </span>

      {/* ── Icon visual layers (fixed, blended, non-interactive) ────────── */}

      {/* "SM" — blended white so it inverts against any background. */}
      <span
        aria-hidden
        className={`pointer-events-none fixed left-6 top-5 z-40 font-hero text-xl font-bold tracking-tight text-white mix-blend-difference transition-opacity duration-300 ease-out ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        SM.
      </span>
      {/* Ember dot — un-blended overlay so it stays true orange. */}
      <span
        aria-hidden
        className={`pointer-events-none fixed left-6 top-5 z-40 font-hero text-xl font-bold tracking-tight text-transparent transition-opacity duration-300 ease-out ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        SM<span className="text-accent">.</span>
      </span>

      {/* Hamburger — three blended bars that draw in left-to-right on hover. */}
      <span
        aria-hidden
        className={`pointer-events-none fixed left-6 top-[1.6rem] z-40 flex flex-col gap-[5px] mix-blend-difference transition-opacity duration-200 ease-out ${
          showBurger ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span
          className={`block h-[2px] w-6 origin-left bg-white transition-transform duration-300 ease-out ${
            showBurger ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
        <span
          className={`block h-[2px] w-6 origin-left bg-white transition-transform delay-75 duration-300 ease-out ${
            showBurger ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
        <span
          className={`block h-[2px] w-6 origin-left bg-white transition-transform delay-150 duration-300 ease-out ${
            showBurger ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </span>

      {/* ── Trigger button (on top, catches hover + click) ──────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="fixed left-5 top-3 z-[60] flex h-10 w-14 items-center px-1"
      >
        {/* ✕ — solid white, rotates in above the glass when the panel opens. */}
        <span
          aria-hidden
          className={`relative block h-4 w-4 transition-all duration-300 ease-out ${
            open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
          }`}
        >
          <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rotate-45 bg-white" />
          <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 -rotate-45 bg-white" />
        </span>
      </button>

      {/* ── Frosted-glass panel + backdrop (one cohesive material) ──────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed left-0 top-0 z-50 flex h-full w-80 max-w-[82vw] flex-col overflow-hidden border-r border-white/10 bg-ink/50 px-7 pb-9 pt-24 shadow-2xl shadow-black/40 backdrop-blur-2xl backdrop-saturate-150"
              initial={prefersReduced ? { opacity: 0 } : { x: '-100%' }}
              animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { x: '-100%' }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              {/* Specular sheen — the highlight that sells the liquid-glass look. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent"
              />

              <p className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint">
                Menu
              </p>

              {/* Editorial nav — numbered links that slide + reveal an arrow on
                  hover, staggering in as the panel settles. */}
              <motion.nav
                className="relative mt-8 flex flex-col"
                initial={prefersReduced ? undefined : 'hidden'}
                animate={prefersReduced ? undefined : 'visible'}
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.18 },
                  },
                }}
              >
                {menuLinks.map((link, i) => {
                  const itemVariants = prefersReduced
                    ? undefined
                    : {
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.45, ease: easeOut },
                        },
                      }

                  // Not live yet — same row, muted, with a small tag where
                  // the hover arrow would be. No link, no hover theatrics.
                  if (link.soon) {
                    return (
                      <motion.div
                        key={link.label}
                        variants={itemVariants}
                        className="flex items-center gap-4 border-b border-white/10 py-5"
                      >
                        <span className="font-mono text-xs text-fg-faint">
                          0{i + 1}
                        </span>
                        <span className="font-hero text-3xl font-bold tracking-tight text-fg-faint">
                          {link.label}
                        </span>
                        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                          Coming soon
                        </span>
                      </motion.div>
                    )
                  }

                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer noopener' : undefined}
                      onClick={() => setOpen(false)}
                      variants={itemVariants}
                      className="group flex items-center gap-4 border-b border-white/10 py-5"
                    >
                      <span className="font-mono text-xs text-fg-faint transition-colors group-hover:text-accent">
                        0{i + 1}
                      </span>
                      <span className="font-hero text-3xl font-bold tracking-tight text-fg transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                        {link.label}
                      </span>
                      <span
                        aria-hidden
                        className="ml-auto -translate-x-2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </motion.a>
                  )
                })}
              </motion.nav>

              {/* A quiet pointer at the palette, for keyboard people.
                  Meaningless on touch screens, so it hides below sm. */}
              <p className="relative mt-6 hidden font-mono text-[11px] text-fg-faint sm:block">
                prefer the keyboard? try{' '}
                <span className="border border-white/15 px-1.5 py-0.5 text-fg-muted">
                  ⌘ K
                </span>
              </p>

              {/* Footer — anchors the panel and gives recruiters a way out. */}
              <div className="relative mt-auto pt-10">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint">
                  Elsewhere
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={resume.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-fit font-mono text-sm text-fg-muted transition-colors hover:text-accent"
                  >
                    {resume.label}
                  </a>
                  {socials.map((s) => (
                    <span key={s.label} className="flex items-baseline gap-x-2">
                      <a
                        href={s.href}
                        target={s.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer noopener"
                        className="w-fit font-mono text-sm text-fg-muted transition-colors hover:text-accent"
                      >
                        {s.label}
                      </a>
                      {/* Live receipt riding the GitHub link — when the last
                          public push landed. Links to the repo it landed in
                          without naming it. */}
                      {s.label === 'GitHub' && shipped && (
                        <a
                          href={shipped.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="whitespace-nowrap font-mono text-xs text-fg-faint transition-colors hover:text-accent"
                        >
                          / last shipped {relative(shipped.at)}
                        </a>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
