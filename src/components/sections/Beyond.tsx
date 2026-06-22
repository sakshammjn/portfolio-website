import { hobbies } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/ui/Reveal'

export function Beyond() {
  return (
    <TimelineItem id="beyond" label="Beyond Code" side="right">
      <SectionHeading
        eyebrow="06 — Beyond Code"
        title="The person behind the commits"
      />

      <div className="space-y-5">
        {hobbies.map((h, i) => (
          <Reveal key={h.id} delay={i * 0.06}>
            <GlassCard interactive>
              <div className="flex items-start gap-4">
                <span className="text-2xl" aria-hidden>
                  {h.emoji}
                </span>
                <div>
                  <h3 className="font-display text-lg text-fg">{h.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                    {h.detail}
                  </p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </TimelineItem>
  )
}
