import { about, resume } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Chapter 01 — a short, human intro. Built with the real Chapter component so
 * it wears the same `{ 01 } ABOUT` header as the rest. The left meta column
 * lists the roles and keeps the résumé within reach on the first scroll; the
 * content column carries the paragraph.
 */
export function About() {
  return (
    <Chapter id="about" index="01" label="About">
      <div className="grid gap-x-12 gap-y-8 sm:grid-cols-[12rem_1fr]">
        {/* Meta rail: roles, then the résumé as a bordered chip right beneath
            them — the same square-hairline language as the tag chips, so the
            column reads as one tidy block. */}
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.15em]">
            {about.roles.map((role) => (
              <p
                key={role}
                className="whitespace-nowrap text-fg-faint [&:not(:first-child)]:mt-2"
              >
                {role}
              </p>
            ))}
          </div>
          <a
            href={resume.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-6 inline-flex items-center gap-2 border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Résumé
            <span
              aria-hidden
              className="text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        </Reveal>

        {/* Paragraph. */}
        <Reveal>
          <p className="max-w-2xl text-lg leading-relaxed text-fg-muted">
            {about.body}
          </p>
        </Reveal>
      </div>
    </Chapter>
  )
}
