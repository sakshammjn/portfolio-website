import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface ChapterProps {
  id: string
  /** Two-digit chapter index, e.g. "01". */
  index: string
  /** Short section name, set big and uppercase. */
  label: string
  /** Optional supporting line beneath the title. */
  lede?: string
  children: ReactNode
}

/**
 * A full-width chapter that opens in the hero's voice: a `{ NN }` brace-wrapped
 * index beside a big uppercase Clash Display label, with a hairline rule
 * separating it from the chapter above. No cards, no spine — just type and
 * structure, matching the landing page.
 */
export function Chapter({ id, index, label, lede, children }: ChapterProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className="scroll-mt-24 border-t border-line px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 sm:mb-16">
          <Reveal>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-hero text-[clamp(2.75rem,12vw,4.5rem)] font-bold leading-none tracking-tight">
                <span className="text-accent">{'{'}</span>
                <span className="px-1.5 text-fg-faint sm:px-2.5">{index}</span>
                <span className="text-accent">{'}'}</span>
              </span>
              <h2 className="font-hero text-[clamp(1.85rem,9vw,3.75rem)] font-bold uppercase leading-none tracking-tight text-fg">
                {label}
              </h2>
            </div>
          </Reveal>
          {lede && (
            <Reveal delay={0.06}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
                {lede}
              </p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
