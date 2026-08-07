import type { ReactNode } from 'react'
import { Reveal } from './PageTransition'

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
      <Reveal>
        {eyebrow && <p className="label mb-4">{eyebrow}</p>}
        <h1 className="text-balance font-display text-h1 font-extrabold uppercase">{title}</h1>
        {children && <div className="mt-6 max-w-prose text-fg-muted">{children}</div>}
      </Reveal>
    </header>
  )
}
