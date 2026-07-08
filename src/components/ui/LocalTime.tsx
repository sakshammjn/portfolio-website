import { useEffect, useState } from 'react'
import { profile } from '@/data/content'

// India runs at a fixed UTC+5:30 (no DST) — 330 minutes ahead of UTC.
const IST_OFFSET_MIN = 330

const fmt = (date: Date, timeZone?: string) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(date)

/**
 * A quiet, live line in the contact band: the visitor's local time next to
 * Saksham's — a small nod to working comfortably across time zones. Refreshes
 * every 30s and collapses gracefully when the visitor shares his timezone.
 */
export function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const mine = fmt(now, profile.timeZone)
  // getTimezoneOffset() is minutes behind UTC, so IST visitors read -330.
  const sameZone = now.getTimezoneOffset() === -IST_OFFSET_MIN

  return (
    <p className="font-mono text-[13px] uppercase tracking-[0.15em] text-fg-faint">
      {sameZone ? (
        <>
          <span className="font-medium text-fg">{mine}</span> for both of us
        </>
      ) : (
        <>
          <span className="font-medium text-fg">{fmt(now)}</span> your time
          <span className="px-2 text-accent">·</span>
          <span className="font-medium text-fg">{mine}</span> mine
        </>
      )}
      <span className="text-fg-faint">
        {' '}— {profile.location}, {profile.utcLabel}
      </span>
    </p>
  )
}
