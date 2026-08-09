import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { gallery, homeCards, parcours, tourDates, type HomeCard } from '@/lib/content'
import { formatShortDate, getYear, isUpcoming } from '@/lib/format'
import { resolveImage } from '@/lib/images'
import { usePrefersReducedMotion } from '@/lib/motion'

/** Largeur de chaque carte, en colonnes d'une grille de 6. */
const spanClass: Record<HomeCard['span'], string> = {
  2: 'w-[66vw] sm:w-[34vw] md:w-[20vw]',
  3: 'w-[76vw] sm:w-[42vw] md:w-[26vw]',
  4: 'w-[82vw] sm:w-[48vw] md:w-[30vw]',
}

/**
 * Aperçus des onglets. La bande défile latéralement au fil du scroll vertical :
 * on descend normalement dans la page, mais les cartes, elles, traversent
 * l'écran de la droite vers la gauche.
 *
 * La bande reste aussi glissable au doigt / au trackpad — sur mobile c'est le
 * geste attendu, et ça évite de dépendre uniquement du scroll détourné.
 */
export function HomeCards() {
  const reduce = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
    // Mesure hors layout effect : évite de forcer un reflow synchrone à chaque
    // montage/scroll, coûteux sur mobile.
    layoutEffect: false,
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.35 })
  // Amplitude calée pour que la première carte parte alignée au bord et que la
  // dernière finisse visible : au-delà, les cartes d'extrémité restent coupées
  // pendant toute la traversée.
  const x = useTransform(progress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-9%'])

  return (
    <div ref={trackRef} className="overflow-hidden">
      <motion.div
        style={{ x }}
        // snap + scroll natif : le glissement manuel reste possible et net.
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2
                   [scrollbar-width:none] md:gap-6 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {homeCards.map((card) => {
          const header = (
            <div className="flex items-end justify-between gap-4 p-5 md:p-6">
              <div>
                <h3 className="font-display text-h3 font-bold uppercase leading-none text-cream transition-colors duration-300 ease-rylix group-hover:text-accent">
                  {card.label}
                </h3>
                <p className="mt-2 text-sm text-fg-muted">{card.teaser}</p>
              </div>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                fill="none"
                className="h-4 w-4 shrink-0 stroke-slate transition-all duration-500 ease-rylix
                           group-hover:translate-x-1 group-hover:stroke-accent"
              >
                <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.25" />
              </svg>
            </div>
          )

          // Carte illustrée : les vignettes d'abord, le titre en pied, comme
          // une planche contact. Carte de texte : le titre ouvre, les infos
          // suivent — sinon le contenu flotterait loin de son intitulé.
          const mosaic = card.kind === 'mosaic'

          return (
            <Link
              key={card.to}
              to={card.to}
              className={`group flex h-[min(44vh,330px)] shrink-0 snap-start flex-col
                          overflow-hidden rounded-sm border border-slate/25
                          transition-colors duration-500 ease-rylix hover:border-accent/60
                          ${spanClass[card.span]}`}
            >
              {mosaic ? (
                <>
                  <CardBody card={card} />
                  {header}
                </>
              ) : (
                <>
                  {header}
                  <CardBody card={card} />
                </>
              )}
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}

/** Contenu propre à chaque type de carte. */
function CardBody({ card }: { card: HomeCard }) {
  if (card.kind === 'mosaic') {
    // Vignettes rendues en <img> nu : à cette taille le placeholder progressif
    // du composant Image n'apporte rien et coûte un rendu de plus par image.
    const photos = gallery
      .map((p) => ({ ...p, image: resolveImage(p.key) }))
      .filter((p) => p.image !== null)

    return (
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-px bg-slate/20">
        {photos.map(({ key, image }) => (
          <img
            key={key}
            src={image!.src}
            srcSet={image!.srcSet}
            sizes="(max-width: 768px) 34vw, 11vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="photo h-full w-full object-cover transition-transform duration-[1200ms] ease-rylix group-hover:scale-[1.06]"
          />
        ))}
      </div>
    )
  }

  const lines = card.lines ?? linesFor(card.to)
  if (lines.length === 0) return null

  return (
    <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden border-t border-slate/20 px-5 pt-4 md:px-6">
      {lines.map((line) => (
        <li
          key={line}
          className="border-b border-slate/20 pb-3 text-sm leading-snug text-cream/85 last:border-0"
        >
          {line}
        </li>
      ))}
    </ul>
  )
}

/** Infos clés reprises des listes réelles, pour ne pas les recopier. */
function linesFor(to: string): string[] {
  if (to === '/dates') {
    const upcoming = tourDates
      .filter((d) => isUpcoming(d.date))
      .sort((a, b) => a.date.localeCompare(b.date))

    if (upcoming.length === 0) return ['Aucune date confirmée pour le moment.']
    return upcoming
      .slice(0, 3)
      .map((d) => `${formatShortDate(d.date)} ${getYear(d.date)} — ${d.city}, ${d.venue}`)
  }

  if (to === '/parcours') {
    if (parcours.length === 0) return ['Rien à afficher pour le moment.']
    return parcours.slice(0, 3).map((p) => `${p.title} — ${p.role}`)
  }

  return []
}
