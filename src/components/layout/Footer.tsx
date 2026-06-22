import { profile } from '@/data/content'

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="font-mono text-xs text-fg-faint">
          © {profile.name}. Crafted with care.
        </p>
        <p className="font-mono text-xs text-fg-faint">
          Built with React · TypeScript · Tailwind · Framer Motion
        </p>
      </div>
    </footer>
  )
}
