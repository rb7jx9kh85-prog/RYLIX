import { motion } from 'framer-motion'
import { RuleReveal } from './PageTransition'
import { finalCta } from '@/lib/content'
import { EASE, VIEWPORT, usePrefersReducedMotion } from '@/lib/motion'

/**
 * Clôture de l'accueil — les trois verbes sont les liens eux-mêmes.
 *
 * Chaque ligne annonce la plateforme au bout, et le mot se double d'un
 * exemplaire en contour qui se décale au survol : le texte devient la surface
 * cliquable, sans paragraphe explicatif ni rangée d'icônes en plus.
 */
export function FinalCta() {
  const reduce = usePrefersReducedMotion()

  return (
    <section className="py-lg md:py-xl" aria-labelledby="suivre">
      <div className="container-rylix">
        <RuleReveal className="mb-lg" />
        <h2 id="suivre" className="sr-only">
          Écouter, regarder, suivre RYLIX
        </h2>

        <ul className="flex flex-col">
          {finalCta.map((item, i) => (
            <li key={item.word} className="border-b border-slate/20 first:border-t">
              <motion.a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: reduce ? 0.2 : 0.7, delay: i * 0.08, ease: EASE }}
                className="group relative flex items-center justify-between gap-6 overflow-hidden py-5 md:py-7"
              >
                {/* Nappe d'accent qui balaie la ligne de gauche à droite. */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0 bg-accent/[0.07] transition-[width]
                             duration-700 ease-rylix group-hover:w-full"
                />

                <span className="relative flex min-w-0 items-baseline gap-4 md:gap-6">
                  <span
                    aria-hidden
                    className="font-sans text-xs tabular-nums text-fg-muted/50
                               transition-colors duration-300 ease-rylix group-hover:text-accent"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Pas d'overflow-hidden ici : « Regarder » est plus large
                      que la colonne sur mobile, il doit rétrécir avec le
                      clamp, pas se faire couper. */}
                  <span
                    className="block font-display text-[clamp(1.6rem,7vw,5.5rem)] font-extrabold
                               uppercase leading-[0.95] tracking-[-0.03em] text-cream
                               transition-transform duration-700 ease-rylix
                               group-hover:translate-x-[0.06em]"
                  >
                    {item.word}
                  </span>
                </span>

                <span className="relative flex shrink-0 items-center gap-3 md:gap-5">
                  <span
                    className="hidden font-sans text-[10px] uppercase tracking-[0.16em] text-fg-muted
                               transition-colors duration-300 ease-rylix group-hover:text-accent sm:block"
                  >
                    {item.platform}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    fill="none"
                    className="h-5 w-5 shrink-0 stroke-slate transition-all duration-500 ease-rylix
                               group-hover:translate-x-1 group-hover:stroke-accent md:h-6 md:w-6"
                  >
                    <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.25" />
                  </svg>
                </span>

                <span className="sr-only">
                  {item.word} RYLIX sur {item.platform}
                </span>
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
