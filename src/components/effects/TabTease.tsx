import { useEffect } from 'react'

/** Playful nudges shown in the tab title once the visitor switches away. */
const AWAY_MESSAGES = [
  '👀',
]

/**
 * Swaps the browser-tab title to a random playful nudge when the visitor
 * switches away, and restores the real title the moment they come back.
 * Renders nothing.
 */
export function TabTease() {
  useEffect(() => {
    const original = document.title

    const onVisibility = () => {
      if (document.hidden) {
        const next = AWAY_MESSAGES[Math.floor(Math.random() * AWAY_MESSAGES.length)]
        document.title = next
      } else {
        document.title = original
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      document.title = original
    }
  }, [])

  return null
}
