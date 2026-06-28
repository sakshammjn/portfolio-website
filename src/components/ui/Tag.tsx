interface TagProps {
  label: string
}

/** A square, monospace tech chip — flat and structural, not a soft pill. */
export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-muted transition-colors hover:border-accent/50 hover:text-fg">
      {label}
    </span>
  )
}
