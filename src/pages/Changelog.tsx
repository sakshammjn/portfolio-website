import { releases } from '@/data/changelog'
import { Brand } from '@/components/layout/Brand'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Footer } from '@/components/layout/Footer'
import { ClickSpark } from '@/components/effects/ClickSpark'
import { TabTease } from '@/components/effects/TabTease'
import { Critter } from '@/components/effects/Critter'
import { ThemeWipeChaser } from '@/components/effects/ThemeWipeChaser'
import { Reveal } from '@/components/ui/Reveal'

/**
 * /changelog — the site's own release history as an editorial ledger.
 * Version tag + date in the left column, release name and lowercase mono
 * notes on the right, hairline rules between releases — the same grammar as
 * the experience rows. The critter stands on the current release's rule.
 */
export function Changelog() {
  return (
    <>
      <ClickSpark />
      <TabTease />
      <Brand />
      <CommandPalette />
      <ThemeWipeChaser />

      <main className="mx-auto min-h-screen max-w-5xl px-6 pb-24 pt-28 sm:pt-36">
        <header className="mb-8 sm:mb-10">
          <h1 className="font-hero text-5xl font-bold uppercase leading-none tracking-tight text-fg sm:text-7xl">
            <span aria-hidden className="text-accent">
              {'{'}
            </span>
            <span className="px-2 sm:px-4">changelog</span>
            <span aria-hidden className="text-accent">
              {'}'}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            The site, version by version.
          </p>
        </header>

        <ol>
          {releases.map((r, i) => (
            <Reveal as="li" key={r.version} delay={i * 0.04}>
              <article className="relative grid gap-x-10 gap-y-3 border-t border-line py-8 sm:grid-cols-[8rem_1fr] sm:py-10">
                {/* The critter keeps watch over the current release. */}
                {i === 0 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-2 top-0 -translate-y-full"
                  >
                    <Critter size={30} gaze blink />
                  </div>
                )}
                <div>
                  <div className="font-mono text-sm font-medium text-accent">
                    {r.version}
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                    {r.date}
                  </div>
                </div>
                <div>
                  <h2 className="font-hero text-2xl font-bold uppercase tracking-tight text-fg sm:text-3xl">
                    {r.name}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {r.notes.map((note) => (
                      <li
                        key={note}
                        className="flex gap-3 font-mono text-[13px] leading-relaxed text-fg-muted"
                      >
                        <span aria-hidden className="shrink-0 text-accent">
                          ·
                        </span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <div className="border-t border-line pt-8">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-muted transition-colors hover:text-accent"
          >
            Back to the portfolio <span aria-hidden>→</span>
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
