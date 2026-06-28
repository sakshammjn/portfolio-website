import { profile } from '@/data/content'

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-5xl items-center justify-center text-center">
        <p className="font-mono text-xs text-fg-faint">
          © {new Date().getFullYear()} {profile.name + ' mahajan'}
          <span className="italic opacity-80">
            {' '}— psst, the console (f12) knows a few tricks.
          </span>
        </p>
      </div>
    </footer>
  )
}
