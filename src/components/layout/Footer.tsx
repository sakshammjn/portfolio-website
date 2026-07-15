import { profile } from '@/data/content'
import { CURRENT_VERSION } from '@/data/changelog'
import { FooterWalker } from '@/components/effects/FooterWalker'

/**
 * The last line of the page — the quiet copyright strip (with the version
 * linking to /changelog), and the pixel critter out on its walk along the
 * footer's top hairline (feet on the rule).
 *
 * `walker` can be turned off where a page already has its own critter — the
 * 404, where a second one in the footer would just be odd.
 */
export function Footer({ walker = true }: { walker?: boolean }) {
  return (
    <footer className="relative border-t border-line px-6 py-8">
      {walker && <FooterWalker />}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <p className="font-mono text-xs text-fg-faint">
          © {new Date().getFullYear()} {profile.name} mahajan
          <span className="px-2 text-accent">·</span>
          <a
            href="/changelog"
            className="text-fg-muted transition-colors hover:text-accent"
          >
            {CURRENT_VERSION}
          </a>
          <span className="px-2 text-accent">·</span>
          <span className="italic opacity-80">
            ALL RIGHTS RESERVED. ALL WRONGS REVERSED.
          </span>
        </p>
      </div>
    </footer>
  )
}
