import { gsoc, ossContributions, ossRepos } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { ContribGraph } from '@/components/ui/ContribGraph'
import { Reveal } from '@/components/ui/Reveal'

const ArrowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
  >
    <path
      d="M3 11L11 3M11 3H5M11 3V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function OpenSource() {
  const isProposalLive = gsoc.proposalUrl.startsWith('http')

  return (
    <Chapter
      id="opensource"
      index="03"
      label="Open Source"
      lede="Shipping fixes to a tool I use — and a GSoC 2026 proposal to go deeper."
    >
      {/* The headline — the GSoC proposal, told in the milestone voice. */}
      <Reveal>
        <article className="border-t border-line py-8 sm:py-10">
          <div className="grid gap-x-12 gap-y-4 sm:grid-cols-[12rem_1fr]">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-fg-faint">
              GSoC 2026
            </div>
            <div>
              <h3 className="font-hero text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                {gsoc.project}
              </h3>
              <p className="mt-2 font-mono text-sm text-accent">
                <a
                  href={gsoc.studioUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline"
                >
                  {gsoc.org}
                </a>
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
                {gsoc.blurb}
              </p>
              <div className="mt-6">
                <a
                  href={gsoc.proposalUrl}
                  target={isProposalLive ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-muted transition-colors hover:text-accent"
                >
                  Read the full proposal <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </article>
      </Reveal>

      {/* Contributions — each row pairs the issue that reported a bug with the
          PR that fixed it. Divided by hairline rules, no cards. */}
      <Reveal delay={0.05}>
        <p className="mb-1 mt-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
          Issues filed · fixes shipped
        </p>
      </Reveal>
      <ol>
        {ossContributions.map((c, i) => {
          const base = ossRepos[c.repo]
          return (
            <Reveal as="li" key={c.id} delay={i * 0.04}>
              <div className="flex flex-col gap-2 border-t border-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-hero text-sm font-bold leading-none text-fg-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-hero text-lg font-semibold tracking-tight text-fg sm:text-xl">
                    {c.title}
                  </h4>
                </div>
                <div className="flex shrink-0 items-center gap-5 pl-8 font-mono text-xs uppercase tracking-wider sm:pl-0">
                  {c.issue && (
                    <a
                      href={`${base}/issues/${c.issue}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-fg-faint transition-colors hover:text-accent"
                    >
                      Issue #{c.issue}
                    </a>
                  )}
                  {c.pr && (
                    <a
                      href={`${base}/pull/${c.pr}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group/link inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
                    >
                      PR #{c.pr}
                      {c.merged && <span className="text-accent">· merged</span>}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          )
        })}
      </ol>

      {/* Closing stat — mirrors the Education highlight. */}
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-8">
          <span className="font-hero text-3xl font-bold tracking-tight text-accent sm:text-4xl">
            {String(ossContributions.length).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
            bugs found · filed · fixed
          </span>
        </div>
      </Reveal>

      {/* A year of commits as quiet ember texture, closing the chapter. */}
      <Reveal delay={0.15}>
        <ContribGraph />
      </Reveal>
    </Chapter>
  )
}
