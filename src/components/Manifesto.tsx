import { Reveal, SplitText } from './PageTransition'
import { manifesto } from '@/lib/content'

/**
 * Statement éditorial — grande typographie cinétique, composition asymétrique.
 * L'index et le sur-titre restent en colonne fixe à gauche pendant que le
 * titre défile en cascade à droite, une ligne à la fois.
 */
export function Manifesto() {
  return (
    <section className="py-lg md:py-xl" aria-labelledby="manifeste">
      <div className="container-rylix grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="flex items-start gap-4 md:col-span-3 md:flex-col md:gap-6">
          <span className="font-sans text-sm text-accent">02</span>
          <Reveal>
            <p id="manifeste" className="label">
              {manifesto.eyebrow}
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-9">
          <h2 className="text-balance break-words font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            {manifesto.title.map((line, i) => (
              <SplitText
                key={line}
                as="span"
                text={line}
                delay={0.08 + i * 0.1}
                className="block text-[clamp(2.25rem,7vw,5.5rem)]"
              />
            ))}
          </h2>

          <Reveal delay={0.1 + manifesto.title.length * 0.1} className="mt-10 max-w-prose md:mt-14">
            <p className="text-lg leading-relaxed text-fg-muted">{manifesto.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
