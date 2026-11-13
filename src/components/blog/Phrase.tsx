/**
 * A spoken line set like a phrasebook entry: the language named small in
 * mono, the line large in the display face with each word glossed in mono
 * underneath (interlinear), then the plain meaning. The language name comes
 * from its code via Intl.DisplayNames, so nothing is hardcoded. The gloss is
 * only drawn when it has exactly one entry per word, and it's hidden from
 * screen readers, which get the line and its meaning instead.
 */
export function Phrase({
  lang,
  line,
  meaning,
  gloss,
}: {
  lang: string
  line: string
  meaning?: string
  gloss?: string
}) {
  const words = line.split(/\s+/)
  const glosses = gloss ? gloss.split(/\s+/) : []
  const glossed = glosses.length === words.length

  let language = lang
  try {
    language =
      new Intl.DisplayNames(['en'], { type: 'language' }).of(lang) ?? lang
  } catch {
    /* old browser or odd code: show the code itself */
  }

  return (
    <figure className="my-10 border-y border-line py-8">
      <figcaption className="mb-5 font-mono text-[11px] lowercase tracking-[0.2em] text-fg-faint">
        {language}
      </figcaption>
      <p
        lang={lang}
        className="flex flex-wrap gap-x-5 gap-y-4 font-hero text-3xl font-semibold tracking-tight text-fg sm:text-4xl"
      >
        {words.map((w, i) => (
          <span key={i} className="group inline-flex flex-col">
            <span className="transition-colors group-hover:text-accent">
              {w}
            </span>
            {glossed && (
              <span
                aria-hidden
                lang="en"
                className="mt-2 font-mono text-[11px] font-normal lowercase tracking-wider text-fg-faint transition-colors group-hover:text-fg-muted"
              >
                {glosses[i]}
              </span>
            )}
          </span>
        ))}
      </p>
      {meaning && (
        <p lang="en" className="mt-6 text-lg italic text-fg-muted">
          {meaning}
        </p>
      )}
    </figure>
  )
}
