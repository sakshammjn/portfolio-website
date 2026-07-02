import { experience } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { MilestoneRow } from '@/components/ui/MilestoneRow'

export function Experience() {
  return (
    <Chapter
      id="experience"
      index="01"
      label="Experience"
      lede="Building in the real world."
    >
      {experience.map((card) => (
        <MilestoneRow key={card.id} card={card} />
      ))}
    </Chapter>
  )
}
