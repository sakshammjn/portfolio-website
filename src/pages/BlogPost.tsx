import { useEffect, useRef } from 'react'
import { blogPosts, type BlogPost } from '@/data/content'
import { Brand } from '@/components/layout/Brand'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Footer } from '@/components/layout/Footer'
import { ClickSpark } from '@/components/effects/ClickSpark'
import { TabTease } from '@/components/effects/TabTease'
import { ThemeWipeChaser } from '@/components/effects/ThemeWipeChaser'
import { Markdown, getHeadings, toPlainText } from '@/lib/markdown'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ReadAloud } from '@/components/blog/ReadAloud'
import { SelectionTools } from '@/components/blog/SelectionTools'
import { Subscribe } from '@/components/blog/Subscribe'

/**
 * The native blog reader — a hand-built, dependency-free reading view at
 * /blogs/<slug>, in the site's editorial voice. Renders Markdown to real
 * nodes, with a contents list for long posts, a copy/anchor on each heading,
 * read-aloud, select-to-define / copy-a-line, and the critter reading along
 * the bottom edge. Prev/next posts close it out.
 */
/** A hand-drawn ember wave — the visual full stop before the subscribe box.
 *  Stretches to full width; the stroke stays constant via non-scaling-stroke. */
function Squiggle() {
  const seg = 56
  const count = 22
  let d = `M0 20 q ${seg / 2} -13 ${seg} 0`
  for (let i = 1; i < count; i++) d += ` t ${seg} 0`
  return (
    <svg
      viewBox={`0 0 ${seg * count} 40`}
      preserveAspectRatio="none"
      aria-hidden
      className="h-7 w-full text-accent"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prev = document.title
    document.title = `${post.title} — Saksham Mahajan`
    window.scrollTo(0, 0)
    return () => {
      document.title = prev
    }
  }, [post.title])

  const headings = getHeadings(post.body)

  // Prev/next by publication order (newest first in the array).
  const idx = blogPosts.findIndex((p) => p.slug === post.slug)
  const newer = idx > 0 ? blogPosts[idx - 1] : null
  const older = idx < blogPosts.length - 1 ? blogPosts[idx + 1] : null

  return (
    <>
      <ClickSpark />
      <TabTease />
      <Brand />
      <CommandPalette />
      <ThemeWipeChaser />
      <SelectionTools containerRef={articleRef} />

      <main className="mx-auto min-h-screen max-w-4xl px-6 pb-24 pt-28 sm:pt-36">
        <a
          href="/blogs"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg-faint transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> all writing
        </a>

        <header className="mt-10 border-b border-line pb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
            <span>{post.category}</span>
            <span aria-hidden className="text-accent">·</span>
            <span>{post.date}</span>
            <span aria-hidden className="text-accent">·</span>
            <span>{post.readMins} min read</span>
            <span aria-hidden className="text-accent">·</span>
            <ReadAloud text={`${post.title}. ${toPlainText(post.body)}`} />
          </div>
          <h1 className="mt-5 font-hero text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl">
            {post.title}
          </h1>
          {/* Standfirst — the blurb as a bright lead line, for hierarchy. */}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            {post.blurb}
          </p>
        </header>

        <TableOfContents headings={headings} />

        {/* Body — rendered plainly (not scroll-revealed): reading text should
            be present immediately, and select-to-define needs stable text. */}
        <article ref={articleRef} className="mt-10">
          <Markdown source={post.body} />
        </article>

        {/* Hand-drawn wave marking the end of the piece, into subscribe. */}
        <div className="mt-16">
          <Squiggle />
          <div className="mt-8">
            <Subscribe />
          </div>
        </div>

        {/* Prev / next — label + chevron, title in ember. */}
        {(newer || older) && (
          <nav className="mt-12 flex items-start justify-between gap-6 border-t border-line pt-8">
            {older ? (
              <a href={older.href} className="group flex flex-col">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                  <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
                    ‹
                  </span>
                  Previous
                </span>
                <span className="mt-1.5 font-hero text-lg font-semibold tracking-tight text-accent">
                  {older.title}
                </span>
              </a>
            ) : (
              <span />
            )}
            {newer && (
              <a href={newer.href} className="group flex flex-col text-right">
                <span className="inline-flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                  Next
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    ›
                  </span>
                </span>
                <span className="mt-1.5 font-hero text-lg font-semibold tracking-tight text-accent">
                  {newer.title}
                </span>
              </a>
            )}
          </nav>
        )}

        {/* Foot row: back to the index · back to top. */}
        <div className="mt-10 flex items-center justify-between border-t border-line pt-6 font-mono text-xs uppercase tracking-wider">
          <a
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
          >
            <span aria-hidden>←</span> all writing
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-y-0.5">
              ↑
            </span>
            back to top
          </button>
        </div>
      </main>

      <Footer />
    </>
  )
}
