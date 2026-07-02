import { Brand } from '@/components/layout/Brand'
import { Footer } from '@/components/layout/Footer'
import { ClickSpark } from '@/components/effects/ClickSpark'
import { TabTease } from '@/components/effects/TabTease'
import { LoadingSplash } from '@/components/effects/LoadingSplash'
import { Hero } from '@/components/sections/Hero'
import { Experience } from '@/components/sections/Experience'
import { OpenSource } from '@/components/sections/OpenSource'
import { Projects } from '@/components/sections/Projects'
import { Global } from '@/components/sections/Global'
import { Achievements } from '@/components/sections/Achievements'
import { Education } from '@/components/sections/Education'
import { Contact } from '@/components/sections/Contact'

export default function App() {
  return (
    <>
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#experience"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
      >
        Skip to content
      </a>

      <LoadingSplash />
      <ClickSpark />
      <TabTease />
      <Brand />

      <main>
        <Hero />

        {/* The journey — each chapter is a full-width editorial band */}
        <Experience />
        <OpenSource />
        <Projects />
        <Global />
        <Achievements />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
