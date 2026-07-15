import { type ReactNode } from 'react'
import { CodeBlock } from '@/components/blog/CodeBlock'

/**
 * A tiny, dependency-free Markdown renderer for the blog reader — enough for
 * essays without pulling in a library: headings (##, ###), bold, italic,
 * inline `code`, [links](url), unordered/ordered lists, > blockquotes, ```
 * fenced code, and --- rules. It builds real React nodes (never
 * dangerouslySetInnerHTML), so styling stays in the site's voice and there's
 * no injection surface.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** Flatten markdown to speakable prose for read-aloud. */
export function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*|_([^_]+)_/g, (_, a, b) => a || b)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Headings for the table of contents (h2 only — the section level). */
export function getHeadings(md: string): { id: string; text: string }[] {
  return md
    .split('\n')
    .filter((l) => /^##\s+/.test(l))
    .map((l) => {
      const text = l.replace(/^##\s+/, '').trim()
      return { id: slugify(text), text }
    })
}

// Inline tokens: `code`, **bold**, *italic* / _italic_, [text](url).
const INLINE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*|_[^_]+_)|(\[[^\]]+\]\([^)]+\))/g

function parseInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const [full, code, bold, italic, link] = m
    if (code) {
      out.push(
        <code
          key={key++}
          className="rounded bg-fg/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {code.slice(1, -1)}
        </code>,
      )
    } else if (bold) {
      out.push(
        <strong key={key++} className="font-semibold text-fg">
          {bold.slice(2, -2)}
        </strong>,
      )
    } else if (italic) {
      out.push(
        <em key={key++} className="italic">
          {italic.slice(1, -1)}
        </em>,
      )
    } else if (link) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(link)!
      const external = /^https?:\/\//.test(mm[2])
      out.push(
        <a
          key={key++}
          href={mm[2]}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer noopener' : undefined}
          className="text-fg underline decoration-accent decoration-1 underline-offset-2 transition-colors hover:text-accent"
        >
          {mm[1]}
        </a>,
      )
    }
    last = m.index + full.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Heading({ text }: { text: string }) {
  const id = slugify(text)
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard?.writeText(url).catch(() => {})
    history.replaceState(null, '', `#${id}`)
  }
  return (
    <h2
      id={id}
      className="group mb-4 mt-12 scroll-mt-24 font-hero text-2xl font-semibold tracking-tight text-fg"
    >
      {parseInline(text)}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link to this section"
        className="ml-2 align-middle font-mono text-lg text-accent opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        #
      </button>
    </h2>
  )
}

export function Markdown({ source }: { source: string }): ReactNode {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    // Fenced code.
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++ // closing fence
      blocks.push(<CodeBlock key={key++} code={buf.join('\n')} lang={lang} />)
      continue
    }

    // Headings (## / ###).
    if (/^###\s+/.test(line)) {
      blocks.push(
        <h3
          key={key++}
          className="mb-3 mt-10 font-hero text-xl font-semibold tracking-tight text-fg"
        >
          {parseInline(line.replace(/^###\s+/, ''))}
        </h3>,
      )
      i++
      continue
    }
    if (/^##\s+/.test(line)) {
      blocks.push(<Heading key={key++} text={line.replace(/^##\s+/, '').trim()} />)
      i++
      continue
    }

    // Horizontal rule.
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-12 border-line" />)
      i++
      continue
    }

    // Blockquote.
    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-8 border-l-2 border-accent pl-5 text-lg italic leading-relaxed text-fg-muted"
        >
          {parseInline(buf.join(' '))}
        </blockquote>,
      )
      continue
    }

    // Ordered / unordered lists.
    const ordered = /^\d+\.\s+/.test(line)
    if (ordered || /^[-*]\s+/.test(line)) {
      const items: ReactNode[] = []
      const re = ordered ? /^\d+\.\s+/ : /^[-*]\s+/
      while (i < lines.length && re.test(lines[i])) {
        items.push(
          <li key={items.length} className="pl-1.5">
            {parseInline(lines[i].replace(re, ''))}
          </li>,
        )
        i++
      }
      const cls =
        'my-6 ml-5 flex flex-col gap-2 text-lg leading-relaxed text-fg/85 ' +
        (ordered ? 'list-decimal' : 'list-disc')
      blocks.push(
        ordered ? (
          <ol key={key++} className={cls} style={{ listStyleType: 'decimal' }}>
            {items}
          </ol>
        ) : (
          <ul key={key++} className={cls} style={{ listStyleType: 'disc' }}>
            {items}
          </ul>
        ),
      )
      continue
    }

    // Paragraph — gather consecutive plain lines.
    const buf: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```') &&
      !/^#{2,3}\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      buf.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="mb-6 text-[1.15rem] leading-[1.75] text-fg/85">
        {parseInline(buf.join(' '))}
      </p>,
    )
  }

  return blocks
}
