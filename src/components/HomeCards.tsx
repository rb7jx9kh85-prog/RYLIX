import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  gallery,
  homeCards,
  release,
  type GalleryPhoto,
  type HomeCard,
  type ParcoursEntry,
  type TourDate,
} from '@/lib/content'
import { formatShortDate, getYear, isUpcoming } from '@/lib/format'
import { resolveImage } from '@/lib/images'
import { usePrefersReducedMotion } from '@/lib/motion'
import { useFirestoreCollection } from '@/lib/useFirestoreCollection'

/**
 * Largeur qui dépasse de la bande — la course exacte à parcourir pour que la
 * dernière carte arrive au bord droit. Re-mesurée au redimensionnement et
 * quand le contenu change (les cartes dates/parcours arrivent après coup).
 */
function useTrackOverflow(ref: RefObject<HTMLElement>): number {
  const [overflow, setOverflow] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setOverflow(Math.max(0, el.scrollWidth - el.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)
    return () => observer.disconnect()
  }, [ref])

  return overflow
}

/** Largeur de chaque carte, en colonnes d'une grille de 6. */
const spanClass: Record<HomeCard['span'], string> = {
  2: 'w-[62vw] sm:w-[32vw] md:w-[17vw]',
  3: 'w-[70vw] sm:w-[38vw] md:w-[22vw]',
  4: 'w-[78vw] sm:w-[44vw] md:w-[25vw]',
}

/**
 * Aperçus des onglets. La bande défile latéralement au fil du scroll vertical :
 * on descend normalement dans la page, mais les cartes, elles, traversent
 * l'écran de la droite vers la gauche.
 *
 * La bande reste aussi glissable au doigt / au trackpad — sur mobile c'est le
 * geste attendu, et ça évite de dépendre uniquement du scroll détourné.
 */
export function HomeCards({ pinnedRef }: { pinnedRef?: RefObject<HTMLElement> }) {
  const reduce = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const overflow = useTrackOverflow(bandRef)
  const { items: tourDates } = useFirestoreCollection<TourDate>('dates', 'date', 'asc')
  const { items: parcours } = useFirestoreCollection<ParcoursEntry>(
    'parcours',
    'createdAt',
    'desc',
  )

  // Section épinglée (pinnedRef) : la progression court sur toute la durée de
  // l'épinglage, et la bande a fini de défiler avant que la page ne reparte
  // vers le bas. Sans pin, on retombe sur la mesure d'origine — la portion du
  // scroll pendant laquelle la bande est réellement à l'écran.
  const { scrollYProgress } = useScroll({
    target: pinnedRef ?? trackRef,
    offset: pinnedRef ? ['start start', 'end end'] : ['start end', 'end start'],
    // Mesure hors layout effect : évite de forcer un reflow synchrone à chaque
    // montage/scroll, coûteux sur mobile.
    layoutEffect: false,
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.35 })
  // La course est la largeur réellement en trop, mesurée, pas un pourcentage
  // choisi à la main : c'est la seule façon que la dernière carte arrive pile
  // au bord quelle que soit la largeur d'écran — un pourcentage calé sur le
  // bureau laisse la moitié de la bande dehors sur mobile. Elle se termine à
  // 0.9 : le dixième restant sert de palier avant que la section ne se
  // désépingle et ne rende la main au scroll vertical.
  const range: [number, number] = pinnedRef ? [0.05, 0.9] : [0.15, 0.85]
  const offset = useTransform(progress, range, [0, overflow], { clamp: true })

  // On pilote le scroll natif de la bande, pas une translation : la bande
  // porte overflow-x, donc la translater déplacerait aussi sa fenêtre de
  // découpe — les cartes disparaîtraient par la droite au lieu de défiler.
  useMotionValueEvent(offset, 'change', (v) => {
    if (reduce) return
    const el = bandRef.current
    if (el) el.scrollLeft = v
  })

  return (
    <div ref={trackRef} className="overflow-hidden">
      <div
        ref={bandRef}
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

          // Carte plate : pas de bascule 3D, pas de reflet au pointeur —
          // seules la bordure et la couleur du titre répondent au survol.
          return (
            <Link
              key={card.to}
              to={card.to}
              className={`group relative flex h-[min(44vh,330px)] shrink-0 snap-start flex-col
                          overflow-hidden rounded-sm border border-slate/25
                          transition-colors duration-500 ease-rylix hover:border-accent/60
                          ${spanClass[card.span]}`}
            >
              {/* Même ordre pour toutes les cartes : les titres se lisent sur
                  une seule ligne de regard quand on parcourt la bande. */}
              {header}
              <CardBody card={card} gallery={gallery} tourDates={tourDates} parcours={parcours} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/** Contenu propre à chaque type de carte. */
function CardBody({
  card,
  gallery,
  tourDates,
  parcours,
}: {
  card: HomeCard
  gallery: GalleryPhoto[]
  tourDates: TourDate[]
  parcours: ParcoursEntry[]
}) {
  if (card.kind === 'cover') {
    const cover = resolveImage(release.coverKey)
    if (!cover) return null
    return (
      <div className="min-h-0 flex-1 overflow-hidden border-t border-slate/20">
        <img
          src={cover.src}
          srcSet={cover.srcSet}
          sizes="(max-width: 768px) 70vw, 22vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="photo h-full w-full object-cover transition-transform duration-[1200ms] ease-rylix group-hover:scale-[1.04]"
        />
      </div>
    )
  }

  if (card.kind === 'mosaic') {
    // Vignettes rendues en <img> nu : à cette taille le placeholder progressif
    // du composant Image n'apporte rien et coûte un rendu de plus par image.
    // Grille 2x2 fixe : seules les 4 premières photos de la galerie tiennent.
    const photos = gallery
      .map((p) => ({ ...p, image: resolveImage(p.key) }))
      .filter((p) => p.image !== null)
      .slice(0, 4)

    return (
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-px border-t border-slate/20 bg-slate/20">
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

  const lines = card.lines ?? linesFor(card.to, tourDates, parcours)
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
function linesFor(to: string, tourDates: TourDate[], parcours: ParcoursEntry[]): string[] {
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
