/** A small fixed wordmark in the top-left that returns to the top. */
export function Brand() {
  return (
    <a
      href="#intro"
      className="fixed left-6 top-5 z-40 font-display text-lg font-medium tracking-tight text-fg transition-opacity hover:opacity-70"
      aria-label="Saksham Mahajan — back to top"
    >
      SM<span className="text-accent">.</span>
    </a>
  )
}
