import { achievements } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/ui/Reveal'

export function Achievements() {
  return (
    <TimelineItem id="achievements" label="Achievements" wide>
      <SectionHeading
        eyebrow="05 — Achievements"
        title="Moments that mattered"
        align="center"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.06}>
            <GlassCard interactive className="h-full">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg text-fg">{a.title}</h3>
                {a.year && (
                  <span className="shrink-0 font-mono text-xs text-fg-faint">
                    {a.year}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {a.detail}
              </p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </TimelineItem>
  )
}
