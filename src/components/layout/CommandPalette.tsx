import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '@/lib/motion'
import { contact, resume, socials } from '@/data/content'
import { CURRENT_VERSION } from '@/data/changelog'
import { SEASONAL_DAYS } from '@/lib/seasonal'
import { Critter } from '@/components/effects/Critter'

/**
 * ⌘K command palette — the console easter egg, surfaced on the page.
 *
 * A minimal mono prompt in the menu's frosted-glass material: chapter jumps
 * and the hire/résumé/socials shortcuts. Opens with ⌘K / Ctrl+K, closes on
 * Escape or backdrop click. No library — a fixed input, a filtered list,
 * and three keyboard handlers.
 */

/** Chapter jump targets — keep ids and order in sync with App.tsx. */
const chapters = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'opensource', label: 'Open Source', index: '03' },
  { id: 'projects', label: 'Projects', index: '04' },
  { id: 'global', label: 'Global Exposure', index: '05' },
  { id: 'achievements', label: 'Achievements', index: '06' },
  { id: 'education', label: 'Education', index: '07' },
  { id: 'contact', label: 'Contact', index: '{ }' },
]

interface Command {
  id: string
  label: string
  /** Small right-aligned mono hint (chapter number, ↗, …). */
  hint: string
  /** Extra match terms beyond the label. */
  keywords: string
  /** Return 'keep-open' to show copy feedback, 'submenu' to stay open after
   *  switching the palette into another view; void closes. */
  run: () => void | 'keep-open' | 'submenu'
}

/** Which list the palette is showing: commands, or the critter's calendar. */
type View = 'commands' | 'days'

const MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ')

type Theme = 'light' | 'dark'

/** Flip the palette: swap the <html> class, persist it, retint the chrome.
 *  Mirrors the pre-paint script in index.html (localStorage key 'theme'). */
function commitTheme(next: Theme) {
  const el = document.documentElement
  el.classList.remove('light', 'dark')
  el.classList.add(next)
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* private mode — the class still applies for this session */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', next === 'light' ? '#FAF9F5' : '#0A0A0B')
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> }
}

/** Flip the theme with a diagonal wipe. The View Transitions API captures the
 *  outgoing and incoming palettes so the new one can sweep in over the old
 *  (see the ::view-transition rules in index.css). Falls back to an instant
 *  swap where the API is missing or the visitor prefers reduced motion. */
function applyTheme(next: Theme) {
  const doc = document as ViewTransitionDoc
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !doc.startViewTransition) {
    commitTheme(next)
    return
  }
  // Tags <html> so the CSS can orient the wipe (light in vs dark in).
  doc.documentElement.dataset.themeSwitch = next
  const transition = doc.startViewTransition(() => commitTheme(next))
  // Send the critter sprinting in with the new palette once the wipe is
  // painted (the view-transition layer sits on top mid-wipe, so the chaser
  // rides the fresh theme rather than fighting the overlay). See ThemeWipeChaser.
  transition.finished
    .then(() => {
      window.dispatchEvent(new CustomEvent('theme-wipe', { detail: { to: next } }))
    })
    .finally(() => {
      delete doc.documentElement.dataset.themeSwitch
    })
}

