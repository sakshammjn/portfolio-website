# Onboarding — Saksham Mahajan's Portfolio

> Everything a fresh assistant needs to develop this codebase with zero prior context.
> Last updated: 2026-07-05 (commit `ff4e96b`).

---

## 1. What this is

A single-page personal portfolio for **Saksham Mahajan** (software engineer @ RKIT Software, GSoC 2026 applicant with JSON Schema), plus a `/blogs` index page. Fully static — no backend, no CMS, no analytics. Deployed on **Vercel** at `https://saksham-mahajan.vercel.app/` (custom domain `sakshammjn.com` planned, not yet purchased).

**Design language:** brutalist-editorial. Big Clash Display type, hairline rules instead of cards, one ember-orange accent, mono micro-labels, dotted-grid ink background. The site reads as numbered "chapters" (`{ 01 } EXPERIENCE` …) like a magazine, not a component gallery. An older "timeline spine" design was deliberately removed (`a7de4cd refactor: remove legacy timeline`) — do not reintroduce cards, spines, or soft pills.

---

## 2. Tech stack & versions

| Concern | Choice | Version (package.json) |
| --- | --- | --- |
| Framework | React + TypeScript | react `^19.0.0`, typescript `~5.7.2` |
| Build | Vite | `^6.0.5` |
| Styling | Tailwind CSS **v4** (CSS-first, `@theme` in CSS, no tailwind.config.js) | `^4.0.0` via `@tailwindcss/vite` |
| Animation | Framer Motion | `^12.4.0` |
| Lint/format | ESLint 9 flat config + Prettier | eslint `^9.17.0`, prettier `^3.4.2` |
| Deploy | Vercel (primary), gh-pages script exists (secondary) | gh-pages `^6.2.0` |

No router library, no state manager, no data fetching, no test framework (nothing to run tests with — `npm test` does not exist).

### Commands

```bash
npm run dev        # vite dev server
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve dist/ locally (port 4173)
npm run lint       # eslint .
npm run format     # prettier over src/**/*.{ts,tsx,css}
npm run deploy     # build + push dist/ to gh-pages branch (legacy path; Vercel is primary)
npx tsc --noEmit   # quick type-check (use this to verify edits)
```

---

## 3. Folder / file map

```
├── index.html                  # SEO hub: title/meta/OG/Twitter, theme pre-paint script,
│                               #   fonts (Google + Fontshare), Person JSON-LD. EDIT SEO HERE.
├── vite.config.ts              # react + tailwindcss plugins, `@` → ./src alias,
│                               #   base = VITE_BASE env (for GitHub Pages) or '/'
├── vercel.json                 # SPA rewrite: /(.*) → /  (makes /blogs deep-link work)
├── tsconfig.app.json           # strict, noUnused*, bundler resolution, paths { "@/*": ["./src/*"] }
├── .prettierrc                 # no semicolons, single quotes, trailing commas, width 80
├── eslint.config.js            # flat config: TS + react-hooks + react-refresh
├── README.md                   # ⚠️ STALE — describes the removed timeline design (see §10)
├── public/                     # copied verbatim to web root
│   ├── favicon.svg
│   ├── og-image.png            # 1200×630 branded share card (generated via headless Chrome)
│   ├── robots.txt              # allows all, points to sitemap
│   ├── sitemap.xml             # / and /blogs, vercel.app URLs (swap when domain lands)
│   └── saksham-mahajan-resume.pdf
└── src/
    ├── main.tsx                # entry. Tiny hand-rolled router: '/blogs' → BlogList, else App.
    │                           #   Also calls printConsoleGreeting() once.
    ├── App.tsx                 # portfolio page: skip-link + effects + Brand + sections in order
    ├── data/
    │   └── content.ts          # ★ SINGLE SOURCE OF TRUTH for all copy/links/data.
    │                           #   Interfaces + exports; components only render it.
    ├── styles/
    │   └── index.css           # ★ design tokens (@theme), dark/light palettes,
    │                           #   base layer, component classes, keyframes
    ├── lib/
    │   ├── motion.ts           # shared easeOut cubic-bezier [0.22, 1, 0.36, 1]
    │   └── consoleGreeting.ts  # DevTools easter egg: window getters (hire, stack, secret…)
    ├── pages/
    │   └── BlogList.tsx        # /blogs — editorial essay index (rows, hairlines)
    └── components/
        ├── layout/
        │   ├── Brand.tsx       # fixed top-left "SM." (mix-blend-difference) → hamburger →
        │   │                   #   frosted-glass slide-in menu (Home/Blogs + Résumé/socials)
        │   └── Footer.tsx      # © year + console easter-egg teaser
        ├── sections/           # one file per chapter, in page order:
        │   ├── Hero.tsx        #   { saksham } / portfolio split band + skill marquees
        │   ├── Experience.tsx  #   { 01 } — MilestoneRows (RKIT + URFU internship)
        │   ├── OpenSource.tsx  #   { 02 } — GSoC header + issue/PR ledger + "06 bugs" stat
        │   ├── Projects.tsx    #   { 03 } — numbered project rows (Aspire first)
        │   ├── Global.tsx      #   { 04 } — Russia exchange (soft-skills story)
        │   ├── Achievements.tsx#   { 05 } — 2×2 hairline grid (featured→col-span-2 supported)
        │   ├── Education.tsx   #   { 06 } — B.Tech row + 9.50 CGPA highlight stat
        │   └── Contact.tsx     #   closing paper band: headline, email CTA, dots, live time
        ├── ui/                 # small structural primitives
        │   ├── Chapter.tsx     #   section wrapper: `{ NN } LABEL` header + lede + max-w-5xl
        │   ├── MilestoneRow.tsx#   period | title/subtitle/desc/tags/link editorial row
        │   ├── Tag.tsx         #   square mono chip (border, uppercase, 11px)
        │   ├── Reveal.tsx      #   whileInView fade+rise wrapper (once, -80px margin)
        │   ├── WorkDuration.tsx#   live "6mo 1d 23h…" ticker (1s interval, green + blink dot)
        │   └── LocalTime.tsx   #   "1:07 AM for both of us — India, UTC+5:30" (30s interval)
        └── effects/            # personality layer
            ├── FlipText.tsx    #   hero letter-swap animation (aria-label on root)
            ├── SkillMarquee.tsx#   scroll-velocity-reactive drifting skill bands
            ├── ClickSpark.tsx  #   canvas spark burst on click (pointer-events: none)
            ├── TabTease.tsx    #   swaps tab title to 👀 when tab hidden
            └── LoadingSplash.tsx#  once-per-session intro: greetings cycle + load bar (1.9s)
```

