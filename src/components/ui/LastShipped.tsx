import { useEffect, useState } from 'react'
import { socials } from '@/data/content'

/**
 * A live "last shipped" entry for the contact dot-row — the most recent
 * public push on GitHub, fetched client-side, sitting beside the GitHub
 * link as quiet proof the shipping never stopped.
 *
 * Lives inside the inverted paper band, so it uses the ink tokens (not fg).
 * Renders nothing until the data is in, and stays gone on any failure
 * (offline, rate limit) — the row must never show a broken state.
 * Responses are cached in sessionStorage for 10 minutes to stay well
 * under GitHub's unauthenticated rate limit.
 */

interface Shipped {
  repo: string
  url: string
  at: string
}

const CACHE_KEY = 'lastShipped'
const CACHE_TTL = 10 * 60 * 1000

/** Event types that count as "shipping" — pushes first, PRs as fallback. */
const SHIP_EVENTS = ['PushEvent', 'PullRequestEvent', 'CreateEvent']

function relative(iso: string): string {
  const mins = Math.max(1, Math.floor((Date.now() - Date.parse(iso)) / 60_000))
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function LastShipped() {
  const [shipped, setShipped] = useState<Shipped | null>(null)

  useEffect(() => {
    const github = socials.find((s) => s.label === 'GitHub')
    const username = github?.href.split('/').filter(Boolean).pop()
    if (!username) return

    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const { at, data } = JSON.parse(cached) as { at: number; data: Shipped }
        if (Date.now() - at < CACHE_TTL) {
          setShipped(data)
          return
        }
      }
    } catch {
      /* corrupt cache — fall through to the fetch */
    }

    const controller = new AbortController()
    fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(
        (events: Array<{ type: string; created_at: string; repo: { name: string } }>) => {
          const event = events.find((e) => SHIP_EVENTS.includes(e.type))
          if (!event) return
          const data: Shipped = {
            repo: event.repo.name.split('/')[1] ?? event.repo.name,
            url: `https://github.com/${event.repo.name}`,
            at: event.created_at,
          }
          setShipped(data)
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ at: Date.now(), data }),
            )
          } catch {
            /* storage full/blocked — fine, just uncached */
          }
        },
      )
      .catch(() => {
        /* offline or rate-limited — render nothing */
      })
    return () => controller.abort()
  }, [])

  if (!shipped) return null

  return (
    <a
      href={shipped.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink/60 transition-colors hover:text-accent"
    >
      {/* Accent dot (the row's other dots are neutral) — this one is live. */}
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      shipped {relative(shipped.at)}
      <span aria-hidden className="text-ink/30">·</span>
      <span className="text-ink/80 transition-colors group-hover:text-accent">
        {shipped.repo}
      </span>
    </a>
  )
}
