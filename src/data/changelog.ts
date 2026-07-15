/**
 * The site's release history — rendered at /changelog, versioned in the
 * footer. Newest first. Dates follow the real commit history; every note
 * describes something that shipped in that bump and is still on the site.
 * Plain language on purpose — no jargon, no poetry.
 *
 * ✏️  When you ship something noteworthy, add a release (or grow the top
 *     one before it's "cut") and bump the version the footer shows.
 */

export interface Release {
  version: string
  name: string
  date: string
  notes: string[]
}

export const releases: Release[] = [
  {
    version: 'v1.2',
    name: 'the blog',
    date: '16 jul 2026',
    notes: [
      'the writing section is live — posts are written in markdown and shown in a clean, built-in reader',
      'you can listen to a post read aloud, look up any word, or copy a link to a single line',
      'subscribe by email, or follow along with the rss feed',
    ],
  },
  {
    version: 'v1.1',
    name: 'small touches',
    date: '13 jul 2026',
    notes: [
      'added a short about section up top',
      'a real 404 page now shows up for broken links',
      'the footer critter naps late at night — and you can pick it up and toss it around',
    ],
  },
  {
    version: 'v1.0',
    name: 'launch',
    date: '12 jul 2026',
    notes: [
      'github contribution graph added to the open source chapter',
      'this changelog page',
      'fixed direct links to /blogs and /changelog on the live site',
    ],
  },
  {
    version: 'v0.7',
    name: 'special days',
    date: '12 jul 2026',
    notes: [
      'the footer critter now dresses up for ~70 special days of the year',
      'hover over it to see which day it is',
      "browse and try every outfit from ⌘k → 'critter calendar'",
    ],
  },
  {
    version: 'v0.6',
    name: 'the critter',
    date: '11 jul 2026',
    notes: [
      'added a small pixel mascot that walks along the footer',
      'hover and it stops, click and it runs away, leave it alone and it falls asleep',
      'you can pick it up and drag it around — it does not enjoy this',
      "type 'release the critters' in ⌘k for a parade",
    ],
  },
  {
    version: 'v0.5',
    name: 'theme wipe & hero split',
    date: '10 jul 2026',
    notes: [
      'switching themes now plays a diagonal wipe animation',
      'the hero splits in two as you scroll, revealing the first chapter',
      'fixed layout issues on mobile screens',
    ],
  },
  {
    version: 'v0.4',
    name: 'motion & command palette',
    date: '07 jul 2026',
    notes: [
      'animations now follow your scroll — scroll back and they reverse',
      'added the ⌘k command palette: jump to sections, copy the email, get the résumé',
      'added a light theme, switchable from the palette',
    ],
  },
  {
    version: 'v0.3',
    name: 'new pages & contact',
    date: '03 jul 2026',
    notes: [
      'added a slide-in menu and a /blogs page',
      'new open source chapter with issues filed and merged prs',
      'contact section redesigned: email, résumé, socials and local time',
      'added seo basics — og image, sitemap, meta tags',
    ],
  },
  {
    version: 'v0.2',
    name: 'the redesign',
    date: '29 jun 2026',
    notes: [
      'new look: bold display type, mono labels, thin rules, numbered chapters',
      'one orange accent on a near-black background, with a dotted texture',
    ],
  },
  {
    version: 'v0.1',
    name: 'first version',
    date: '22 jun 2026',
    notes: [
      'first working site: hero, six sections and a contact block',
      'dark theme, works on phones and desktops',
      'click anywhere for a small spark effect',
    ],
  },
]

export const CURRENT_VERSION = releases[0].version
