import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '@/lib/motion'
import { contact, resume, socials } from '@/data/content'

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
  { id: 'experience', label: 'Experience', index: '01' },
  { id: 'opensource', label: 'Open Source', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'global', label: 'Global Exposure', index: '04' },
  { id: 'achievements', label: 'Achievements', index: '05' },
  { id: 'education', label: 'Education', index: '06' },
  { id: 'contact', label: 'Contact', index: '{ }' },
]

interface Command {
  id: string
  label: string
  /** Small right-aligned mono hint (chapter number, ↗, …). */
  hint: string
  /** Extra match terms beyond the label. */
  keywords: string
  /** Return 'keep-open' to show feedback instead of closing (e.g. copy). */
  run: () => void | 'keep-open'
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const prefersReduced = useReducedMotion()

  const close = () => setOpen(false)

  const commands = useMemo<Command[]>(() => {
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
        hint: '→',
        keywords: 'blog essays writing posts notes',
        run: () => {
          window.location.href = '/blogs'
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
  }, [])

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
    setQuery('')
    setSelected(0)
    setCopied(false)
    returnFocusRef.current = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  const runCommand = (cmd: Command) => {
    if (cmd.run() === 'keep-open') {
      // Copy feedback: swap the row's label for a beat, then dissolve.
      setCopied(true)
      setTimeout(close, 900)
    } else {
      close()
    }
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
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
              className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm"
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
                    placeholder="type a command…"
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
                      nothing matches — try 'hire'.
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
                            ? 'bg-white/[0.07] text-fg'
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

                {/* Hint bar */}
                <div
                  aria-hidden
                  className="flex gap-5 border-t border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-faint"
                >
                  <span>↑↓ move</span>
                  <span>↵ run</span>
                  <span>esc close</span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
