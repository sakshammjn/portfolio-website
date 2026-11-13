import { HelloCycle } from '@/components/blog/HelloCycle'
import { StreakDots } from '@/components/blog/StreakDots'
import { Phrase } from '@/components/blog/Phrase'
import { MorseBracelet, MorseCode } from '@/components/blog/Morse'

/**
 * The registry behind Markdown's `::name args` lines — the small set of
 * interactive figures a post can drop between paragraphs. Args after the
 * name are `|`-separated. Like the rest of the site it fails silent: an
 * unknown name or bad args render nothing rather than a broken figure.
 *
 *   ::hellos                          the splash greetings, on a loop
 *   ::streak 1725 | 500               one dot per day, day 500 missed
 *   ::phrase uz | line | meaning | gloss words (one per word of the line)
 *   ::morse SAKSHAM                   dots and dashes, with "tap it out"
 *   ::bracelet CONSTANT               the same, strung as beads
 */
export function Embed({ name, args }: { name: string; args: string }) {
  const parts = args.split('|').map((s) => s.trim())

  switch (name) {
    case 'hellos':
      return <HelloCycle />
    case 'streak': {
      const days = Number(parts[0])
      const missed = Number(parts[1])
      if (!Number.isInteger(days) || days < 1) return null
      return (
        <StreakDots
          days={days}
          missed={Number.isInteger(missed) ? missed : undefined}
        />
      )
    }
    case 'phrase':
      if (!parts[0] || !parts[1]) return null
      return (
        <Phrase
          lang={parts[0]}
          line={parts[1]}
          meaning={parts[2]}
          gloss={parts[3]}
        />
      )
    case 'morse':
      return args ? <MorseCode text={args} /> : null
    case 'bracelet':
      return args ? <MorseBracelet text={args} /> : null
    default:
      return null
  }
}
