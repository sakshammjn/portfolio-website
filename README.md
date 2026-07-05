# Saksham Mahajan — Portfolio

A brutalist-editorial personal portfolio, live at
**[saksham-mahajan.vercel.app](https://saksham-mahajan.vercel.app/)**.

The site reads like a magazine, not a component gallery: numbered chapters
(`{ 01 } EXPERIENCE` … `{ 06 } EDUCATION`), hairline rules instead of cards,
one ember-orange accent used sparingly, mono micro-labels, and a dotted-grid
ink background.

> **Design concept.** Big Clash Display type does the heavy lifting; structure
> comes from typography and hairlines, not boxes. The accent appears only
> where it earns its place — the braces, one word per headline, hover states.
> Everything else stays out of the way.

## ✨ Features

- **Editorial chapters** — every section is `{ NN } LABEL` + lede + rows,
  divided by hairlines. No cards, no pills.
- **Live elements** — a real-time "time on the job" ticker, and a
  your-time / my-time line that collapses when the visitor is in IST.
- **Slide-in frosted-glass menu** behind the `SM.` mark
  (`mix-blend-difference`, so it survives both halves of the split hero).
- **Easter eggs** — a console CLI (open DevTools and type `help`), click
  sparks, a tab-title tease, and a once-per-session loading splash.
- **Dark by default, light palette included** — theme resolved *before first
  paint* by an inline script, so there's no flash.
- **Accessible** — semantic landmarks, keyboard skip link, focus-visible
  rings, sr-only text for decorative type, and every animation honours
  `prefers-reduced-motion`.
- **SEO layer** — Open Graph / Twitter cards, Person JSON-LD with `sameAs`,
  sitemap, robots, and a crawlable full-name `<h1>`.
- **Fast and deliberately small** — no router library (two routes, a
  hand-rolled conditional), no state manager, no backend.

## 🧱 Tech Stack

| Concern        | Choice                               |
| -------------- | ------------------------------------ |
| Framework      | React 19 + TypeScript (strict)       |
| Build tool     | Vite 6                               |
| Styling        | Tailwind CSS v4 (CSS-first `@theme`) |
| Animation      | Framer Motion 12                     |
| Linting/format | ESLint 9 (flat config) + Prettier    |

There is no `tailwind.config.js` — all design tokens (colours, fonts,
palettes for both themes) live in [`src/styles/index.css`](src/styles/index.css).

## 📁 Project Structure

```
portfolio-website/
├── index.html                  # SEO meta, OG/Twitter, JSON-LD, theme pre-paint, fonts
├── vercel.json                 # SPA rewrite so /blogs deep-links resolve
├── public/                     # favicon, og-image, robots, sitemap, résumé PDF
└── src/
    ├── main.tsx                # entry + tiny path router ('/' and '/blogs')
    ├── App.tsx                 # the portfolio page — chapters in order
    ├── data/content.ts         # ← single source of truth for ALL content
    ├── styles/index.css        # design tokens (@theme), dark/light palettes, keyframes
    ├── lib/                    # shared easing + the console CLI easter egg
    ├── pages/BlogList.tsx      # /blogs — editorial essay index
    └── components/
        ├── layout/             # Brand (menu), Footer
        ├── sections/           # Hero + chapters 01–06 + Contact
        ├── ui/                 # Chapter, MilestoneRow, Tag, Reveal, live tickers
        └── effects/            # FlipText, SkillMarquee, ClickSpark, TabTease, splash
```

## 🚀 Getting Started

Requires **Node 18+**.

```bash
npm install
npm run dev        # dev server (http://localhost:5173)
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve dist/ locally
npm run lint       # ESLint
npm run format     # Prettier write
```

## ✏️ Editing Content

**All copy, links, and data live in [`src/data/content.ts`](src/data/content.ts)**
as typed exports — the components only render it. To change what the site
says, edit that one file; to change how it looks, edit the section or UI
component. SEO strings (title, description, JSON-LD) live in `index.html`.

## ☁️ Deployment

**Vercel (primary).** Push to `main` and Vercel redeploys automatically.
`vercel.json` rewrites every path to `/` so deep links resolve.

**GitHub Pages (legacy option).** Pages serves from a subpath, so build with
the matching base, then publish:

```bash
VITE_BASE=/portfolio-website/ npm run build
npm run deploy
```

Avoid serving both at once — duplicate content splits SEO signal; Vercel is
canonical.

## 📄 License

MIT © Saksham Mahajan
