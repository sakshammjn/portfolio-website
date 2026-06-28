/**
 * A tiny console "CLI" for the curious devs and recruiters who pop open
 * DevTools. On load it prints a menu of commands; each command is exposed as a
 * getter on `window`, so visitors just type the word — e.g. `hire` — and hit
 * enter. No parentheses, no slash (those aren't valid JS in the console).
 *
 * Called once at startup from main.tsx.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING IN `content` BELOW. The command wiring needs no changes.
 * ─────────────────────────────────────────────────────────────────────────
 */

const content = {
  hire: [
    "open to opportunities — let's build something.",
    'email: saksham.m@rkitsoftware.com',
  ],
  about: [
    'Saksham Mahajan — software engineer.',
    'I build <one-line on what you do / love building>.',
  ],
  contact: [
    'email:    saksham.m@rkitsoftware.com',
    'phone:    +91 XXXXX XXXXX',
    'location: <city, country>',
  ],
  stack: [
    'languages: C++, TypeScript, SQL',
    'backend:   .NET, REST APIs',
    'data:      MongoDB, SQL',
    // add / trim as you like
  ],
  socials: [
    'github:   https://github.com/<username>',
    'linkedin: https://linkedin.com/in/<username>',
  ],
  resume: [
    'resume: <link-to-your-resume.pdf>',
  ],
  projects: [
    '1. <project> — <one-liner>',
    '2. <project> — <one-liner>',
    '3. <project> — <one-liner>',
    '',
    '...or just scroll the site, it is all there.',
  ],
  secret: [
    '<your easter egg / personality payoff goes here>',
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
  ['projects', 'things I built'],
  ['secret', '???'],
]

function printLines(lines: string[]) {
  console.log(lines.join('\n'))
}

function printMenu() {
  const width = Math.max(...MENU.map(([cmd]) => cmd.length))
  const rows = MENU.map(([cmd, desc]) => `  ${cmd.padEnd(width)}  —  ${desc}`)
  console.log(
    [
      'heyyy you opened the console. respect.',
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
    secret: () => printLines(content.secret),
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
