import { useEffect, useState } from 'react'
import { socials } from '@/data/content'

/**
 * A year of GitHub contributions as a quiet dot-grid — texture, not
 * centrepiece. Empty days use the hairline token, active days step through
 * the ember accent at rising opacity, so the graph reads as an extension of
 * the site's dotted ground in both themes. No month labels, no legend —
 * native tooltips carry the detail; the caption row carries the total.
 *
 * Data comes from the public jogruber contributions proxy (the GraphQL API
 * needs auth). Same resilience contract as useLastShipped: sessionStorage
 * cache, and on any failure the faint empty grid simply stays — the layout
 * never jumps and nothing looks broken.
 */

interface DayCell {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ContribData {
  total: number
  days: DayCell[]
}

const CACHE_KEY = 'contribGraph'
const CACHE_TTL = 30 * 60 * 1000
const CELL = 5 // px on the svg grid
const STEP = 7 // cell + gap
const LEVEL_OPACITY = [0, 0.25, 0.45, 0.7, 1]

function useContributions(): ContribData | null {
  const [data, setData] = useState<ContribData | null>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (!cached) return null
      const { at, data } = JSON.parse(cached) as { at: number; data: ContribData }
      return Date.now() - at < CACHE_TTL ? data : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (data) return
    const github = socials.find((s) => s.label === 'GitHub')
    const username = github?.href.split('/').filter(Boolean).pop()
    if (!username) return
    const ctrl = new AbortController()
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (json: {
          total?: Record<string, number>
          contributions?: DayCell[]
        } | null) => {
          if (!json?.contributions?.length) return
          const next: ContribData = {
            total: json.total?.lastYear ?? 0,
            days: json.contributions,
          }
          setData(next)
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ at: Date.now(), data: next }),
            )
          } catch {
            /* private mode */
          }
        },
      )
      .catch(() => {
        /* offline / rate-limited — the empty grid stays, by design */
      })
    return () => ctrl.abort()
  }, [data])

  return data
}

export function ContribGraph() {
  const data = useContributions()
  const github = socials.find((s) => s.label === 'GitHub')

  // Before (or without) data: a year of empty cells, so nothing jumps.
  const days: DayCell[] =
    data?.days ??
    Array.from({ length: 365 }, () => ({ date: '', count: 0, level: 0 }))
  const firstDow = data?.days.length
    ? new Date(data.days[0].date).getDay()
    : 0
  const weeks = Math.ceil((days.length + firstDow) / 7)

  return (
    <div className="mt-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
          last 365 days on github
        </span>
        {data && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
            {data.total.toLocaleString()} contributions
          </span>
        )}
      </div>
      <a
        href={github?.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={
          data
            ? `${data.total} GitHub contributions in the last year`
            : 'GitHub contribution graph'
        }
        className="block opacity-80 transition-opacity duration-300 hover:opacity-100"
      >
        <svg
          viewBox={`0 0 ${weeks * STEP - (STEP - CELL)} ${7 * STEP - (STEP - CELL)}`}
          className="block w-full"
          shapeRendering="crispEdges"
          aria-hidden
        >
          {days.map((d, i) => {
            const slot = i + firstDow
            const week = Math.floor(slot / 7)
            const dow = slot % 7
            return (
              <rect
                key={d.date || i}
                x={week * STEP}
                y={dow * STEP}
                width={CELL}
                height={CELL}
                className={d.level === 0 ? 'fill-line' : 'fill-accent'}
                opacity={d.level === 0 ? 1 : LEVEL_OPACITY[d.level]}
              >
                {d.date && (
                  <title>{`${d.count} contribution${d.count === 1 ? '' : 's'} · ${d.date}`}</title>
                )}
              </rect>
            )
          })}
        </svg>
      </a>
    </div>
  )
}
