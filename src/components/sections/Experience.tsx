import { experience } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MilestoneCard } from '@/components/ui/MilestoneCard'
import { Reveal } from '@/components/ui/Reveal'

export function Experience() {
  return (
    <TimelineItem id="experience" label="Professional Experience" side="left">
      <SectionHeading
        eyebrow="03 — Experience"
        title="Building in the real world"
      />

      <div className="space-y-6">
        {experience.map((card, i) => (
          <Reveal key={card.id} delay={i * 0.05}>
            <MilestoneCard card={card} />
          </Reveal>
        ))}
      </div>
    </TimelineItem>
  )
}
