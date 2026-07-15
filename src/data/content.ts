/**
 * Single source of truth for all portfolio content.
 *
 * ✏️  Everything a visitor reads lives here — edit this file to update the site.
 *     Placeholders in [brackets] are meant to be replaced with your real details.
 */

export interface TimelineCard {
  id: string
  title: string
  subtitle?: string
  period?: string
  description: string
  tags?: string[]
  /** Optional outbound link (e.g. a demo video), shown beneath the tags. */
  link?: { label: string; href: string }
  /** ISO start instant — when set, renders a live "time on the job" ticker. */
  since?: string
}

export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  stack: string[]
  /** Optional secondary link (live demo, problem statement…) with its own label. */
  link?: { label: string; href: string }
  repo?: string
  featured?: boolean
}

export interface Achievement {
  id: string
  title: string
  detail: string
  year?: string
  /** Set true to span the full grid width — reserve for the headline win. */
  featured?: boolean
}

export interface BlogPost {
  id: string
  /** URL slug — the post reads at /blogs/<slug>. */
  slug: string
  title: string
  blurb: string
  /** Short topic label, shown small + uppercase on the right. */
  category: string
  /** Human date, e.g. 'Feb 2026'. */
  date: string
  /** Rough reading-time estimate in minutes. */
  readMins: number
  /** The post body as Markdown — the native reader renders it (headings,
   *  bold/italic, `code`, [links](url), lists, > quotes, ``` fences, ---). */
  body: string
  /** Where the row links. Internal posts point at /blogs/<slug>. */
  href: string
  /** Set true for posts hosted elsewhere — renders an ↗ on hover. */
  external?: boolean
}

export interface SocialLink {
  label: string
  href: string
  handle: string
}

/* ----------------------------------------------------------------- *
 * Personal / hero
 * ----------------------------------------------------------------- */
export const profile = {
  // The wordmark rendered in the hero ({ saksham }) and the footer.
  name: 'saksham',
  // Drives the live "your time · my time" line in the contact band.
  timeZone: 'Asia/Kolkata',
  location: 'India',
  utcLabel: 'UTC+5:30',
}

/* ----------------------------------------------------------------- *
 * About — the short human intro that opens the page.
 * ----------------------------------------------------------------- */
export const about = {
  // Left meta column — the hats I wear (job-title roles only). Edit freely.
  roles: ['Software Engineer', 'Web Developer'],
  body: "I'm Saksham, a software engineer who likes building things and learning by building them. I pick up new tools and frameworks quickly, and I enjoy working through unfamiliar problems until they make sense. Most of all, I care about writing clean, dependable code — simple where it can be, careful where it matters — and seeing it through to something that actually ships.",
}

/**
 * Skills for the two hero marquee strips that flank the name — the top band
 * scrolls one way, the bottom band the other.
 */
export const marqueeTop: string[] = [
  '.NET',
  'C#',
  'Azure',
  'Python',
  'MySQL',
  'C++',
  'REST APIs',
]
export const marqueeBottom: string[] = [
  'Security',
  'AI / ML',
  'React',
  'Node.js',
  'TypeScript',
  'MongoDB',
  'IoT',
]

/* ----------------------------------------------------------------- *
 * 01 — Education
 * ----------------------------------------------------------------- */
export const education: TimelineCard[] = [
  {
    id: 'btech',
    title: 'B.Tech — Computer Science & Engineering',
    subtitle: 'G H Patel College of Engineering & Technology',
    period: '2022 – 2026',
    description:
      'Four years of convincing machines to talk to each other — from tiny embedded chips all the way up to the cloud. Specialised in IoT, and never skipped the fun: internships, side projects, and the occasional all-nighter.',
    tags: ['IoT Specialisation', 'Data Structures', 'Networks', 'Cloud Computing'],
  },
]

export const educationHighlight = {
  metric: '9.49',
  metricLabel: 'CGPA / 10',
  caption: 'Four years. No dips.',
}

