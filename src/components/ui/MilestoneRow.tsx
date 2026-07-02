import type { TimelineCard } from '@/data/content'
import { Tag } from './Tag'
import { WorkDuration } from './WorkDuration'

const ArrowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
  >
    <path
      d="M3 11L11 3M11 3H5M11 3V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * One narrative milestone as an editorial row: a mono period in the left
 * column, the title/body in the right — divided from its neighbours by a
 * hairline rule instead of sitting in a card.
 */
export function MilestoneRow({ card }: { card: TimelineCard }) {
  return (
    <article className="group border-t border-line py-8 sm:py-10">
      <div className="grid gap-x-12 gap-y-4 sm:grid-cols-[12rem_1fr]">
        <div className="font-mono text-xs uppercase tracking-[0.15em] text-fg-faint sm:whitespace-nowrap">
          {card.period}
          {card.since && <WorkDuration since={card.since} />}
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
          {card.link && (
            <div className="mt-6">
              <a
                href={card.link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-muted transition-colors hover:text-accent"
              >
                {card.link.label} <ArrowIcon />
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
