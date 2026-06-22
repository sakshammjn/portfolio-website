import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Adds an accent edge-glow on hover. */
  interactive?: boolean
}

/** A subtle glassmorphic surface — used sparingly, only where it adds depth. */
export function GlassCard({
  children,
  className = '',
  interactive = false,
}: GlassCardProps) {
  return (
    <div
      className={[
        'glass rounded-2xl p-6 sm:p-7',
        interactive
          ? 'transition-all duration-300 hover:border-accent/40 hover:-translate-y-1'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
