import { global } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { MilestoneRow } from '@/components/ui/MilestoneRow'

export function Global() {
  return (
    <Chapter
      id="global"
      index="04"
      label="Global Exposure"
      lede="Stepping beyond borders."
    >
      {global.map((card) => (
        <MilestoneRow key={card.id} card={card} />
      ))}
    </Chapter>
  )
}
