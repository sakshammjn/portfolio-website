import { achievements } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { Reveal } from '@/components/ui/Reveal'

export function Achievements() {
  return (
    <Chapter
      id="achievements"
      index="05"
      label="Achievements"
      lede="Moments that mattered."
    >
      {/* A framed grid: cells share the page background, so the gap-px gaps read
          as clean hairline dividers — a structural table rather than cards. */}
      <Reveal>
        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`bg-ink p-6 transition-colors hover:bg-surface sm:p-8 ${
                a.featured ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-hero text-lg font-bold tracking-tight text-fg">
                  {a.title}
                </h3>
                {a.year && (
                  <span className="shrink-0 font-mono text-xs text-fg-faint">
                    {a.year}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {a.detail}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Chapter>
  )
}
