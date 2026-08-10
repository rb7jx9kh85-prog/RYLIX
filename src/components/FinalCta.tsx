import { Reveal, RuleReveal, SplitText } from './PageTransition'
import { SocialLinks } from './SocialLinks'
import { finalCta, release } from '@/lib/content'

/**
 * Clôture graphique de l'accueil — grande typographie, réseaux réels, avant
 * le footer. Dernière impression avant que le visiteur ne quitte la page.
 */
export function FinalCta() {
  return (
    <section className="py-lg md:py-xl" aria-labelledby="suivre">
      <div className="container-rylix">
        <RuleReveal className="mb-lg" />

        <h2
          id="suivre"
          className="text-balance break-words font-display font-extrabold uppercase leading-[0.88] tracking-[-0.03em]"
        >
          {finalCta.title.map((line, i) => (
            <SplitText
              key={line}
              as="span"
              text={line}
              delay={0.06 + i * 0.09}
              className="block text-[clamp(2.5rem,9vw,6.5rem)]"
            />
          ))}
        </h2>

        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.1 + finalCta.title.length * 0.09} className="max-w-prose">
            <p className="text-lg leading-relaxed text-fg-muted">{finalCta.body}</p>
            <a
              href={release.spotifyUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-label="Écouter"
              className="btn mt-6"
            >
              Écouter maintenant
            </a>
          </Reveal>

          <Reveal delay={0.2 + finalCta.title.length * 0.09}>
            <SocialLinks variant="inline" className="gap-7" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
