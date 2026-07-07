import { contact, resume, socials } from '@/data/content'
import { LastShipped } from '@/components/ui/LastShipped'
import { LocalTime } from '@/components/ui/LocalTime'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The closing band — inverted paper surface. Opens in the hero's voice
 * (kicker + three-voice headline), then closes as a compact ledger: every
 * way to reach Saksham set as ruled editorial rows — mono label column,
 * the real handle as the value, ember arrow riding right beside it — with
 * the live clock as the last entry. A colophon, not a footer.
 */

const LABEL =
  'w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/35'
const VALUE =
  'font-mono text-[15px] font-medium uppercase tracking-wide text-ink/80 transition-colors group-hover:text-accent'

/** Diagonal ember arrow for rows that leave the site. */
function ArrowOut() {
  return (
    <span
      aria-hidden
      className="shrink-0 font-hero text-lg leading-none text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      ↗
    </span>
  )
}

export function Contact() {
  const linkedin = socials.find((s) => s.label === 'LinkedIn')
  const github = socials.find((s) => s.label === 'GitHub')

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="scroll-mt-24 bg-fg px-6 py-12 text-ink sm:py-18"
    >
      <div className="mx-auto max-w-5xl">
        {/* Kicker + headline — the band still opens in the hero's voice. */}
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink/40">
            Drop a line — replies within a day
          </p>
        </Reveal>
        {/* Two lines: "LET'S BUILD" / "SOMETHING AMAZING..." — the clamp is
            capped at 5rem so the second line holds as one on desktop; it
            wraps gracefully only on very narrow phones. */}
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-hero text-[clamp(2rem,7vw,5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Let's build
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">
              something
            </span>{' '}
            <span className="text-accent">amazing...</span>
          </h2>
        </Reveal>

        {/* ── The ledger — arrows ride beside the values, rows stay tight. ── */}
        <div className="mt-10">
          {/* Email — the hero row, whole row clickable. */}
          <Reveal delay={0.1}>
            <a
              href={`mailto:${contact.email}`}
              className="group flex flex-col gap-1 border-t border-ink/15 py-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className={LABEL}>Email</span>
              <span className="flex min-w-0 items-center gap-4">
                <span className="min-w-0 break-all font-hero text-[clamp(1.3rem,3vw,2.5rem)] font-bold leading-tight tracking-tight transition-colors group-hover:text-accent">
                  {contact.email}
                </span>
                <span
                  aria-hidden
                  className="hidden shrink-0 font-hero text-2xl leading-none text-accent transition-transform duration-300 group-hover:translate-x-2 sm:block"
                >
                  →
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.14}>
            <a
              href={resume.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex flex-col gap-1 border-t border-ink/15 py-3 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className={LABEL}>Résumé</span>
              <span className="flex items-center gap-3">
                <span className={VALUE}>one page, no fluff — pdf</span>
                <ArrowOut />
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.18}>
            <a
              href={linkedin?.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex flex-col gap-1 border-t border-ink/15 py-3 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className={LABEL}>LinkedIn</span>
              <span className="flex items-center gap-3">
                <span className={VALUE}>{linkedin?.handle}</span>
                <ArrowOut />
              </span>
            </a>
          </Reveal>

          {/* GitHub — a div, not a link: the handle and the live "shipped"
              receipt are two separate anchors (nested <a> is illegal). */}
          <Reveal delay={0.22}>
            <div className="group flex flex-col gap-1 border-t border-ink/15 py-3 sm:flex-row sm:items-baseline sm:gap-8">
              <span className={LABEL}>GitHub</span>
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <a
                  href={github?.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={VALUE}
                >
                  {github?.handle}
                </a>
                <LastShipped />
                <ArrowOut />
              </span>
            </div>
          </Reveal>

          {/* Local time — the ledger's closing entry; live, not a link. */}
          <Reveal delay={0.26}>
            <div className="flex flex-col gap-1 border-y border-ink/15 py-3 sm:flex-row sm:items-baseline sm:gap-8">
              <span className={LABEL}>Local time</span>
              <LocalTime />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
