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
}

export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  stack: string[]
  link?: string
  repo?: string
  featured?: boolean
}

export interface Achievement {
  id: string
  title: string
  detail: string
  year?: string
}

export interface BlogPost {
  id: string
  title: string
  blurb: string
  /** Short topic label, shown small + uppercase on the right. */
  category: string
  /** Human date, e.g. 'Feb 2026'. */
  date: string
  /** Rough reading-time estimate in minutes. */
  readMins: number
  /** Where the post opens. Use '#' until the post exists. */
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
  'Machine Learning',
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
      'Four years of convincing machines to talk to each other — from tiny embedded chips all the way up to the cloud. Specialised in IoT, stayed near the top of the cohort, and never skipped the fun: internships, side projects, and the occasional all-nighter.',
    tags: ['Programming', 'IoT Specialisation', 'Data Structures', 'Networks'],
  },
]

export const educationHighlight = {
  metric: '9.50',
  metricLabel: 'CGPA / 10',
  caption: 'Top of cohort across the program',
}

/* ----------------------------------------------------------------- *
 * 02 — Global exposure
 * ----------------------------------------------------------------- */
export const global: TimelineCard[] = [
  {
    id: 'russia',
    title: 'International Exchange Programme — Russia',
    subtitle: 'Ural Federal University',
    period: '2025',
    description:
      'Selected for a fully sponsored university programme in Russia — a chance to study, collaborate and live within an entirely different academic and cultural system. I tend to chase whatever genuinely interests me, so I picked up Russian along the way. It reshaped how I approach problems: more perspectives, fewer assumptions, and a genuine comfort working across cultures and time zones.',
    tags: ['International Exposure', 'Cross-cultural Collaboration', 'Sponsored Programme'],
  },
]

/* ----------------------------------------------------------------- *
 * 03 — Professional experience
 * ----------------------------------------------------------------- */
export const experience: TimelineCard[] = [
  {
    id: 'dotnet',
    title: 'Software Developer',
    subtitle: 'Miracle Accounting Software',
    period: '2026 – Present',
    description:
      'Designing and shipping backend services and APIs with C# and the .NET stack, backed by MySQL and deployed on Microsoft Azure. Day to day, I focus on clean architecture, reliable data access, and cloud deployments that scale without surprises.',
    tags: ['.NET', 'C#', 'MySQL', 'Azure', 'REST APIs', 'Entity Framework'],
  }
]

/* ----------------------------------------------------------------- *
 * 04 — Projects
 * ----------------------------------------------------------------- */
export const projects: Project[] = [
  {
    id: 'phishing',
    name: 'Phishing Website Detection',
    tagline: 'Machine learning that spots malicious URLs',
    description:
      'A machine-learning system that classifies websites as legitimate or phishing by engineering features from URL structure, domain signals and page content. Brings my security mindset and ML together into a single, practical defence.',
    stack: ['Python', 'scikit-learn', 'Feature Engineering', 'ML'],
    repo: '[github-link]',
    featured: true,
  },
  {
    id: 'learnova',
    name: 'Learnova',
    tagline: 'A modern learning platform',
    description:
      'An ed-tech platform built to make structured learning feel effortless — course delivery, progress tracking and a clean, focused interface for learners.',
    stack: ['React', 'Node.js', 'MongoDB', 'REST'],
    repo: '[github-link]',
    featured: true,
  },
  {
    id: 'studynotion',
    name: 'StudyNotion',
    tagline: 'Full-stack ed-tech application',
    description:
      'A full-stack ed-tech application covering authentication, course management, payments and content delivery — built end-to-end to understand a production web app from database to UI.',
    stack: ['React', 'Express', 'MongoDB', 'Tailwind'],
    repo: '[github-link]',
    featured: true,
  }
]

/* ----------------------------------------------------------------- *
 * 05 — Achievements
 * ----------------------------------------------------------------- */
export const achievements: Achievement[] = [
  {
    id: 'gsoc',
    title: 'Google Summer of Code',
    detail:
      'Involvement with Google Summer of Code — contributing to open source and collaborating with global maintainers.',
    year: '[Year]',
  },
  {
    id: 'nptel',
    title: 'NPTEL — Top 5%',
    detail: 'Finished in the top 5% of an NPTEL certification course.',
    year: '[Year]',
  },
  {
    id: 'certifications',
    title: 'Professional Certifications',
    detail: 'Certified across cloud, security and software development fundamentals.',
    year: '[Year]',
  },
  {
    id: 'academic',
    title: 'Academic Distinction',
    detail: 'Consistent academic excellence with a 9.41 CGPA across the B.Tech program.',
    year: '[2021]–[2025]',
  },
]

/* ----------------------------------------------------------------- *
 * 06 — Blog / essays  (rendered on the /blogs page)
 *
 * ✏️  Replace these starters with your real posts. Set `href` to the post URL
 *     and `external: true` for anything hosted off-site (Medium, Substack…).
 * ----------------------------------------------------------------- */
export const blogPosts: BlogPost[] = [
  {
    id: 'first',
    title: '[Your first essay title]',
    blurb: 'A one-line teaser that makes someone want to read it.',
    category: 'Engineering',
    date: 'Feb 2026',
    readMins: 6,
    href: '#',
  },
  {
    id: 'second',
    title: '[Your second essay title]',
    blurb: 'What you learned, argued, or built — in a single sentence.',
    category: 'Security',
    date: 'Feb 2026',
    readMins: 9,
    href: '#',
  },
  {
    id: 'third',
    title: '[Your third essay title]',
    blurb: 'Another hook. Keep it concrete and specific.',
    category: 'Notes',
    date: 'Jan 2026',
    readMins: 4,
    href: '#',
  },
]

/* ----------------------------------------------------------------- *
 * 07 — Contact
 * ----------------------------------------------------------------- */
export const contact = {
  email: 'sakshammahajan2004@gmail.com',
  blurb:
    'Building something secure, ambitious, or a little unusual? I would love to hear about it.',
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/sakshammjn', handle: '@sakshammjn' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/sakshammjn', handle: '/in/sakshammjn' },
  { label: 'Email', href: 'mailto:saksham@example.com', handle: 'saksham@example.com' },
]
