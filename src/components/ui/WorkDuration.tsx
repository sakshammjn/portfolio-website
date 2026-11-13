import { useEffect, useState } from 'react'

// India runs at a fixed UTC+5:30 (no DST).
const IST_OFFSET_MS = 330 * 60_000

/**
 * Calendar-aware breakdown of the span between two instants, counted on IST
 * wall-clock time — the zone `since` is written in — so every visitor sees
 * the same number. (Counted in the visitor's own zone, 1 Jan 00:00 IST lands
 * on 31 Dec for anyone west of India, and adding months to the 31st overflows
 * short months: the ticker froze or ran a day behind.)
 */
function breakdown(fromInstant: Date, toInstant: Date) {
  // Shift both instants so their UTC fields read as IST wall-clock time.
  const from = new Date(fromInstant.getTime() + IST_OFFSET_MS)
  const to = new Date(toInstant.getTime() + IST_OFFSET_MS)
  const anchorAt = (n: number) => {
    const a = new Date(from)
    a.setUTCMonth(from.getUTCMonth() + n)
    return a
  }
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth())
  let anchor = anchorAt(months)
  if (anchor.getTime() > to.getTime()) anchor = anchorAt(--months)
  let rest = Math.max(0, to.getTime() - anchor.getTime())
  const days = Math.floor(rest / 86_400_000)
  rest -= days * 86_400_000
  const hours = Math.floor(rest / 3_600_000)
  rest -= hours * 3_600_000
  const mins = Math.floor(rest / 60_000)
  rest -= mins * 60_000
  const secs = Math.floor(rest / 1_000)
  return { months, days, hours, mins, secs }
}

/**
 * A live "time on the job" ticker — counts up every second from `since`.
 * The small ember dot signals it's running in real time.
 */
export function WorkDuration({ since }: { since: string }) {
  const start = new Date(since)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const { months, days, hours, mins, secs } = breakdown(start, now)

  return (
    <p
      className="mt-2 flex items-center gap-2 font-mono text-xs normal-case tracking-normal text-fg-faint tabular-nums"
      aria-label="Time on the job, counting live"
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
      {months}mo {days}d {hours}h {mins}m {secs}s
    </p>
  )
}
