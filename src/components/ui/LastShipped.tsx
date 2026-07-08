import { relative, useLastShipped } from '@/lib/useLastShipped'

/**
 * The live "/ shipped Xm ago" suffix riding the GitHub link in the contact
 * dot-row — quiet proof the shipping never stopped. Time only; the link
 * quietly points at the repo it landed in without naming it.
 *
 * Renders nothing until the data is in, and stays gone on any failure —
 * the row must never show a broken state.
 */
export function LastShipped() {
  const shipped = useLastShipped()

  if (!shipped) return null

  return (
    <a
      href={shipped.url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 font-mono text-[15px] uppercase tracking-wide text-fg-faint transition-colors hover:text-accent"
    >
      {/* Accent slash — ties the suffix to the GitHub link it follows. */}
      <span aria-hidden className="text-accent">/</span>
      shipped {relative(shipped.at)}
    </a>
  )
}
