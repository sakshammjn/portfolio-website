interface TagProps {
  label: string
}

/** A small pill used for skills and tech-stack chips. */
export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-white/[0.02] px-3 py-1 font-mono text-xs text-fg-muted">
      {label}
    </span>
  )
}