/* ----------------------------------------------------------------- *
 * 02 — Global exposure
 * ----------------------------------------------------------------- */
export const global: TimelineCard[] = [
  {
    id: 'russia',
    title: 'International Exchange Programme — Russia',
    subtitle: 'Ural Federal University',
    period: 'July - August 2025',
    description:
      'A summer living and working in Yekaterinburg, on a team of students from five countries — most of us without a shared first language. I learned conversational Russian from scratch in two months because I had to, and discovered that communication is mostly listening. What stuck wasn’t technical: more perspectives, fewer assumptions, and real comfort working with people who see problems differently.',
    tags: ['Cross-cultural Teamwork', 'Russian Language', 'Communication', 'Adaptability'],
  },
]

/* ----------------------------------------------------------------- *
 * 03 — Professional experience
 * ----------------------------------------------------------------- */
export const experience: TimelineCard[] = [
  {
    id: 'rkit',
    title: 'Software Engineer',
    subtitle: 'RKIT Software · India',
    period: 'Jan 2026 – Present',
    // Live counter starts at midnight IST, 1 Jan 2026.
    since: '2026-01-01T00:00:00+05:30',
    description:
      'Building and maintaining backend services and REST APIs in C# and .NET Core on a product serving 100,000+ users. Most days revolve around JSON parsing, data validation and dependable data access — clean architecture over clever shortcuts.',
    tags: ['C#', '.NET Core', 'MySQL', 'Entity Framework', 'Redis', 'Azure', 'Git'],
  },
  {
    id: 'urfu',
    title: 'Summer Intern',
    subtitle: 'Ural Federal University · Russia',
    period: 'July – August 2025',
    description:
      'Fully funded and on-site in Yekaterinburg, Russia, built an interactive platform analysing the economics of nuclear-isotope applications, tuning data pipelines and queries to cut retrieval time ~30% and turning raw datasets into dashboards an international team could actually decide from. Along the way, placed top 5 of 20+ international teams at HackAtom, Rosatom’s hackathon.',
    tags: ['Python', 'React', 'Flask', 'REST APIs', 'Pandas', 'Data Viz'],
    link: {
      label: 'Watch demo',
      href: 'https://drive.google.com/file/d/1ND8HhoHLw6vnPH_TCnXP4tx2AJ3UHaBa/view?usp=sharing',
    },
  }
]

/* ----------------------------------------------------------------- *
 * Open source — GSoC 2026 + JSON Schema contributions
 * ----------------------------------------------------------------- */
export const gsoc = {
  program: 'Google Summer of Code 2026',
  org: 'JSON Schema',
  // The live JSON Schema Studio tool — linked from the org label.
  studioUrl: 'https://studio.ioflux.org/',
  project: 'Enhanced Interaction & Navigation in JSON Schema Studio',
  mentors: '@AgniveshChaubey · @jagpreetrahi',
  proposalUrl: 'https://drive.google.com/file/d/1V6Hbb4hsRdU7dzHvGe85jQxfVsWCbqcm/view?usp=sharing',
  blurb:
    'I was looking for a space where I could take true ownership, tackle self-driven challenges, and genuinely look forward to opening my laptop. Open source gave me that.',
}

export interface OssContribution {
  id: string
  /** What the fix did, in a few words. */
  title: string
  /** Which repo the work landed in; keys map to `ossRepos` below. */
  repo: 'studio' | 'website'
  /** Issue number that reported it (optional). */
  issue?: number
  /** PR number that fixed it (optional). */
  pr?: number
  /** Set true once the PR is merged — shows a small "merged" mark. */
  merged?: boolean
}

// Base repo URLs used to build the issue/PR links below.
export const ossRepos: Record<OssContribution['repo'], string> = {
  studio: 'https://github.com/ioflux-org/studio-json-schema',
  website: 'https://github.com/json-schema-org/website',
}

