import type { ReactNode } from 'react'
import { Reveal, SplitText } from './PageTransition'

type Props = {
  /** Sur-titre en majuscules espacées. */
  eyebrow?: string
  title: string
  children?: ReactNode
}

/** En-tête commun aux pages intérieures — même rythme vertical partout. */
export function PageHeader({ eyebrow, title, children }: Props) {
  return (
    <header className="container-rylix pb-md pt-32 md:pb-lg md:pt-40">
      {eyebrow && (
        <Reveal>
          <p className="label mb-4">{eyebrow}</p>
        </Reveal>
      )}
      <SplitText
        as="h1"
        text={title}
        delay={0.06}
        className="text-balance font-display text-h1 font-extrabold uppercase"
      />
      {children && (
        <Reveal delay={0.18}>
          <div className="mt-6 max-w-prose text-fg-muted">{children}</div>
        </Reveal>
      )}
    </header>
  )
}
