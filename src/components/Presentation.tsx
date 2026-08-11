import { Reveal, SplitText } from './PageTransition'
import { presentation } from '@/lib/content'

/**
 * Présentation de l'artiste — prend le relais du hero, qui n'en montre que
 * l'accroche avant de rendre la main au scroll.
 *
 * Le texte est composé en colonne étroite (max-w-prose) plutôt qu'en pleine
 * largeur : au-delà d'une soixantaine de caractères par ligne, l'œil perd le
 * début de la ligne suivante. Sur mobile la colonne occupe toute la largeur
 * disponible, sur grand écran elle s'arrête — d'où la même lisibilité des
 * deux côtés, sans réglage par palier.
 */
export function Presentation() {
  return (
    <section className="py-lg md:py-xl" aria-labelledby="presentation">
      <div className="container-rylix grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="flex items-start gap-4 md:col-span-3 md:flex-col md:gap-6">
          <span className="font-sans text-sm text-accent">02</span>
          <Reveal>
            <p id="presentation" className="label">
              {presentation.eyebrow}
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-9">
          <SplitText
            as="h2"
            text={presentation.title}
            delay={0.06}
            className="text-balance break-words font-display text-[clamp(1.75rem,5vw,3.25rem)]
                       font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-cream"
          />

          {/* L'espacement vit sur le conteneur, pas sur les <p> : chaque
              paragraphe est seul dans son wrapper d'animation, donc une règle
              `first:` posée sur le <p> s'appliquerait à tous. */}
          <div className="mt-8 max-w-prose space-y-5 md:mt-10">
            {presentation.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.12 + i * 0.06}>
                <p className="text-base leading-relaxed text-fg-muted md:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
