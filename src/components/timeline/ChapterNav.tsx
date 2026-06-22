import { chapters } from '@/data/content'
import { useActiveSection } from '@/hooks/useActiveSection'

const ids = chapters.map((c) => c.id)

/**
 * The fixed "metro map" of the visitor's position in the journey.
 * Desktop only — on mobile the spine + headings carry the navigation.
 */
export function ChapterNav() {
  const active = useActiveSection(ids)

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-4">
        {chapters.map((c) => {
          const isActive = c.id === active
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={[
                    'font-mono text-xs tracking-wide transition-all duration-300',
                    isActive
                      ? 'text-fg opacity-100'
                      : 'text-fg-muted opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                  ].join(' ')}
                >
                  <span className="text-fg-faint">{c.index}</span> {c.label}
                </span>
                <span
                  className={[
                    'h-2 w-2 shrink-0 rounded-full transition-all duration-300',
                    isActive
                      ? 'scale-125 bg-accent shadow-[0_0_12px_2px] shadow-accent/50'
                      : 'bg-fg-faint group-hover:bg-fg',
                  ].join(' ')}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
