import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  /** Optional supporting line under the title. */
  lede?: string
  align?: 'left' | 'center'
}

/** Consistent chapter heading: mono eyebrow + serif display title. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'mb-10 text-center' : 'mb-8'}>
      <Reveal>
        <p className="eyebrow mb-3">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p
            className={[
              'mt-4 text-fg-muted',
              centered ? 'mx-auto max-w-xl' : 'max-w-xl',
            ].join(' ')}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}
