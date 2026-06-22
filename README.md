# Saksham Mahajan — Portfolio

An interactive, timeline-based personal portfolio. Instead of the usual
stack of hero / skills / projects / contact, the whole site is **one
continuous journey**: a single timeline spine draws itself as you scroll,
with each life milestone anchored to it as a glowing node.

> **Design concept — "The Long Line."** The timeline is the only persistent
> visual element. Everything else (editorial serif typography, deep-ink dark
> theme, a single restrained ember accent, motion that respects
> `prefers-reduced-motion`) exists to serve that one idea — a story with a
> spine, not a page of boxes.

## ✨ Features

- **Scroll-linked timeline spine** that fills with the accent colour as you progress.
- **Alternating editorial layout** on desktop; clean single rail on mobile.
- **Chapter navigator** — a fixed "metro map" showing your position in the journey.
- **Subtle, GPU-cheap motion** (transform/opacity only) via Framer Motion.
- **Dark by default**, premium typography (Fraunces + Inter + JetBrains Mono).
- **Accessible**: semantic landmarks, skip link, focus-visible rings, reduced-motion support.
- **SEO-ready**: meta tags, Open Graph, Twitter cards, and JSON-LD `Person` schema.
- **Fast**: static single-page build, no backend, no heavy 3D.

## 🧱 Tech Stack

| Concern        | Choice                              |
| -------------- | ----------------------------------- |
| Framework      | React 19 + TypeScript               |
| Build tool     | Vite 6                              |
| Styling        | Tailwind CSS v4 (CSS-first `@theme`) |
| Animation      | Framer Motion 12                    |
| Linting/format | ESLint 9 (flat config) + Prettier   |

> **Why Vite, not Next.js?** The brief allows Next.js but asks for Vite
> "unless there is a strong reason." This is fully static content with no SSR,
> data fetching, or API routes — so Vite gives faster builds, a smaller bundle,
> and effortless deployment to **both** Vercel and GitHub Pages. If you later
> add a blog/CMS or server rendering, migrating to Next.js App Router is
> straightforward since the components are framework-agnostic React.

## 📁 Project Structure

```
portfolio-website/
├── index.html                 # SEO meta, OpenGraph, JSON-LD, font preconnect
├── public/
│   └── favicon.svg            # spine + node motif favicon
├── src/
│   ├── components/
│   │   ├── layout/            # Brand wordmark, Footer
│   │   ├── timeline/          # Timeline spine, TimelineItem, Node, ChapterNav, ScrollProgress
│   │   ├── sections/          # Hero, Education, Global, Experience, Projects, Achievements, Beyond, Contact
│   │   └── ui/                # Reveal, GlassCard, Tag, SectionHeading, MilestoneCard, ProjectCard
│   ├── data/
│   │   └── content.ts         # ← single source of truth for ALL content
│   ├── hooks/
│   │   └── useActiveSection.ts
│   ├── lib/
│   │   └── motion.ts          # shared animation presets
│   ├── styles/
│   │   └── index.css          # Tailwind import + design tokens (@theme)
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
├── eslint.config.js
└── tsconfig*.json
```

## 🚀 Getting Started

Requires **Node 18+** (developed on Node 24).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build
npm run build

# 4. Preview the production build locally
npm run preview
```

Other scripts:

```bash
npm run lint      # ESLint
npm run format    # Prettier write
```

## ✏️ Editing Your Content

**All content lives in [`src/data/content.ts`](src/data/content.ts).** You do
not need to touch any component to update the site. Replace every value in
`[brackets]` (years, company names, repo links, username, email) with your
real details.

Don't forget to also update:

- `index.html` — the `<title>`, meta descriptions, canonical URL, and the
  `og:image` URL (drop an `og-image.png`, ~1200×630, into `public/`).
- The email in `src/data/content.ts` (`contact.email` and the `Email` social).

## ☁️ Deployment

### Option A — Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Vite — keep the defaults:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Click **Deploy**. Done. Every push to `main` redeploys automatically.

> `vercel.json` is included so client-side routing/refreshes resolve cleanly.

### Option B — GitHub Pages

GitHub Pages serves from a subpath (`/<repo-name>/`), so build with the
matching base:

```bash
VITE_BASE=/portfolio-website/ npm run build
npm run deploy        # publishes ./dist to the gh-pages branch
```

Then in **GitHub → Settings → Pages**, set the source to the `gh-pages`
branch. Your site will be at `https://<username>.github.io/portfolio-website/`.

(Replace `portfolio-website` with your actual repository name in both the
`VITE_BASE` value and the URL.)

## ♿ Accessibility & Performance Notes

- Respects `prefers-reduced-motion` — all entrance/loop animations disable.
- Semantic `<section aria-label>` landmarks and a keyboard skip link.
- Visible `:focus-visible` rings in the brand accent.
- Animations are transform/opacity only to stay at 60fps.
- No render-blocking JS beyond the app bundle; fonts load with `display=swap`.

## 📄 License

MIT © Saksham Mahajan
