import { blogPosts, type BlogPost } from '@/data/content'
import { Brand } from '@/components/layout/Brand'
import { Footer } from '@/components/layout/Footer'
import { ClickSpark } from '@/components/effects/ClickSpark'
import { TabTease } from '@/components/effects/TabTease'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The /blogs page — an editorial index of essays. Each row lays out the date,
 * title, one-line blurb, topic and a rough reading-time estimate, divided by
 * hairline rules in the same voice as the portfolio's chapters.
 */
export function BlogList() {
  return (
    <>
      <ClickSpark />
      <TabTease />
      <Brand />

      <main className="mx-auto min-h-screen max-w-5xl px-6 pb-24 pt-28 sm:pt-36">
        <header className="mb-8 sm:mb-10">
          <h1 className="font-hero text-5xl font-bold uppercase leading-none tracking-tight text-accent sm:text-7xl">
            Blogs
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Essays and notes on what I'm building, breaking, and learning.
          </p>
        </header>

        <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-fg-faint">
          {blogPosts.length} {blogPosts.length === 1 ? 'essay' : 'essays'}
        </p>

        <ul>
          {blogPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <li>
                <PostRow post={post} />
              </li>
            </Reveal>
          ))}
        </ul>
      </main>

      <Footer />
    </>
  )
}

function PostRow({ post }: { post: BlogPost }) {
  const isLink = post.href !== '#'

  const inner = (
    <div className="-mx-3 grid grid-cols-1 gap-y-2 rounded-lg border-b border-line px-3 py-8 transition-colors duration-300 group-hover:bg-fg/[0.02] sm:grid-cols-[7rem_1fr] sm:gap-x-10 sm:py-10">
      <div className="font-mono text-xs uppercase tracking-[0.15em] text-fg-faint transition-colors group-hover:text-fg-muted sm:pt-1.5">
        {post.date}
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-hero text-2xl font-semibold tracking-tight text-fg transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:text-3xl">
            {post.title}
            <span className="ml-2 inline-block -translate-x-1 text-base text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              {post.external ? '↗' : '→'}
            </span>
          </h2>
          <div className="hidden shrink-0 items-baseline gap-6 font-mono text-xs uppercase tracking-[0.15em] text-fg-faint sm:flex">
            <span>{post.category}</span>
            <span>{post.readMins} min</span>
          </div>
        </div>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{post.blurb}</p>
        {/* On narrow screens, fold the meta beneath the blurb. */}
        <div className="mt-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-fg-faint sm:hidden">
          <span>{post.category}</span>
          <span aria-hidden>·</span>
          <span>{post.readMins} min</span>
        </div>
      </div>
    </div>
  )

  if (isLink) {
    return (
      <a
        href={post.href}
        target={post.external ? '_blank' : undefined}
        rel={post.external ? 'noreferrer noopener' : undefined}
        className="group block"
      >
        {inner}
      </a>
    )
  }

  // Placeholder post (href '#') — not yet a real link.
  return <div className="group block cursor-default">{inner}</div>
}
