import { useEffect, useState } from 'react'
import { socials } from '@/data/content'

/**
 * The most recent public "ship" on GitHub — the latest push (or PR / repo
 * creation) fetched client-side from the events API. Shared by the contact
 * band (" Xm ago") and the menu panel ("last shipped … · repo").
 *
 * Resolves to null on any failure (offline, rate limit) — consumers render
 * nothing rather than a broken state. Responses are cached in sessionStorage
 * for 10 minutes to stay well under GitHub's unauthenticated rate limit, and
 * the in-flight request is deduped so both consumers share one fetch.
 */

export interface Shipped {
  repo: string
  url: string
  at: string
}

const CACHE_KEY = 'lastShipped'
const CACHE_TTL = 10 * 60 * 1000

/** Event types that count as "shipping" — pushes first, PRs as fallback. */
const SHIP_EVENTS = ['PushEvent', 'PullRequestEvent', 'CreateEvent']

export function relative(iso: string): string {
  const mins = Math.max(1, Math.floor((Date.now() - Date.parse(iso)) / 60_000))
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function readCache(): Shipped | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { at, data } = JSON.parse(cached) as { at: number; data: Shipped }
    return Date.now() - at < CACHE_TTL ? data : null
  } catch {
    return null
  }
}

function fetchShipped(): Promise<Shipped | null> {
  const github = socials.find((s) => s.label === 'GitHub')
  const username = github?.href.split('/').filter(Boolean).pop()
  if (!username) return Promise.resolve(null)

  return fetch(`https://api.github.com/users/${username}/events/public?per_page=30`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then(
      (events: Array<{ type: string; created_at: string; repo: { name: string } }>) => {
        const event = events.find((e) => SHIP_EVENTS.includes(e.type))
        if (!event) return null
        const data: Shipped = {
          repo: event.repo.name.split('/')[1] ?? event.repo.name,
          url: `https://github.com/${event.repo.name}`,
          at: event.created_at,
        }
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
        } catch {
          /* storage full/blocked — fine, just uncached */
        }
        return data
      },
    )
    .catch(() => null)
}

let inflight: Promise<Shipped | null> | null = null

export function useLastShipped(): Shipped | null {
  const [shipped, setShipped] = useState<Shipped | null>(readCache)

  useEffect(() => {
    if (shipped) return
    let cancelled = false
    inflight ??= fetchShipped()
    inflight.then((data) => {
      // A failed fetch isn't cached — the next mount gets a fresh try.
      if (data === null) inflight = null
      if (!cancelled && data) setShipped(data)
    })
    return () => {
      cancelled = true
    }
  }, [shipped])

  return shipped
}
