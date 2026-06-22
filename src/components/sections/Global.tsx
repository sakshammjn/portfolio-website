import { global } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MilestoneCard } from '@/components/ui/MilestoneCard'
import { Reveal } from '@/components/ui/Reveal'

export function Global() {
  return (
    <TimelineItem id="global" label="Global Exposure" side="right">
      <SectionHeading
        eyebrow="02 — Global Exposure"
        title="Stepping beyond borders"
      />

      <div className="space-y-6">
        {global.map((card) => (
          <Reveal key={card.id}>
            <MilestoneCard card={card} />
          </Reveal>
        ))}
      </div>
    </TimelineItem>
  )
}