// ✏️  Flip `merged` to true as each PR lands. (Only #195 is merged so far.)
export const ossContributions: OssContribution[] = [
  {
    id: 'search-symbols',
    title: 'Stopped symbol-only search queries from matching every node',
    repo: 'studio',
    issue: 194,
    pr: 195,
    merged: true,
  },
  {
    id: 'yaml-highlight',
    title: 'Enabled node-click highlighting in the YAML editor',
    repo: 'studio',
    issue: 167,
    pr: 175,
    merged: false,
  },
  {
    id: 'empty-editor',
    title: 'Cleared the stale graph when the editor is emptied',
    repo: 'studio',
    issue: 180,
    pr: 188,
    merged: false,
  },
  {
    id: 'search-stale',
    title: 'Kept search results in sync as the schema changes',
    repo: 'studio',
    issue: 244,
    pr: 249,
    merged: false,
  },
  {
    id: 'ui-theming',
    title: 'Fixed popup scrolling, fullscreen theming and edge colours',
    repo: 'studio',
    issue: 124,
    pr: 129,
    merged: false,
  },
  {
    id: 'feedback-error',
    title: 'Cleared a stuck error message when the feedback form closes',
    repo: 'website',
    issue: 2342,
    pr: 2348,
    merged: false,
  },
]

/* ----------------------------------------------------------------- *
 * 04 — Projects
 * ----------------------------------------------------------------- */
export const projects: Project[] = [
  {
    id: 'aspire',
    name: 'Aspire',
    tagline: 'An ML tool that turns raw datasets into live predictions',
    description:
      'Built in 36 hours at HackAtom — the international hackathon run by Rosatom, Russia’s nuclear energy body — where our team placed top 5 out of 20+ teams. The brief: make the economics of non-energy nuclear applications, isotopes in medicine, agriculture and industry, understandable to anyone through an interactive app. Aspire answered with a trained ML model behind a responsive interface, turning verified datasets into live, explorable predictions.',
    stack: ['TypeScript', 'React', 'Python', 'scikit-learn', 'PostgreSQL', 'Data Viz'],
    repo: 'https://github.com/sakshammjn/hackatom',
    link: {
      label: 'Problem Statement',
      href: 'https://drive.google.com/file/d/1lP9X4s35K238J1tk0bJ_6I5RpLaZhmIw/view?usp=sharing',
    },
    featured: true,
  },
  {
    id: 'phishing',
    name: 'Phishing Website Detection',
    tagline: 'Machine learning that spots malicious URLs',
    description:
      'A machine-learning system that classifies websites as legitimate or phishing by engineering features from URL structure, domain signals and page content. Brings my security mindset and ML together into a single, practical defence.',
    stack: ['Python', 'scikit-learn', 'Feature Engineering', 'ML'],
    repo: 'https://github.com/sakshammjn/phishing-website-ml-backend',
  },
  {
    id: 'learnova',
    name: 'Learnova',
    tagline: 'A modern learning platform',
    description:
      'An ed-tech platform built to make structured learning feel effortless — course delivery, progress tracking and a clean, focused interface for learners. This is the build that carried our team to the top 10 of 1200+ at the Odoo Hackathon.',
    stack: ['React', 'Node.js', 'MongoDB', 'REST'],
    repo: 'https://github.com/sakshammjn/ai-generated-quiz',
  },
  {
    id: 'wimpys-list',
    name: "Wimpy's List",
    tagline: 'A cartoonish to-do list for your browser',
    description:
      'A Chrome extension that makes the daily to-do a little less of a chore — a hand-drawn, cartoonish task list that lives in the browser popup, with a satisfying sound on every add and delete. Tasks persist locally, so the list is right where you left it.',
    stack: ['Manifest V3', 'Chrome Storage API', 'Web Audio API', 'Vanilla JS', 'CSS'],
    repo: 'https://github.com/sakshammjn/wimpys-list-chrome-extension',
  },
]

/* ----------------------------------------------------------------- *
 * 05 — Achievements
 * ----------------------------------------------------------------- */