const currentTheme = (): Theme =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('light')
    ? 'light'
    : 'dark'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('commands')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const prefersReduced = useReducedMotion()

  const close = () => setOpen(false)

  const commands = useMemo<Command[]>(() => {
    // The critter's calendar — picking a day dresses the footer walker in
    // that day's outfit (FooterWalker listens for `critter-dress`).
    if (view === 'days') {
      return SEASONAL_DAYS.map((d) => ({
        id: `day-${d.slug}`,
        label: d.label,
        hint: `${MONTHS[d.month - 1]} ${d.day}`,
        keywords: `${d.slug.replace(/-/g, ' ')} ${MONTHS[d.month - 1]}`,
        run: () => {
          window.dispatchEvent(
            new CustomEvent('critter-dress', { detail: { slug: d.slug } }),
          )
        },
      }))
    }

    const jump = (id: string) => {
      // On /blogs the sections don't exist — go home with the anchor.
      if (window.location.pathname.replace(/\/+$/, '') !== '') {
        window.location.href = `/#${id}`
        return
      }
      document.getElementById(id)?.scrollIntoView()
    }
    const github = socials.find((s) => s.label === 'GitHub')
    const linkedin = socials.find((s) => s.label === 'LinkedIn')

    return [
      {
        id: 'hire',
        label: 'hire me',
        hint: 'email',
        keywords: 'contact mail work job open',
        run: () => {
          window.location.href = `mailto:${contact.email}`
        },
      },
      {
        id: 'copy-email',
        label: 'copy email',
        hint: 'copy',
        keywords: 'clipboard address contact',
        run: () => {
          navigator.clipboard?.writeText(contact.email).catch(() => {})
          return 'keep-open'
        },
      },
      {
        id: 'resume',
        label: 'résumé',
        hint: '↗',
        keywords: 'cv resume pdf download',
        run: () => {
          window.open(resume.href, '_blank', 'noopener')
        },
      },
      {
        id: 'theme',
        label: theme === 'light' ? 'switch to dark' : 'switch to light',
        hint: theme === 'light' ? 'dark' : 'light',
        keywords: 'theme mode appearance colour color toggle dark light',
        run: () => {
          const next: Theme = theme === 'light' ? 'dark' : 'light'
          applyTheme(next)
          setTheme(next)
        },
      },
      {
        id: 'pet',
        label: 'release the critters',
        hint: '✦',
        keywords: 'pet mascot critter parade egg fun',
        run: () => {
          window.dispatchEvent(new CustomEvent('critter-parade'))
        },
      },
      {
        id: 'calendar',
        label: 'critter calendar',
        hint: '›',
        keywords: 'show me days seasonal holidays special outfits dress mascot',
        run: () => {
          setView('days')
          setQuery('')
          setSelected(0)
          return 'submenu'
        },
      },
      ...chapters.map((c) => ({
        id: c.id,
        label: `go to ${c.label.toLowerCase()}`,
        hint: c.index,
        keywords: `jump section chapter ${c.label}`,
        run: () => jump(c.id),
      })),
      {
        id: 'blogs',
        label: 'go to blogs',
        hint: '↗',
        keywords: 'blog essays writing posts notes',
        run: () => {
          window.location.href = '/blogs'
        },
      },
      {
        id: 'changelog',
        label: 'changelog',
        hint: CURRENT_VERSION,
        keywords: 'version history releases updates whats new',
        run: () => {
          window.location.href = '/changelog'
        },
      },
      ...(github
        ? [
            {
              id: 'github',
              label: 'github',
              hint: '↗',
              keywords: 'code repos open source',
              run: () => {
                window.open(github.href, '_blank', 'noopener')
              },
            },
          ]
        : []),
      ...(linkedin
        ? [
            {
              id: 'linkedin',
              label: 'linkedin',
              hint: '↗',
              keywords: 'profile network',
              run: () => {
                window.open(linkedin.href, '_blank', 'noopener')
              },
            },
          ]
        : []),
    ]
  }, [theme, view])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.keywords}`.toLowerCase().includes(q),
    )
  }, [commands, query])

  // ⌘K / Ctrl+K toggles from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Reset, focus the prompt, lock scroll, and remember where focus came from.
  useEffect(() => {
    if (!open) return
    setView('commands')
    setQuery('')
    setSelected(0)
    setCopied(false)
    setTheme(currentTheme()) // sync in case the OS/theme changed since last open
    returnFocusRef.current = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  // Keep the highlighted row in view as the selection moves by keyboard —
  // otherwise arrowing past the fold hides it under the scroll container.
  useEffect(() => {
    if (!open) return
    const id = results[selected]?.id
    if (!id) return
    document
      .getElementById(`palette-${id}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [selected, open, results])

  const runCommand = (cmd: Command) => {
    const outcome = cmd.run()
    if (outcome === 'keep-open') {
      // Copy feedback: swap the row's label for a beat, then dissolve.
      setCopied(true)
      setTimeout(close, 900)
    } else if (outcome !== 'submenu') {
      close()
    }
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      // From the calendar, Escape steps back to the commands first.
      if (view === 'days') {
        setView('commands')
        setQuery('')
        setSelected(0)
      } else {
        close()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selected]) runCommand(results[selected])
    } else if (e.key === 'Tab') {
      // The prompt is the only focusable — keep focus on it.
      e.preventDefault()
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: easeOut }}
              onClick={close}
            />
            <div className="pointer-events-none fixed inset-x-0 top-[16vh] z-[85] flex justify-center px-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                className="pointer-events-auto w-full max-w-lg overflow-hidden border border-white/10 bg-ink/70 shadow-2xl shadow-black/40 backdrop-blur-2xl backdrop-saturate-150"
                initial={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }
                }
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                {/* Prompt row */}
                <div className="flex items-center gap-3 border-b border-white/10 px-4">
                  <span aria-hidden className="font-mono text-sm text-accent">
                    ❯
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelected(0)
                    }}
                    onKeyDown={onInputKeyDown}
                    placeholder={
                      view === 'days' ? 'search the days…' : 'type a command…'
                    }
                    aria-label="Search commands"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="palette-list"
                    aria-activedescendant={
                      results[selected]
                        ? `palette-${results[selected].id}`
                        : undefined
                    }
                    className="w-full bg-transparent py-3.5 font-mono text-sm text-fg placeholder:text-fg-faint focus:outline-none"
                  />
                </div>

                {/* Results */}
                <ul
                  id="palette-list"
                  role="listbox"
                  aria-label="Commands"
                  className="max-h-72 overflow-y-auto py-1"
                >
                  {results.length === 0 && (
                    <li className="px-4 py-6 font-mono text-sm text-fg-faint">
                      {view === 'days'
                        ? "no such day — try 'bee'."
                        : "nothing matches — try 'hire'."}
                    </li>
                  )}
                  {results.map((cmd, i) => {
                    const isSelected = i === selected
                    const showCopied = copied && cmd.id === 'copy-email'
                    return (
                      <li
                        key={cmd.id}
                        id={`palette-${cmd.id}`}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setSelected(i)}
                        onClick={() => runCommand(cmd)}
                        className={`flex cursor-pointer items-baseline justify-between gap-6 px-4 py-2.5 font-mono text-[13px] transition-colors ${
                          isSelected
                            ? 'bg-fg/[0.08] text-fg'
                            : 'text-fg-muted'
                        }`}
                      >
                        <span
                          className={showCopied ? 'text-accent' : undefined}
                        >
                          {showCopied ? 'copied — talk soon.' : cmd.label}
                        </span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wider text-fg-faint">
                          {cmd.hint}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {/* Hint bar — with the palette pet keeping an eye on the list.
                    Its pupils follow the highlighted row; an empty result set
                    gets a baffled squint-and-tilt. */}
                <div
                  aria-hidden
                  className="flex items-center justify-between border-t border-white/10 px-4 py-2"
                >
                  <div className="flex gap-5 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                    <span>↑↓ move</span>
                    <span>↵ {view === 'days' ? 'dress it' : 'run'}</span>
                    <span>esc {view === 'days' ? 'back' : 'close'}</span>
                  </div>
                  <Critter
                    size={22}
                    blink
                    eyes={results.length === 0 ? 'squint' : 'open'}
                    look={{
                      x: -1.5,
                      y:
                        results.length > 1
                          ? (selected / (results.length - 1)) * 3 - 1.5
                          : 0,
                    }}
                    className={`transition-transform duration-300 ${
                      results.length === 0 ? '-rotate-12' : ''
                    }`}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
