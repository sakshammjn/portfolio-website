import { contact, socials } from '@/data/content'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The closing chapter — a full-bleed inverted band (ink text on the fg
 * surface) that mirrors the hero's bottom half, bookending the page.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="scroll-mt-24 bg-fg px-6 py-28 text-ink sm:py-36"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-ink/50">
            The journey continues
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-hero text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl">
            Let's build
            <br />
            something <span className="text-accent">amazing...</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink/70">
            {contact.blurb}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={`mailto:${contact.email}`}
            className="link-underline mt-10 inline-block font-hero text-2xl font-bold text-ink sm:text-4xl"
          >
            {contact.email}
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink/60 transition-colors hover:text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40 transition-colors group-hover:bg-accent" />
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
