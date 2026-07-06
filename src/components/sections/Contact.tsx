import { Fragment } from 'react'
import { contact, resume, socials } from '@/data/content'
import { Reveal } from '@/components/ui/Reveal'
import { LastShipped } from '@/components/ui/LastShipped'
import { LocalTime } from '@/components/ui/LocalTime'

/**
 * The closing band — inverted paper surface with the three-voice headline,
 * the email as the hero CTA, the classic socials row, and a live status strip.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="scroll-mt-24 bg-fg px-6 py-12 text-ink sm:py-18"
    >
      <div className="mx-auto max-w-5xl">
        {/* Headline — three voices of the same sentence. */}
        <Reveal delay={0.05}>
          <h2 className="text-center font-hero text-[clamp(2.5rem,9vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Let's build
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">
              something
            </span>{' '}
            <span className="text-accent">amazing...</span>
          </h2>
        </Reveal>

        {/* Email CTA */}
        <Reveal delay={0.1}>
          <div className="mt-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink/40">
              Drop a line — replies within a day
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-block max-w-full break-all border-b-4 border-accent pb-2 font-hero text-[clamp(1.15rem,3.2vw,2.25rem)] font-bold leading-tight text-ink transition-colors hover:text-accent"
            >
              {contact.email}
            </a>
          </div>
        </Reveal>

        {/* Socials — the classic dot-row, with the live time line beneath. */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
              <a
                href={resume.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink/60 transition-colors hover:text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40 transition-colors group-hover:bg-accent" />
                {resume.label}
              </a>
              {/* Email is omitted — the big address above is the email CTA.
                  The live "shipped" line rides beside the GitHub link. */}
              {socials.filter((s) => s.label !== 'Email').map((s) => (
                <Fragment key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink/60 transition-colors hover:text-accent"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-ink/40 transition-colors group-hover:bg-accent" />
                    {s.label}
                  </a>
                  {s.label === 'GitHub' && <LastShipped />}
                </Fragment>
              ))}
            </div>
            <LocalTime />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
