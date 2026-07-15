import { useEffect, useRef, useState } from 'react'

/**
 * Read-aloud — speaks the post with the browser's built-in speech synthesis
 * (no library, no network). Picks a natural-sounding male English voice where
 * one exists, reads slightly slower than default, and feeds the text one
 * sentence at a time so it flows rather than droning — which also sidesteps
 * Chrome's ~15s long-utterance cutoff. Hidden where the API is unavailable;
 * cancels on unmount so navigating away goes quiet.
 */
type State = 'idle' | 'playing' | 'paused'

/** Prefer a fluent, male English voice; fall back gracefully. */
function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => /^en([-_]|$)/i.test(v.lang))
  const pool = en.length ? en : voices
  // Best-known natural male voices first (Google/system), by name.
  const prefs = [
    'google uk english male',
    'microsoft guy',
    'microsoft david',
    'daniel',
    'alex',
    'fred',
    'rishi', // en-IN male, if present
    'google us english',
  ]
  for (const p of prefs) {
    const hit = pool.find((v) => v.name.toLowerCase().includes(p))
    if (hit) return hit
  }
  // Any voice that reads as male by name.
  const male = pool.find((v) =>
    /\b(male|man|guy|david|daniel|alex|fred|george|james|john|oliver|thomas|rishi)\b/i.test(
      v.name,
    ),
  )
  if (male) return male
  // Otherwise the most natural-sounding option available.
  return pool.find((v) => /google|natural|premium|enhanced/i.test(v.name)) ?? pool[0] ?? null
}

/** Split into ~sentence chunks so each utterance is short and well-phrased. */
function toChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|\S.*$/g) ?? [text]
  const chunks: string[] = []
  let cur = ''
  for (const s of sentences) {
    if ((cur + s).length > 220 && cur) {
      chunks.push(cur.trim())
      cur = s
    } else {
      cur += s
    }
  }
  if (cur.trim()) chunks.push(cur.trim())
  return chunks
}

export function ReadAloud({ text }: { text: string }) {
  const [state, setState] = useState<State>('idle')
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  voiceRef.current = voice

  useEffect(() => {
    if (!supported) return
    const load = () => setVoice(pickVoice(window.speechSynthesis.getVoices()))
    load() // some browsers have them ready synchronously
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  if (!supported) return null

  const play = () => {
    const s = window.speechSynthesis
    s.cancel()
    const chunks = toChunks(text)
    chunks.forEach((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk)
      if (voiceRef.current) {
        u.voice = voiceRef.current
        u.lang = voiceRef.current.lang
      }
      u.rate = 0.95 // a touch slower reads as calmer, less synthetic
      u.pitch = 1
      if (i === chunks.length - 1) u.onend = () => setState('idle')
      u.onerror = () => setState('idle')
      s.speak(u)
    })
    setState('playing')
  }

  const toggle = () => {
    const s = window.speechSynthesis
    if (state === 'idle') play()
    else if (state === 'playing') {
      s.pause()
      setState('paused')
    } else {
      s.resume()
      setState('playing')
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setState('idle')
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-accent"
        aria-label={state === 'playing' ? 'Pause reading' : 'Listen to this post'}
      >
        <span aria-hidden className="text-accent">
          {state === 'playing' ? '❚❚' : '▶'}
        </span>
        {state === 'idle' ? 'listen' : state === 'playing' ? 'pause' : 'resume'}
      </button>
      {state !== 'idle' && (
        <button
          type="button"
          onClick={stop}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-accent"
          aria-label="Stop reading"
        >
          stop
        </button>
      )}
    </span>
  )
}
