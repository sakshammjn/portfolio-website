import { useState } from 'react'
import { contact, newsletter } from '@/data/content'

/**
 * The under-post newsletter box. On-brand (hairline box, mono labels, bordered
 * CTA — no solid accent slab). Submits to `newsletter.endpoint` when set;
 * otherwise falls back to a pre-filled mailto so it's never a dead form on the
 * static site. Offers the RSS feed as the no-email alternative.
 */
type State = 'idle' | 'sending' | 'done' | 'error'

export function Subscribe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState('error')
      return
    }
    if (!newsletter.endpoint) {
      // No provider yet — hand the details to the author by email.
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
        'Subscribe me to the newsletter',
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}`)}`
      setState('done')
      return
    }
    setState('sending')
    try {
      // Providers' embed endpoints (Buttondown, Kit, MailChimp…) take a
      // form-encoded POST. no-cors submits it cross-origin without needing the
      // provider to send CORS headers; the response is opaque, so we confirm
      // optimistically — the subscriber still lands in the list.
      await fetch(newsletter.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, name }).toString(),
      })
      setState('done')
    } catch {
      setState('error')
    }
  }

  const field =
    'w-full border border-line bg-transparent px-4 py-3 font-mono text-sm text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none'

  return (
    <section className="border border-line p-6 sm:p-8">
      {state === 'done' ? (
        <p className="font-mono text-sm text-fg">
          <span className="text-accent">✓</span> you're on the list — talk soon.
        </p>
      ) : (
        <>
          <p className="text-[1.05rem] leading-relaxed text-fg/85">
            {newsletter.blurb}
          </p>
          <form
            onSubmit={submit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              aria-label="Your name"
              className={`${field} sm:flex-1`}
            />
            <input
              type="email"
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
              disabled={state === 'sending'}
              className="shrink-0 border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-ink disabled:opacity-60"
            >
              {state === 'sending' ? 'sending…' : 'subscribe'}
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
