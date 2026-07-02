import { useEffect, useState } from 'react'

/** Calendar-aware breakdown of the span between two instants. */
function breakdown(from: Date, to: Date) {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  const anchor = new Date(from)
  anchor.setMonth(from.getMonth() + months)
  if (anchor.getTime() > to.getTime()) {
    months -= 1
    anchor.setMonth(anchor.getMonth() - 1)
  }
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
