import type { TimelineCard } from '@/data/content'
import { GlassCard } from './GlassCard'
import { Tag } from './Tag'

/** Renders a single narrative milestone (education / experience / global). */
export function MilestoneCard({ card }: { card: TimelineCard }) {
  return (
    <GlassCard interactive>
      <div className="flex flex-col gap-1">
        {card.period && (
          <span className="font-mono text-xs text-fg-faint">{card.period}</span>
        )}
        <h3 className="font-display text-xl text-fg sm:text-2xl">{card.title}</h3>
        {card.subtitle && (
          <p className="text-sm font-medium text-accent">{card.subtitle}</p>
        )}
      </div>

      <p className="mt-4 leading-relaxed text-fg-muted">{card.description}</p>

      {card.tags && card.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {card.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}
    </GlassCard>
  )
}
