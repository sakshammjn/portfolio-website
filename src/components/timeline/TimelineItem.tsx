import type { ReactNode } from 'react'
import { TimelineNode } from './TimelineNode'

interface TimelineItemProps {
  id: string
  /** Accessible label for the section landmark. */
  label: string
  /** Which side of the spine the content sits on (desktop only). */
  side?: 'left' | 'right'
  /** When true, content spans a wide centred column instead of alternating. */
  wide?: boolean
  children: ReactNode
}

/**
 * One milestone in the journey: a node anchored to the spine, with content
 * placed on alternating sides (desktop) or in a single left rail (mobile).
 */
export function TimelineItem({
  id,
  label,
  side = 'left',
  wide = false,
  children,
}: TimelineItemProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className="relative scroll-mt-28 pb-[var(--spacing-chapter)] pl-16 lg:pl-0"
    >
      <TimelineNode />

      {wide ? (
        <div className="lg:mx-auto lg:max-w-4xl lg:pt-1">{children}</div>
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-20">
          <div
            className={
              side === 'left'
                ? 'lg:col-start-1 lg:row-start-1 lg:pr-6'
                : 'lg:col-start-2 lg:row-start-1 lg:pl-6'
            }
          >
            {children}
          </div>
        </div>
      )}
    </section>
  )
}
