import { profile } from '@/data/content'

/**
 * The last line of the page — a quiet two-part strip: copyright and the
 * rights/wrongs quip on one side, the console easter-egg hint on the other.
 * Stacks centred on phones, spreads into a justified row from sm up.
 */
export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center sm:flex-row sm:items-baseline sm:justify-between sm:text-left">
        <p className="font-mono text-xs text-fg-faint">
          © {new Date().getFullYear()} {profile.name} mahajan
          <span className="px-2 text-accent">·</span>
          <span className="italic opacity-80">
            ALL RIGHTS RESERVED. ALL WRONGS REVERSED.
          </span>
        </p>
        <p className="font-mono text-xs italic text-fg-faint opacity-80">
          psst — the console (f12) knows a few tricks.
        </p>
      </div>
    </footer>
  )
}
