import { projects } from '@/data/content'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'

export function Projects() {
  return (
    <TimelineItem id="projects" label="Projects" wide>
      <SectionHeading
        eyebrow="04 — Projects"
        title="Things I've built"
        lede="A few of the projects where ideas turned into working software."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </TimelineItem>
  )
}
