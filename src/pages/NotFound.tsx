import { useEffect, useState } from 'react'
import { Brand } from '@/components/layout/Brand'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Footer } from '@/components/layout/Footer'
import { ClickSpark } from '@/components/effects/ClickSpark'
import { TabTease } from '@/components/effects/TabTease'
import { Critter } from '@/components/effects/Critter'
import { CritterParade } from '@/components/effects/CritterParade'
import { ThemeWipeChaser } from '@/components/effects/ThemeWipeChaser'

/**
 * The 404 — any path the tiny router doesn't know lands here instead of
 * silently showing the homepage. Kept simple: the path that failed, a big
 * brace-framed 404, the critter in its "not found" look (body vanished into a
 * dashed outline), and the two ways home.
 */
export function NotFound() {
  const [squint, setSquint] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = '404 — page not found'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      <ClickSpark />
      <TabTease />
      <Brand />
      <CommandPalette />
      <CritterParade />
      <ThemeWipeChaser />

      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-28 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-faint">
          {window.location.pathname} — no such page
        </p>

        <h1 className="mt-6 font-hero text-6xl font-bold uppercase leading-none tracking-tight text-fg sm:text-8xl">
          <span aria-hidden className="text-accent">
            {'{'}
          </span>
          <span className="px-3 sm:px-5">404</span>
          <span aria-hidden className="text-accent">
            {'}'}
          </span>
        </h1>

        <p className="mt-6 max-w-md leading-relaxed text-fg-muted">
          This page wandered off. The critter can't find it either.
        </p>

        <button
          type="button"
          aria-label="The critter, also lost"
          onClick={() => {
            setSquint(true)
            window.setTimeout(() => setSquint(false), 650)
          }}
          className="mt-12 cursor-pointer select-none"
        >
          <Critter
            size={56}
            prop="notfound"
            gaze
            blink
            eyes={squint ? 'squint' : 'open'}
          />
        </button>

        <div className="mt-14 flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-wider">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
          >
            Back to the portfolio <span aria-hidden>→</span>
          </a>
          <span className="text-fg-faint">
            or press <kbd className="text-fg-muted">⌘k</kbd> and go anywhere
          </span>
        </div>
      </main>

      <Footer walker={false} />
    </>
  )
}
