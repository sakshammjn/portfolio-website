import { Brand } from '@/components/layout/Brand'
import { Footer } from '@/components/layout/Footer'
import { ClickSpark } from '@/components/effects/ClickSpark'
import { ScrollProgress } from '@/components/timeline/ScrollProgress'
import { ChapterNav } from '@/components/timeline/ChapterNav'
import { Timeline } from '@/components/timeline/Timeline'
import { Hero } from '@/components/sections/Hero'
import { Education } from '@/components/sections/Education'
import { Global } from '@/components/sections/Global'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Achievements } from '@/components/sections/Achievements'
import { Beyond } from '@/components/sections/Beyond'
import { Contact } from '@/components/sections/Contact'

export default function App() {
  return (
    <>
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#education"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
      >
        Skip to content
      </a>

      <ClickSpark />
      <ScrollProgress />
      <Brand />
      <ChapterNav />

      <main>
        <Hero />

        {/* The journey — every chapter hangs off this single spine */}
        <Timeline>
          <Education />
          <Global />
          <Experience />
          <Projects />
          <Achievements />
          <Beyond />
          <Contact />
        </Timeline>
      </main>

      <Footer />
    </>
  )
}
