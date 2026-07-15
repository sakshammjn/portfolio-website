/**
 * A quiet contents list for longer posts — appears only when a post has two
 * or more sections. Numbered mono links that jump to each heading. Kept
 * inline at the top of the article so it works identically on every screen
 * size (no fixed scroll chrome, per the site's motion rule).
 */
export function TableOfContents({
  headings,
}: {
  headings: { id: string; text: string }[]
}) {
  if (headings.length < 2) return null
  return (
    <nav aria-label="Contents" className="my-10 border-y border-line py-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
        Contents
      </p>
      <ol className="flex flex-col gap-2">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="group inline-flex items-baseline gap-3 font-mono text-xs text-fg-muted transition-colors hover:text-accent"
            >
              <span className="text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="group-hover:translate-x-0.5 transition-transform">
                {h.text}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
