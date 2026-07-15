/**
 * A tiny console "CLI" for the curious devs and recruiters who pop open
 * DevTools. On load it prints a menu of commands; each command is exposed as a
 * getter on `window`, so visitors just type the word — e.g. `hire` — and hit
 * enter. No parentheses, no slash (those aren't valid JS in the console).
 *
 * Called once at startup from main.tsx.
 *
 * Contact details, socials, résumé and projects are pulled from content.ts —
 * the single source of truth — so this CLI can't drift from the site. Only
 * the console-exclusive lines (about, stack, secret…) live here.
 */
import { contact, profile, projects, resume, socials } from '@/data/content'
import { isLateNight } from '@/lib/seasonal'

// Full origin so the résumé line prints as a clickable URL — and stays
// correct after the custom-domain swap.
const origin = typeof window !== 'undefined' ? window.location.origin : ''

const content = {
  hire: [
    "open to opportunities — let's build something.",
    `email: ${contact.email}`,
  ],
  about: [
    'Saksham Mahajan — a software engineer',
    'I build services for a product with 100,000+ users,',
    'and fix JSON Schema tooling in open source after hours.',
  ],
  contact: [
    `email:    ${contact.email}`,
    `location: ${profile.location} (${profile.utcLabel})`,
    'replies:  within a day',
  ],
  stack: [
    'languages: C#, TypeScript, Python, C++, SQL',
    'backend:   .NET Core, REST APIs, Entity Framework, Flask',
    'data:      MySQL, MongoDB, Redis',
    'frontend:  React, Tailwind',
  ],
  socials: socials
    .filter((s) => s.href.startsWith('http'))
    .map((s) => `${(s.label.toLowerCase() + ':').padEnd(10)}${s.href}`),
  resume: [`resume: ${origin}${resume.href}`],
  projects: [
    ...projects.map((p, i) => `${i + 1}. ${p.name} — ${p.tagline}`),
    '',
    '...or just scroll the site, it is all there.',
  ],
}

// Command name + its one-line description shown in the menu.
const MENU: Array<[keyof typeof content | 'help', string]> = [
  ['help', 'show this menu again'],
  ['hire', "let's work together"],
  ['about', 'who I am'],
  ['contact', 'how to reach me'],
  ['stack', 'tech I work with'],
  ['socials', 'find me online'],
  ['resume', 'grab my CV'],
  ['projects', 'things I built']
]

function printLines(lines: string[]) {
  console.log(lines.join('\n'))
}

function printMenu() {
  const width = Math.max(...MENU.map(([cmd]) => cmd.length))
  const rows = MENU.map(([cmd, desc]) => `  ${cmd.padEnd(width)}  —  ${desc}`)
  console.log(
    [
      isLateNight()
        ? "up this late, in the console? we'd get along."
        : 'heyyy you opened the console. respect.',
      'type one of these and hit enter:',
      '',
      ...rows,
      '',
    ].join('\n'),
  )
}

export function printConsoleGreeting() {
  // Guard against non-browser / SSR contexts.
  if (typeof window === 'undefined' || !window.console) return

  printMenu()

  const commands: Record<string, () => void> = {
    help: printMenu,
    hire: () => printLines(content.hire),
    about: () => printLines(content.about),
    contact: () => printLines(content.contact),
    stack: () => printLines(content.stack),
    socials: () => printLines(content.socials),
    resume: () => printLines(content.resume),
    projects: () => printLines(content.projects),
  }

  // Expose each command as a getter so typing the bare word runs it.
  for (const [name, run] of Object.entries(commands)) {
    try {
      Object.defineProperty(window, name, {
        configurable: true,
        get() {
          run()
          return undefined
        },
      })
    } catch {
      // Property may already exist and be non-configurable; skip it.
    }
  }
}