export const achievements: Achievement[] = [
  {
    id: 'hackathons',
    title: 'Hackathons — Top 5 & Top 10',
    detail:
      'Top 5 of 20+ international teams at HackAtom, Rosatom’s hackathon in Russia, and top 10 of 1200+ teams at the Odoo Hackathon, SVNIT Surat.',
  },
  {
    id: 'codefest',
    title: 'IEEE CodeFest — Winner',
    detail: 'Won CodeFest, IEEE’s competitive coding event, against the whole college.',
  },
  {
    id: 'nptel',
    title: 'NPTEL — Course Topper',
    detail: 'Topped NPTEL certification courses in both Cloud Computing and DSA.',
  },
  {
    id: 'talks',
    title: 'Speaker — 50+ Students',
    detail:
      'Delivered hackathon guidance talks to 50+ students — helping them go from confused to confident.',
  },
]

/* ----------------------------------------------------------------- *
 * 06 — Blog / essays  (rendered on the /blogs page)
 *
 * ✏️  Add posts here as they're published — while this list is empty the
 *     /blogs page shows an "in the works" note instead of placeholder rows.
 *     Set `external: true` for anything hosted off-site (Medium, Substack…).
 *     Example shape:
 *     {
 *       id: 'gsoc-story',
 *       title: 'Six bugs, one merged PR — getting into JSON Schema',
 *       blurb: 'How contributing to a tool I actually use became a GSoC proposal.',
 *       category: 'Open Source',
 *       date: 'Jul 2026',
 *       readMins: 7,
 *       href: 'https://…',
 *       external: true,
 *     },
 * ----------------------------------------------------------------- */
export const blogPosts: BlogPost[] = [
  {
    id: 'boring-technology',
    slug: 'boring-technology',
    title: 'In Praise of Boring Technology',
    blurb:
      'The unglamorous case for tools whose bugs have already been found by someone else.',
    category: 'Engineering',
    date: 'Jul 2026',
    readMins: 2,
    href: '/blogs/boring-technology',
    body: `Every project starts with the same temptation: reach for the shiny new thing. A framework that shipped last week, a database with a manifesto, a language feature three people understand. It feels like progress. Often it's just risk wearing a nice hat.

I've come around to the opposite instinct — reach for boring technology first.

## What "boring" actually means

Boring doesn't mean bad. It means *proven*. Postgres, a plain REST API, a job queue that's existed for a decade — these are boring the way a bridge is boring. You don't want a bridge with surprising opinions.

The value is simple: someone has already hit the bug you're about to hit, written it up, and answered it on a forum at 2am. Boring technology comes with years of other people's pain already paid off.

> The best code is the code you never had to debug, because someone else already did.

## Where to spend your novelty budget

You only get so much novelty per project. Spend it where it matters:

- Spend it on the problem that's actually unique to your product.
- Save it on the stuff every app needs — auth, storage, deploys.
- Never spend it on three new things at once. When something breaks, you won't know which bet failed.

New tools are worth trying — I spin them up on weekends constantly. But there's a difference between playing with a tool and betting a deadline on it. Play on Saturday; ship on Monday with something that already works.

The unglamorous truth is that the interesting problems usually aren't in the framework. They're in the domain — the messy, specific thing your software is actually *for*. Boring tools get out of the way so you can spend your attention there.

Choose boring. Be interesting with what you build on top.`,
  },
  {
    id: 'read-the-error-message',
    slug: 'read-the-error-message',
    title: 'Read the Error Message',
    blurb:
      'The most underrated debugging skill is the one that sounds too obvious to say out loud.',
    category: 'Notes',
    date: 'Jul 2026',
    readMins: 2,
    href: '/blogs/read-the-error-message',
    body: `There's a debugging skill nobody teaches because it sounds insulting: read the error message. All of it. Slowly.

I've lost more hours than I'll admit skimming a stack trace, deciding what I *thought* was wrong, and fixing that instead. The error was right there the whole time, spelling out the answer in plain language while I argued with it.

## The pattern

It usually goes like this. Something breaks, you feel a flash of certainty — "oh, it's the database connection" — and you're off: changing config, restarting things, googling symptoms. Twenty minutes later you scroll back up and the very first line says:

\`\`\`
NullReferenceException: 'user' was null at Checkout.cs:42
\`\`\`

Not the database. Line 42. A null user. The message knew. You just didn't look.

## A slower loop that's actually faster

Now I make myself do a boring little checklist before touching anything:

- Read the **last** line — the actual exception — and the first line of *my* code in the trace.
- Say what it claims out loud: "it says user is null on line 42."
- Only *then* form a theory.

It feels slower. It isn't. The fast-feeling loop — guess, change, rerun — is exactly how you lose an afternoon to a typo.

> Most bugs aren't mysteries. They're messages you skipped.

Modern errors are trying so hard to help: stack traces, line numbers, suggested fixes, sometimes a link to the exact answer. Treating them as noise to scroll past is like ignoring a map because you're sure you know the way.

So the unglamorous move — the one that separates a calm debugger from a frantic one — is to slow down for ten seconds and actually read. The computer already told you what's wrong. Believe it.`,
  },
  {
    id: 'hello-welcome',
    slug: 'hello-welcome',
    title: 'Hello, and welcome',
    blurb: "Opening the door — what this blog is for, and what I'll be writing about.",
    category: 'Meta',
    date: 'Jul 2026',
    readMins: 1,
    href: '/blogs/hello-welcome',
    body: `Hi — I'm Saksham, and this is the start of my writing corner on the site.

I build backend systems for a living, so most of what lands here will come from that world: things I learn, bugs that taught me something, tools I lean on, and the occasional look under the hood. Expect notes on .NET, APIs, databases, and open source — plus whatever I'm currently figuring out.

I don't want to box it in, though. If a book, a side project, or a random idea feels worth sharing, it might show up here too.

Writing forces me to actually understand the things I think I know, so honestly, a lot of this is for me. If it turns out useful to you as well, even better.

I'm also open to suggestions. If there's something you'd like me to write about, tell me — the contact details are a click away. Consider this first post me saying hello and opening the door.

Thanks for stopping by. More soon.`,
  },
]

