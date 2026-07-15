import { useState, type ReactNode } from 'react'

/**
 * A fenced code block for the reader: a mono panel with a language tag and a
 * copy button, plus a light, dependency-free syntax tint. The highlighter is
 * deliberately minimal — strings, comments, numbers and a common keyword set —
 * so it reads well across languages without pretending to be a full lexer.
 * Everything stays in the site's palette (one ember accent, mono greys).
 */

const KEYWORDS =
  'const let var function return if else for while do switch case break continue import from export default class new await async public private protected static void int string bool double float using namespace def lambda then end match type interface enum struct null nil true false this self throw try catch finally extends implements yield'.split(
    ' ',
  )

// comment · string · number · keyword — first match wins, rest is plain text.
const TOKEN = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1 comment (// or /* */)
    '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)', // 2 string
    '(\\b\\d[\\d._]*\\b)', // 3 number
    `\\b(${KEYWORDS.join('|')})\\b`, // 4 keyword
  ].join('|'),
  'g',
)

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const [full, comment, str, num] = m
    const cls = comment
      ? 'text-fg-faint italic'
      : str
        ? 'text-accent-soft'
        : num
          ? 'text-fg'
          : 'text-accent'
    out.push(
      <span key={key++} className={cls}>
        {full}
      </span>,
    )
    last = m.index + full.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1400)
      },
      () => {},
    )
  }

  return (
    <div className="my-8 overflow-hidden border border-line">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
          {lang || 'code'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-accent"
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-fg-muted">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}