---

## 4. Architecture & key patterns

1. **Content/presentation split (the core pattern).** All copy, links, numbers and lists live in [src/data/content.ts](src/data/content.ts) as typed exports (`TimelineCard`, `Project`, `Achievement`, `BlogPost`, `OssContribution`…). Section components are dumb renderers. **To change what the site says, edit content.ts only.** To change how it looks, edit the section/ui component.

2. **Chapter composition.** Every section = `<Chapter id index label lede>` wrapping rows. Chapter renders the `{ NN }` header; the `index` prop is a hardcoded two-digit string per section and must stay in sync with page order in [App.tsx](src/App.tsx) (Experience 01 → Education 06; Contact is the un-numbered closer).

3. **Hand-rolled routing.** [main.tsx](src/main.tsx) picks the root component off `window.location.pathname` (`/blogs` → BlogList, else App). Navigation between pages is a full page load; `vercel.json` rewrites every path to `/` so deep links resolve. Adding a route = extend the conditional in main.tsx + add URL to sitemap.xml. Don't add react-router for one page.

4. **Theme system.** Dark is default. `html.dark` / `html.light` classes reassign the same CSS custom properties (`--color-ink`, `--color-fg`, …) so every Tailwind utility follows automatically. An inline script in [index.html](index.html) resolves the theme from `localStorage('theme')` or `prefers-color-scheme` **before first paint** (no flash) and syncs `<meta name="theme-color">`. Note: there is currently **no visible theme toggle UI** — the Brand menu comment mentions it as a future item.

5. **Motion discipline.** All entrance animation goes through `<Reveal>` (fade + 24px rise, `whileInView`, fires once). Shared easing from [lib/motion.ts](src/lib/motion.ts). **Every** effect honours `prefers-reduced-motion` (Reveal renders static, marquee holds still, splash skips, sparks/blink disable). Any new animation must do the same — transform/opacity only, no layout-thrashing properties.

6. **Inverted "paper" bands.** Hero bottom half and the Contact section flip to `bg-fg text-ink` (paper on dark theme). Inside those bands use `text-ink`, `border-ink/15`, `text-ink/60` etc. — NOT the fg tokens. The "SM." brand mark survives both via `mix-blend-difference`.

7. **Live elements.** Three self-updating pieces: WorkDuration (1s tick, calendar-aware month/day breakdown), LocalTime (30s tick, collapses to "for both of us" when visitor is in IST), TabTease (visibility listener). Keep intervals cleaned up in useEffect returns (they all are).

8. **Easter eggs are part of the brand.** Console CLI (`hire`, `stack`, `secret`… as window getters), tab-title tease, click sparks, once-per-session splash (`sessionStorage.splashShown`). The footer openly advertises the console one.

