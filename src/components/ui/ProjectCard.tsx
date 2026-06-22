import type { Project } from '@/data/content'
import { GlassCard } from './GlassCard'
import { Tag } from './Tag'

const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <GlassCard interactive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-fg">{project.name}</h3>
          <p className="mt-1 text-sm text-accent">{project.tagline}</p>
        </div>
        {project.featured && (
          <span className="shrink-0 rounded-full border border-accent/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            Featured
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <Tag key={s} label={s} />
        ))}
      </div>

      {(project.repo || project.link) && (
        <div className="mt-5 flex gap-4 border-t border-line pt-4">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="group/link inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
            >
              Code <ArrowIcon />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="group/link inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
            >
              Live <ArrowIcon />
            </a>
          )}
        </div>
      )}
    </GlassCard>
  )
}
