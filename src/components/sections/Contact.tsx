import { contact, socials } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { Reveal } from '@/components/ui/Reveal'

export function Contact() {
  return (
    <TimelineItem id="contact" label="Contact" wide noNode>
      <div className="text-center">
        <Reveal>
          <p className="eyebrow mb-4">07 — The journey continues</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
            Let's build something.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-md text-fg-muted">{contact.blurb}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <a
            href={`mailto:${contact.email}`}
            className="link-underline mt-8 inline-block font-display text-2xl text-fg sm:text-3xl"
          >
            {contact.email}
          </a>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 font-mono text-sm text-fg-muted transition-colors hover:text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-fg-faint transition-colors group-hover:bg-accent" />
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </TimelineItem>
  )
}
