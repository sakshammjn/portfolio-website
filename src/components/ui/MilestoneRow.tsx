import type { TimelineCard } from '@/data/content'
import { Tag } from './Tag'

/**
 * One narrative milestone as an editorial row: a mono period in the left
 * column, the title/body in the right — divided from its neighbours by a
 * hairline rule instead of sitting in a card.
 */
export function MilestoneRow({ card }: { card: TimelineCard }) {
  return (
    <article className="group border-t border-line py-8 sm:py-10">
      <div className="grid gap-x-12 gap-y-4 sm:grid-cols-[10rem_1fr]">
        <div className="font-mono text-xs uppercase tracking-[0.15em] text-fg-faint">
          {card.period}
        </div>
        <div>
          <h3 className="font-hero text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {card.title}
          </h3>
          {card.subtitle && (
            <p className="mt-2 font-mono text-sm text-accent">{card.subtitle}</p>
          )}
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            {card.description}
          </p>
          {card.tags && card.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {card.tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
