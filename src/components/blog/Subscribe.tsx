import { useEffect, useState } from 'react'
import { contact, newsletter } from '@/data/content'

/**
 * The under-post newsletter box. On-brand (hairline box, mono labels, bordered
 * CTA — no solid accent slab). Offers the RSS feed as the no-email alternative.
 *
 * With `newsletter.endpoint` set (Buttondown), this is a plain HTML form that
 * POSTs to Buttondown in a new tab. Buttondown requires a real form submit —
 * not fetch() — because a subscriber may need to pass a CAPTCHA or fix a
 * validation error on its response page; it then sends a double opt-in email.
 * The page can't see what happens over there, so the note goes in two steps:
 * "finish up in the buttondown tab" while they're away, then — once they come
 * back to this tab — a thank-you with a nudge to confirm from their inbox.
 *
 * With no endpoint it falls back to a pre-filled mailto to the author — and
 * says so, since the visitor still has to press send.
 */
type State = 'idle' | 'error' | 'pending' | 'returned' | 'drafted'

/** What the box says once the form is sent, by stage. */
const NOTES = {
  pending: 'almost there — finish up in the buttondown tab that just opened.',
  returned:
    'thanks for subscribing — confirm from your inbox if you haven’t already. talk soon.',
  drafted: 'almost there — just press send in your email app.',
} as const

export function Subscribe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  // While Buttondown is open in the other tab, wait for the visitor to come
  // back to this one, then swap "finish up there" for the thank-you.
  useEffect(() => {
    if (state !== 'pending') return
    const onBack = () => {
      if (document.visibilityState === 'visible') setState('returned')
    }
    window.addEventListener('focus', onBack)
    document.addEventListener('visibilitychange', onBack)
    return () => {
      window.removeEventListener('focus', onBack)
      document.removeEventListener('visibilitychange', onBack)
    }
  }, [state])

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      e.preventDefault()
      setState('error')
      return
    }
    if (!newsletter.endpoint) {
      // No provider yet — hand the details to the author by email.
      e.preventDefault()
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
        'Subscribe me to the newsletter',
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}`)}`
      setState('drafted')
      return
    }
    // Let the native submit run (Buttondown opens in a new tab), and swap in
    // the note on the next tick — unmounting the form inside this handler
    // would cancel the submission.
    window.setTimeout(() => setState('pending'), 0)
  }

  const field =
    'w-full border border-line bg-transparent px-4 py-3 font-mono text-sm text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none'

  const note =
    state === 'pending' || state === 'returned' || state === 'drafted'
      ? NOTES[state]
      : null

  return (
    <section className="border border-line p-6 sm:p-8">
      {note ? (
        <p className="font-mono text-sm text-fg">
          <span className="text-accent">✓</span> {note}
        </p>
      ) : (
        <>
          <p className="text-[1.05rem] leading-relaxed text-fg/85">
            {newsletter.blurb}
          </p>
          <form
            action={newsletter.endpoint || undefined}
            method="post"
            target="_blank"
            onSubmit={submit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="metadata__name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              aria-label="Your name"
              className={`${field} sm:flex-1`}
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state === 'error') setState('idle')
              }}
              placeholder="your email"
              aria-label="Your email"
              required
              className={`${field} sm:flex-1`}
            />
            <button
              type="submit"
              className="shrink-0 border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-ink"
            >
              subscribe
            </button>
          </form>
          <p className="mt-3 font-mono text-[11px] text-fg-faint">
            {state === 'error'
              ? "that didn't go through — check the email and try again."
              : newsletter.note}
            <span className="px-1.5 text-accent">·</span>
            <a href="/rss.xml" className="transition-colors hover:text-accent">
              or grab the RSS feed
            </a>
          </p>
        </>
      )}
    </section>
  )
}
