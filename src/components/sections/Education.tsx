import { education, educationHighlight } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MilestoneCard } from '@/components/ui/MilestoneCard'
import { Reveal } from '@/components/ui/Reveal'

export function Education() {
  return (
    <TimelineItem id="education" label="Education" side="left">
      <SectionHeading
        eyebrow="01 — Education"
        title="Where the foundation was laid"
      />

      <div className="space-y-6">
        {education.map((card) => (
          <Reveal key={card.id}>
            <MilestoneCard card={card} />
          </Reveal>
        ))}

        {/* The headline number, given room to breathe */}
        <Reveal delay={0.1}>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-6xl font-medium leading-none text-accent sm:text-7xl">
              {educationHighlight.metric}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-widest text-fg-faint">
                {educationHighlight.metricLabel}
              </span>
              <span className="text-sm text-fg-muted">
                {educationHighlight.caption}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </TimelineItem>
  )
}
