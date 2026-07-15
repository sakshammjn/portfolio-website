import { useEffect, useRef, useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { easeOut } from '@/lib/motion'

/**
 * Select-to-act inside the reader. Highlight any text in the article and a
 * small popover appears above it with two tools:
 *
 *  - Define — for a single word, look it up (dictionaryapi.dev, keyless) and
 *    show the definition inline.
 *  - Copy link — copy a URL with a native text fragment (#:~:text=…) that
 *    scrolls a visitor straight to that sentence.
 *
 * Purely additive: no selection, no popover. Dismisses on scroll, empty
 * selection, or outside click. Definition failures degrade to a quiet note.
 */

interface Sel {
  text: string
  x: number // viewport px, centre of selection
  y: number // viewport px, top of selection
}
type Def =
  | { state: 'loading'; word: string }
  | { state: 'ok'; word: string; pos?: string; text: string }
  | { state: 'none'; word: string }

export function SelectionTools({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>
}) {
  const [sel, setSel] = useState<Sel | null>(null)
  const [def, setDef] = useState<Def | null>(null)
  const [copied, setCopied] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const capture = () => {
      // Let clicks land inside our own popover without dismissing.
      const s = window.getSelection()
      if (!s || s.isCollapsed) return
      const text = s.toString().trim()
      if (!text || text.length > 240) return
      const node = s.anchorNode
      if (!node || !containerRef.current?.contains(node)) return
      const rect = s.getRangeAt(0).getBoundingClientRect()
      if (!rect.width && !rect.height) return
      setSel({ text, x: rect.left + rect.width / 2, y: rect.top })
      setDef(null)
      setCopied(false)
    }

    const onDown = (e: MouseEvent) => {
      if (popRef.current?.contains(e.target as Node)) return
      // A fresh click outside the popover clears any existing popover;
      // the following mouseup re-opens it if a new selection was made.
      setSel(null)
      setDef(null)
    }
    const onUp = () => window.setTimeout(capture, 0)
    const dismiss = () => {
      setSel(null)
      setDef(null)
    }

    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    window.addEventListener('scroll', dismiss, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      window.removeEventListener('scroll', dismiss)
    }
  }, [containerRef])

  const define = async (word: string) => {
    setDef({ state: 'loading', word })
    try {
      const r = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      )
      if (!r.ok) throw new Error('not found')
      const data = await r.json()
      const meaning = data?.[0]?.meanings?.[0]
      const text = meaning?.definitions?.[0]?.definition
      if (!text) throw new Error('no definition')
      setDef({ state: 'ok', word, pos: meaning?.partOfSpeech, text })
    } catch {
      setDef({ state: 'none', word })
    }
  }

  const copyLink = (text: string) => {
    const url = `${location.origin}${location.pathname}#:~:text=${encodeURIComponent(text)}`
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const singleWord = sel ? /^[A-Za-z][A-Za-z'-]*$/.test(sel.text) : false

  return (
    <AnimatePresence>
      {sel && (
        <motion.div
          ref={popRef}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.16, ease: easeOut }}
          className="fixed z-[90] -translate-x-1/2 -translate-y-full"
          style={{
            left: Math.min(Math.max(sel.x, 120), window.innerWidth - 120),
            top: sel.y - 10,
          }}
        >
          <div className="w-max max-w-xs border border-white/10 bg-ink/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {!def ? (
              <div className="flex items-stretch divide-x divide-white/10 font-mono text-[11px] uppercase tracking-[0.15em]">
                {singleWord && (
                  <button
                    type="button"
                    onClick={() => define(sel.text)}
                    className="px-3.5 py-2.5 text-fg-muted transition-colors hover:text-accent"
                  >
                    Define
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copyLink(sel.text)}
                  className="px-3.5 py-2.5 text-fg-muted transition-colors hover:text-accent"
                >
                  {copied ? 'Copied ✓' : 'Copy link'}
                </button>
              </div>
            ) : (
              <div className="px-4 py-3">
                <p className="font-mono text-xs lowercase tracking-wide text-accent">
                  {def.word}
                  {def.state === 'ok' && def.pos && (
                    <span className="ml-2 text-fg-faint">· {def.pos}</span>
                  )}
                </p>
                <p className="mt-1.5 text-sm leading-snug text-fg-muted">
                  {def.state === 'loading'
                    ? 'looking it up…'
                    : def.state === 'ok'
                      ? def.text
                      : 'no definition found.'}
                </p>
              </div>
            )}
          </div>
          {/* little pointer */}
          <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-white/10 bg-ink/90" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