### Data flow (one line)

`content.ts → section component (maps arrays) → ui primitives (Chapter/MilestoneRow/Tag/Reveal) → styled by tokens in index.css`. No props drilling beyond one level, no context, no state beyond local UI state.

---

## 5. Styling system (Tailwind v4 — CSS-first)

There is **no tailwind.config.js**. Everything lives in [src/styles/index.css](src/styles/index.css):

- **`@theme` block** defines tokens that auto-generate utilities:
  - Surfaces: `--color-ink` (#0a0a0b), `--color-ink-2`, `--color-surface`
  - Text: `--color-fg` / `--color-fg-muted` / `--color-fg-faint`
  - `--color-line` (hairline, ~8% white), `--color-accent` (#ff6a3d ember) + `--color-accent-soft`
  - `--color-live` (#22c55e) — green for "currently working / open to work" signals
  - Fonts: `--font-sans` (Inter), `--font-mono` (JetBrains Mono), `--font-hero` (Clash Display via Fontshare)
- **Palette blocks** `html.dark` / `html.light` reassign the tokens (light = warm paper #faf9f5).
- **Base layer:** dotted-grid background (`radial-gradient` × 32px, `--dot` per theme), custom scrollbar, `::selection` in accent, `overflow-x: clip` safety, focus-visible rings.
- **Component classes:** `.marquee-mask` (edge fade), `.link-underline` (grow-on-hover underline), `.flip-*` (hero letter swap), `.animate-live-blink` (steps() on/off used by WorkDuration dot).
- **Keyframes:** `slide-swap`, `slide-swap-right`, `live-blink` — all disabled under the reduced-motion media query at the bottom.

Conventions in markup: hairlines are `border-t border-line`; numbered labels are `font-hero font-bold text-fg-faint`; mono micro-labels are `font-mono text-xs uppercase tracking-[0.15em–0.3em]`; the accent is used sparingly (braces, hovers, one word per headline). Tailwind v4 dynamic spacing is in use (e.g. `py-18` works).

---

## 6. SEO layer (all in index.html + public/)

- Title: `Saksham Mahajan — Software Engineer`; description/OG/Twitter aligned; OG image `public/og-image.png` (1200×630, regenerate via headless Chrome screenshot of a styled HTML file if branding changes).
- **Person JSON-LD** with `sameAs` → GitHub + LinkedIn, `alternateName: "sakshammjn"`, worksFor RKIT, alumniOf GCET. Keep in sync with `socials` in content.ts.
- Crawlable full name: sr-only `"Saksham Mahajan — Software Engineer"` inside the hero `<h1>` ([Hero.tsx](src/components/sections/Hero.tsx)); the `{ saksham }` FlipText is `aria-hidden`.
- `public/robots.txt` + `public/sitemap.xml` (currently vercel.app URLs).
- **Canonical/OG/sitemap all point to `https://saksham-mahajan.vercel.app/`** — when `sakshammjn.com` is purchased, swap URLs in: index.html (canonical, og:url, og:image, twitter:image, JSON-LD `@id`/`url`), sitemap.xml, robots.txt. Then add domain in Vercel (auto-301s the subdomain).

---

## 7. Build, deploy, env

- **Vercel (primary):** repo `github.com/sakshammjn/portfolio-website`, push to `main` auto-deploys. `vercel.json` handles SPA rewrites. Static files in `public/` are served from the web root.
- **GitHub Pages (legacy option):** `npm run deploy` pushes `dist/` via gh-pages. Requires `VITE_BASE="/portfolio-website/"` at build time for correct asset paths. ⚠️ Avoid deploying to both simultaneously — duplicate content splits SEO signal; Vercel is canonical.
- **Env variables:** only `VITE_BASE` (optional, build-time, for Pages). No secrets, no runtime env, no `.env` files.
- Verification loop after edits: `npx tsc --noEmit` (types) → `npm run build` (full check). Both must pass before commit.

---

## 8. Coding conventions

- Prettier: **no semicolons**, single quotes, trailing commas, 80 columns, 2-space indent. TS strict; unused locals/params are build errors.
- Imports use the `@/` alias (`@/data/content`, `@/components/ui/Reveal`).
- Named exports everywhere (only `App` is default). One component per file. Props typed with local `interface`.
- **Comment style is part of the codebase's voice:** section-divider banners in content.ts (`/* --- * 01 — Education * --- */`), a doc-block above every component explaining design intent (often *why*, not *what*), and `✏️` markers wherever the owner is expected to edit content by hand. Match this density and tone when adding code.
- Accessibility floor: semantic landmarks + `aria-label` on sections, sr-only text for decorative type, `aria-hidden` on ornaments, keyboard skip-link, focus-visible ring, reduced-motion fallbacks. Don't regress these.
- Copy voice: dry, confident, first-person, specific numbers over adjectives ("Four years. No dips."). British-leaning spellings appear ("Specialised", "colours") — stay consistent within a section.
- Git: conventional-commit style subjects (`feat:`, `fix:`, `refactor:`), imperative body bullets.

---

## 9. Content facts (do not contradict these)

These numbers/claims are deliberate and cross-referenced across sections — keep them consistent everywhere:

- CGPA **9.50/10** (Education highlight only; deliberately NOT repeated elsewhere — an old 9.41 was removed as inconsistent).
- HackAtom (Rosatom, Russia): **top 5 of 20+ international teams**, project **Aspire**, built in **36 hours**. Appears in three deliberate places: Experience (URFU row), Projects (Aspire), Achievements (merged hackathon card).
- Odoo Hackathon SVNIT: **top 10 of 1200+ teams**, project **Learnova**.
- URFU internship: **fully funded, on-site, Yekaterinburg, July–Aug 2025**, ~30% retrieval-time improvement.
- RKIT: Software Engineer since **2026-01-01** (drives the live ticker), product serving **100,000+ users**.
- OSS: **6 issues + 6 PRs** across `ioflux-org/studio-json-schema` and `json-schema-org/website`; only **PR #195 is merged** (`merged: true`); flip flags in content.ts as others land. The "06" closing stat is computed from `ossContributions.length`.
- Unverified assumption to confirm with Saksham: Aspire's stack lists **Python + scikit-learn** for model training (repo is ~98% TypeScript; training assumed external). Also "NPTEL — Course Topper" wording (proposal says "topped"; verify literal award).

---

## 10. Status: done vs. pending

### Done (live on main, commit `ff4e96b`)
- All 6 chapters + Hero + Contact + Footer, content sharpened end-to-end
- Open Source chapter (GSoC header, issue/PR ledger, auto-count stat)
- SEO layer (JSON-LD + sameAs, OG image, robots, sitemap, crawlable H1)
- Live green work ticker + blink animation; live local-time line
- Résumé PDF in public/, linked from Contact dot-row (first) + menu "Elsewhere" (first)
- Slide-in glass menu, /blogs page shell, console/tab/spark/splash easter eggs
- Vercel deploy pipeline (push-to-main)

### Pending / TODO (in priority order)
1. **BUG — resume link is broken:** `resume.href` in content.ts is currently `'public/saksham-mahajan-resume.pdf'`; it must be **`/saksham-mahajan-resume.pdf`** (public/ contents are served from the web root; the relative `public/...` path 404s in production).
2. **Blog posts are placeholders** — three `[Your … essay title]` entries with `href: '#'` in content.ts. Write/link real posts (GSoC contribution story is the obvious first one).
3. **Project repo links missing:** `phishing` and `studynotion` projects have `repo: '[github-link]'` placeholders (rows render a dead "Code" link).
4. **consoleGreeting content is half-placeholder** (`<username>`, `+91 XXXXX`, `<your easter egg>`…) — the footer advertises this feature, so finish it in [lib/consoleGreeting.ts](src/lib/consoleGreeting.ts). Note it uses the RKIT work email while the site uses the Gmail — unify.
5. **README.md is stale** — still documents the removed timeline design ("The Long Line", Fraunces serif, chapter navigator). Rewrite to match the editorial design (or point it at this file).
6. **Domain swap** — buy `sakshammjn.com`, then update the URL set listed in §6 + Vercel domain settings.
7. **Google Search Console** — verify property, submit sitemap.xml, request indexing (owner action).
8. **Learnova repo mismatch (unconfirmed):** points to `github.com/sakshammjn/ai-generated-quiz` — confirm that's really Learnova.
9. Minor: LinkedIn URL appears as `www.linkedin.com/...` in JSON-LD but `linkedin.com/...` in content.ts — harmless, but unify when touching either.
10. Nice-to-have ideas previously discussed: theme toggle in the menu, click-to-copy on the contact email, achievements `year` fields (component supports them; currently omitted).

### Known gotchas
- **Achievements grid is 2-wide:** cards must be added in pairs, or give one `featured: true` (spans full width) — an odd count leaves a visible hole.
- **LoadingSplash blocks headless screenshots** (shows once per session, sessionStorage-gated) — for automated captures, set `sessionStorage.splashShown = '1'` first or screenshot twice.
- `tsconfig` `noUnusedLocals` means removing a component usage without removing its import breaks the build — run `npx tsc --noEmit` after refactors.
- Chapter `index` strings are manual — reordering sections in App.tsx requires renumbering every section file's `index` prop.
