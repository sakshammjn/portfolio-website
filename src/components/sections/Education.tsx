import { education, educationHighlight } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { MilestoneRow } from '@/components/ui/MilestoneRow'
import { Reveal } from '@/components/ui/Reveal'

export function Education() {
  return (
    <Chapter
      id="education"
      index="07"
      label="Education"
      lede="Where the foundation was laid."
    >
      {education.map((card) => (
        <MilestoneRow key={card.id} card={card} />
      ))}

      {/* The headline number — a restrained, single-line stat. */}
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-8">
          <span className="font-hero text-3xl font-bold tracking-tight text-accent sm:text-4xl">
            {educationHighlight.metric}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
            {educationHighlight.metricLabel}
          </span>
          <span className="text-fg-muted">— {educationHighlight.caption}</span>
        </div>
      </Reveal>
    </Chapter>
  )
}
