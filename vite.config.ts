import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { blogPosts } from './src/data/content'

const SITE = 'https://sakshammjn.com'

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

// `base` controls the public path the app is served from.
//   - Custom domain (sakshammjn.com):  leave as '/' (default)
//   - GitHub Pages project site:       set VITE_BASE="/<repo-name>/" at build
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), rssFeed()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
