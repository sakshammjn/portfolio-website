/**
 * Single source of truth for all portfolio content.
 *
 * ✏️  Everything a visitor reads lives here — edit this file to update the site.
 *     Placeholders in [brackets] are meant to be replaced with your real details.
 */

export interface NavChapter {
  id: string
  index: string
  label: string
}

export interface SkillTag {
  label: string
}

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

export interface Hobby {
  id: string
  emoji: string
  title: string
  detail: string
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
  name: 'Saksham Mahajan',
  role: '.NET Developer · Security Enthusiast',
  location: 'India',
  intro:
    'I build secure, scalable software with .NET and C#, and I am fascinated by the space where solid engineering meets security. What follows is not a résumé — it is a journey through the milestones that shaped how I think and build.',
  // Used by the hero word-rotator
  facets: ['build with .NET', 'think about security', 'learn relentlessly', 'love the game'],
}

/* ----------------------------------------------------------------- *
 * Chapter navigation (the on-screen "metro map")
 * ----------------------------------------------------------------- */
export const chapters: NavChapter[] = [
  { id: 'intro', index: '00', label: 'Introduction' },
  { id: 'education', index: '01', label: 'Education' },
  { id: 'global', index: '02', label: 'Global Exposure' },
  { id: 'experience', index: '03', label: 'Experience' },
  { id: 'projects', index: '04', label: 'Projects' },
  { id: 'achievements', index: '05', label: 'Achievements' },
  { id: 'beyond', index: '06', label: 'Beyond Code' },
  { id: 'contact', index: '07', label: 'Contact' },
]

/* ----------------------------------------------------------------- *
 * 01 — Education
 * ----------------------------------------------------------------- */
export const education: TimelineCard[] = [
  {
    id: 'btech',
    title: 'B.Tech — Computer Science & Engineering (IoT)',
    subtitle: '[University Name]',
    period: '[2021] – [2025]',
    description:
      'A specialisation in the Internet of Things gave me a systems-level view of software — from constrained embedded devices all the way up to the cloud. I graduated with a CGPA of 9.41, consistently ranking among the top of my cohort while balancing internships and self-driven projects.',
    tags: ['CGPA 9.41 / 10', 'IoT Specialisation', 'Data Structures', 'Networks'],
  },
]

export const educationHighlight = {
  metric: '9.41',
  metricLabel: 'CGPA / 10',
  caption: 'Top of cohort across the program',
}

/* ----------------------------------------------------------------- *
 * 02 — Global exposure
 * ----------------------------------------------------------------- */
export const global: TimelineCard[] = [
  {
    id: 'russia',
    title: 'Sponsored University Programme — Russia',
    subtitle: 'International academic exposure',
    period: '[Year]',
    description:
      'Selected for a fully sponsored university programme in Russia — a chance to study, collaborate and live within an entirely different academic and cultural system. It reshaped how I approach problems: more perspectives, fewer assumptions, and a genuine comfort working across cultures and time zones.',
    tags: ['International Exposure', 'Cross-cultural Collaboration', 'Sponsored Programme'],
  },
]

/* ----------------------------------------------------------------- *
 * 03 — Professional experience
 * ----------------------------------------------------------------- */
export const experience: TimelineCard[] = [
  {
    id: 'dotnet',
    title: 'Software Developer — .NET',
    subtitle: '[Current Company]',
    period: '[2024] – Present',
    description:
      'Designing and shipping backend services and APIs with C# and the .NET stack, backed by MySQL and deployed on Microsoft Azure. Day to day, I focus on clean architecture, reliable data access, and cloud deployments that scale without surprises.',
    tags: ['.NET', 'C#', 'MySQL', 'Azure', 'REST APIs', 'Entity Framework'],
  },
  {
    id: 'cybersec',
    title: 'Cybersecurity Intern',
    subtitle: '[Company / Lab]',
    period: '[Year]',
    description:
      'Worked hands-on with security tooling and threat analysis — understanding how systems are attacked so I can build software that defends against it. This is where my conviction took shape: security is not a feature you bolt on, it is a way of thinking from the first line of code.',
    tags: ['Threat Analysis', 'Security Tooling', 'Vulnerability Assessment'],
  },
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
  },
  {
    id: 'more',
    name: 'And more',
    tagline: 'Experiments, tools & coursework',
    description:
      'A trail of smaller projects — security utilities, IoT experiments and coursework — where most of the real learning happened.',
    stack: ['C#', 'Python', 'JavaScript'],
    repo: '[github-profile]',
  },
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
 * 06 — Beyond code
 * ----------------------------------------------------------------- */
export const hobbies: Hobby[] = [
  {
    id: 'french',
    emoji: '🇫🇷',
    title: 'Learning French',
    detail:
      'Maintaining a daily French learning streak — the same compounding discipline I bring to code, one small consistent step at a time.',
  },
  {
    id: 'football',
    emoji: '⚽',
    title: 'Football — Visca Barça',
    detail:
      'A devoted FC Barcelona supporter. I love the game for the same reason I love systems: it rewards patience, structure and a beautiful idea executed together.',
  },
  {
    id: 'curiosity',
    emoji: '📚',
    title: 'Always Curious',
    detail:
      'Reading about security, technology and how things work — chasing the next thing worth understanding.',
  },
]

/* ----------------------------------------------------------------- *
 * 07 — Contact
 * ----------------------------------------------------------------- */
export const contact = {
  email: 'saksham@example.com', // ✏️ replace with your public email
  blurb:
    'Building something secure, ambitious, or a little unusual? I would love to hear about it.',
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/[username]', handle: '@[username]' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/[username]', handle: '/in/[username]' },
  { label: 'Email', href: 'mailto:saksham@example.com', handle: 'saksham@example.com' },
]