/* ----------------------------------------------------------------- *
 * 07 — Contact
 * ----------------------------------------------------------------- */
export const contact = {
  email: 'sakshammahajan2004@gmail.com',
}

/**
 * Résumé link — served from public/. Drop the PDF in `public/` with this
 * exact name (or swap the href for a Drive link) and both the contact row
 * and the menu pick it up.
 */
export const resume = {
  label: 'Résumé',
  href: '/saksham-mahajan-resume.pdf',
}

export const socials: SocialLink[] = [
  { label: 'Email', href: 'mailto:sakshammahajan2004@gmail.com', handle: 'sakshammahajan2004@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/sakshammjn', handle: '/in/sakshammjn' },
  { label: 'GitHub', href: 'https://github.com/sakshammjn', handle: '@sakshammjn' },
]

/**
 * Newsletter box shown under each blog post.
 *
 * HOW AUTO-NOTIFY WORKS (a static site can't email people itself):
 *   1. Make a free account on an RSS-to-email service — Buttondown recommended
 *      (buttondown.com), or Kit / MailChimp / MailerLite.
 *   2. Turn on its "RSS-to-email" / "RSS campaign" automation and point it at
 *      https://sakshammjn.com/rss.xml  → it auto-emails subscribers whenever a
 *      new post appears in the feed. You just write + publish; it does the rest.
 *   3. Paste the provider's subscribe form URL into `endpoint` below. The form
 *      POSTs `email` (+ `name`) to it; the service stores the subscriber.
 *      (Buttondown's is https://buttondown.com/api/emails/embed-subscribe/<you>.)
 *
 * Leave `endpoint` '' and the form falls back to a pre-filled email to
 * `contact.email`, so it still works before a provider is connected.
 */
export const newsletter = {
  endpoint: '',
  blurb: 'New posts and the occasional shipping story, straight to your inbox.',
  note: 'A couple of times a month. No spam, unsubscribe anytime.',
}
