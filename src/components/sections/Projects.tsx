import { projects } from '@/data/content'
import { Chapter } from '@/components/ui/Chapter'
import { Tag } from '@/components/ui/Tag'
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

export function Projects() {
  return (
    <Chapter
      id="projects"
      index="04"
      label="Projects"
      lede="A few of the projects where ideas turned into working software."
    >
      <ol>
        {projects.map((project, i) => (
          <Reveal as="li" key={project.id} delay={i * 0.05}>
            <article className="group border-t border-line py-8 sm:py-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-5">
                  <span className="font-hero text-lg font-bold leading-none text-fg-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-hero text-2xl font-bold tracking-tight text-fg transition-colors group-hover:text-accent sm:text-3xl">
                      {project.name}
                    </h3>
                    <p className="mt-1.5 text-fg-muted">{project.tagline}</p>
                  </div>
                </div>
                {project.featured && (
                  <span className="w-fit shrink-0 border border-accent/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                    Featured
                  </span>
                )}
              </div>

              <div className="sm:pl-[2.75rem]">
                <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <Tag key={s} label={s} />
                  ))}
                </div>

                {(project.repo || project.link) && (
                  <div className="mt-6 flex gap-6">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-muted transition-colors hover:text-accent"
                      >
                        Code <ArrowIcon />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-muted transition-colors hover:text-accent"
                      >
                        {project.link.label} <ArrowIcon />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Chapter>
  )
}
