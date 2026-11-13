import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { blogPosts } from './src/data/content'

const SITE = 'https://sakshammjn.dev'

const xmlEscape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[
        c
      ]!,
  )

/**
 * Emit /rss.xml at build time from the posts in content.ts, so the blog is
 * subscribable. No runtime cost, no dependency — the feed is a static asset
 * in the bundle. (content.ts is import-free, so pulling it in here is safe.)
 */
function rssFeed(): Plugin {
  return {
    name: 'generate-rss',
    generateBundle() {
      const items = blogPosts
        .map((p) => {
          const url = p.external ? p.href : SITE + p.href
          return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="${!p.external}">${xmlEscape(url)}</guid>
      <description>${xmlEscape(p.blurb)}</description>
      <category>${xmlEscape(p.category)}</category>
    </item>`
        })
        .join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Saksham Mahajan — Writing</title>
    <link>${SITE}/blogs</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on backend, systems, open source, and whatever I'm figuring out.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
      this.emitFile({ type: 'asset', fileName: 'rss.xml', source: xml })
    },
  }
}

interface PageHead {
  /** Route path, as main.tsx matches it (no trailing slash). */
  path: string
  title: string
  description: string
  type?: 'website' | 'article'
}

/**
 * The non-home routes that get their own <head>. ✏️ When you add a route to
 * main.tsx, add it here too (blog posts are picked up automatically).
 */
const routeHeads: PageHead[] = [
  {
    path: '/blogs',
    title: 'Blogs — Saksham Mahajan',
    description:
      "Essays and notes on what I'm building, breaking, and learning.",
  },
  {
    path: '/changelog',
    title: 'Changelog — Saksham Mahajan',
    description:
      "The site, version by version — every release of Saksham Mahajan's portfolio.",
  },
  ...blogPosts
    .filter((p) => !p.external)
    .map(
      (p): PageHead => ({
        path: `/blogs/${p.slug}`,
        // Matches the title BlogPostPage sets at runtime.
        title: `${p.title} — Saksham Mahajan`,
        description: p.blurb,
        type: 'article',
      }),
    ),
]

/** Swap one tag's value in the built HTML. Throws if the tag is missing, so
 *  an edit to index.html can't silently break every page's SEO. */
function swap(html: string, pattern: RegExp, value: string): string {
  if (!pattern.test(html)) {
    throw new Error(`[route-heads] index.html has no match for ${pattern}`)
  }
  return html.replace(pattern, (_, open: string, close: string) => open + value + close)
}

const metaTag = (attr: 'name' | 'property', key: string) =>
  new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`)

/**
 * Give every route its own <head>. The app ships one index.html for every
 * path, so without this each page — every blog post included — told search
 * engines it *was* the homepage (same canonical URL) and showed the homepage
 * card when shared. At build time this writes a copy of the built index.html
 * per route (`blogs.html`, `blogs/<slug>.html`, `changelog.html`) with that
 * route's title, description, canonical and Open Graph / Twitter tags.
 *
 * Static hosts serve `blogs.html` at `/blogs` (Cloudflare Pages, Netlify,
 * GitHub Pages); the page body and client-side routing are unchanged.
 */
function perRouteHeads(): Plugin {
  return {
    name: 'route-heads',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') {
        this.error('[route-heads] built index.html not found')
      }
      const base = String(index.source)

      for (const page of routeHeads) {
        const url = xmlEscape(SITE + page.path)
        const title = xmlEscape(page.title)
        const description = xmlEscape(page.description)
        let html = base
        html = swap(html, /(<title>)[^<]*(<\/title>)/, title)
        html = swap(html, metaTag('name', 'description'), description)
        html = swap(html, /(<link rel="canonical" href=")[^"]*(")/, url)
        html = swap(html, metaTag('property', 'og:type'), page.type ?? 'website')
        html = swap(html, metaTag('property', 'og:title'), title)
        html = swap(html, metaTag('property', 'og:description'), description)
        html = swap(html, metaTag('property', 'og:url'), url)
        html = swap(html, metaTag('name', 'twitter:title'), title)
        html = swap(html, metaTag('name', 'twitter:description'), description)

        this.emitFile({
          type: 'asset',
          fileName: `${page.path.slice(1)}.html`,
          source: html,
        })
      }
    },
  }
}

// `base` controls the public path the app is served from.
//   - Custom domain (sakshammjn.dev):  leave as '/' (default)
//   - GitHub Pages project site:       set VITE_BASE="/<repo-name>/" at build
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), rssFeed(), perRouteHeads()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
