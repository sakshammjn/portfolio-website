import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { contact, resume, socials } from '@/data/content'
import { LastShipped } from '@/components/ui/LastShipped'
import { LocalTime } from '@/components/ui/LocalTime'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The closing band — deliberately NOT a numbered chapter. It keeps the
 * chapters' hairline rule so the page stays one piece, but breaks their
 * layout: a two-column split, with a word-per-line display statement on the
 * left (solid caps → hollow caps → ember marker scrawl) and the contact
 * ledger stacked on the right — label over value, the live clock last.
 */

const LABEL_WRAP = 'flex items-center gap-2.5'
const LABEL =
  'font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint'
const VALUE =
  'font-mono text-base font-medium uppercase tracking-wide text-fg transition-colors group-hover:text-accent sm:text-lg'
const ICON =
  'h-4 w-4 shrink-0 text-fg-faint transition-colors group-hover:text-accent'
const ROW = 'group block border-t border-line py-5'

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

/* ── Minimal row glyphs — 2px strokes / flat brand marks, all currentColor. ── */

function MailIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={ICON}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={ICON}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={ICON}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={ICON}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={ICON}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

export function Contact() {
  const linkedin = socials.find((s) => s.label === 'LinkedIn')
  const github = socials.find((s) => s.label === 'GitHub')

  // The statement's words counter-slide into alignment (alternating sides),
  // scrubbed 1:1 by scroll as the statement rises through the viewport. The
  // window runs from the top entering low (start 0.9) until the block is
  // nearly centred (center 0.58) — a long, late window so the motion tracks
  // the scroll into the reading zone instead of finishing early. Both edges
  // are reachable at max scroll on every height (measured: desktop centre
  // bottoms out at ~0.52, so 0.58 completes just before the page end; a
  // section-bottom / `end end` key had stranded it half-done on tall mobile).
  const headRef = useRef<HTMLHeadingElement>(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: headRef,
    offset: ['start 0.9', 'center 0.58'],
  })
  const xLeft = useTransform(scrollYProgress, [0, 1], [-60, 0])
  const xRight = useTransform(scrollYProgress, [0, 1], [60, 0])
  const headOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const line = (x: typeof xLeft) =>
    prefersReduced ? undefined : { x, opacity: headOpacity }

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="scroll-mt-24 border-t border-line px-6 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* Left — the statement, one word per line: solid caps, hollow caps,
            then the ember marker scrawl signing off. */}
        <h2
          ref={headRef}
          className="font-hero text-[clamp(3rem,10vw,6.75rem)] font-bold uppercase leading-[0.85] tracking-tight text-fg"
        >
          <motion.span className="block" style={line(xLeft)}>
            Great
          </motion.span>
          <motion.span className="block" style={line(xRight)}>
            Work
          </motion.span>
          <motion.span
            className="block text-transparent [-webkit-text-stroke:2px_var(--color-fg)]"
            style={line(xLeft)}
          >
            Starts
          </motion.span>
          <motion.span
            className="block text-transparent [-webkit-text-stroke:2px_var(--color-fg)]"
            style={line(xRight)}
          >
            With
          </motion.span>
          <motion.span className="mt-3 block" style={line(xLeft)}>
            <span className="inline-block font-scrawl text-[0.72em] normal-case tracking-normal text-accent">
              a hello...
            </span>
          </motion.span>
        </h2>

        {/* Right — the contact ledger: label over value, arrow at the far
            edge of each row. */}
        <div>
          {/* Email */}
          <Reveal delay={0.1} until={0.9}>
            <a href={`mailto:${contact.email}`} className={ROW}>
              <span className={LABEL_WRAP}>
                <MailIcon />
                <span className={LABEL}>Email</span>
              </span>
              <span className="mt-3 flex items-center justify-between gap-4">
                <span className={`min-w-0 break-all ${VALUE}`}>
                  {contact.email}
                </span>
                <ArrowOut />
              </span>
            </a>
          </Reveal>

          {/* Résumé */}
          <Reveal delay={0.14} until={0.9}>
            <a
              href={resume.href}
              target="_blank"
              rel="noreferrer noopener"
              className={ROW}
            >
              <span className={LABEL_WRAP}>
                <FileIcon />
                <span className={LABEL}>Résumé</span>
              </span>
              <span className="mt-3 flex items-center justify-between gap-4">
                <span className={VALUE}>one page, no fluff — pdf</span>
                <ArrowOut />
              </span>
            </a>
          </Reveal>

          {/* LinkedIn */}
          <Reveal delay={0.18} until={0.9}>
            <a
              href={linkedin?.href}
              target="_blank"
              rel="noreferrer noopener"
              className={ROW}
            >
              <span className={LABEL_WRAP}>
                <LinkedInIcon />
                <span className={LABEL}>LinkedIn</span>
              </span>
              <span className="mt-3 flex items-center justify-between gap-4">
                <span className={VALUE}>{linkedin?.handle}</span>
                <ArrowOut />
              </span>
            </a>
          </Reveal>

          {/* GitHub — a div, not a link: the handle and the live "shipped"
              receipt are two separate anchors (nested <a> is illegal). */}
          <Reveal delay={0.22} until={0.9}>
            <div className={ROW}>
              <span className={LABEL_WRAP}>
                <GitHubIcon />
                <span className={LABEL}>GitHub</span>
              </span>
              <span className="mt-3 flex items-center justify-between gap-4">
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
                </span>
                <ArrowOut />
              </span>
            </div>
          </Reveal>

          {/* Local time — the ledger's closing entry; live, not a link. */}
          <Reveal delay={0.26} until={0.9}>
            <div className="block border-y border-line py-5">
              <span className={LABEL_WRAP}>
                <ClockIcon />
                <span className={LABEL}>Local time</span>
              </span>
              <span className="mt-3 block">
                <LocalTime />
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
