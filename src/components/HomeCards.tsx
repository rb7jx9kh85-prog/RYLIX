import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import { EASE, usePrefersReducedMotion } from '@/lib/motion'
import { useFirestoreCollection } from '@/lib/useFirestoreCollection'

/** Largeur de chaque carte, en colonnes d'une grille de 6. */
const spanClass: Record<HomeCard['span'], string> = {
  2: 'w-[62vw] sm:w-[32vw] md:w-[17vw]',
  3: 'w-[70vw] sm:w-[38vw] md:w-[22vw]',
  4: 'w-[78vw] sm:w-[44vw] md:w-[25vw]',
}

/**
 * Aperçus des onglets, en bande horizontale. Elle ne réagit qu'au geste
 * explicite de l'utilisateur — glisser au doigt/trackpad, ou les flèches sur
 * grand écran — jamais au simple scroll vertical de la page : c'est lui qui
 * a le dernier mot, la bande ne le détourne jamais.
 */
export function HomeCards() {
  const reduce = usePrefersReducedMotion()
  const bandRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const { items: tourDates } = useFirestoreCollection<TourDate>('dates', 'date', 'asc')
  const { items: parcours } = useFirestoreCollection<ParcoursEntry>(
    'parcours',
    'createdAt',
    'desc',
  )

  useEffect(() => {
    const el = bandRef.current
    if (!el) return
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  const scrollByCard = (direction: 1 | -1) => {
    const el = bandRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.8, 480) * direction
    el.scrollBy({ left: amount, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={bandRef}
        className="flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth px-6 pb-2
                   [scrollbar-width:none] md:gap-6 md:px-10 [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)',
        }}
      >
        {homeCards.map((card, i) => {
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

          return (
            <motion.div
              key={card.to}
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              className={`shrink-0 snap-start ${spanClass[card.span]}`}
            >
              <Link
                to={card.to}
                className="group relative flex h-[min(44vh,330px)] w-full flex-col
                           overflow-hidden rounded-sm border border-slate/25
                           transition-colors duration-500 ease-rylix hover:border-accent/60"
              >
                {header}
                <CardBody card={card} gallery={gallery} tourDates={tourDates} parcours={parcours} />
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Flèches — visibles uniquement quand il reste effectivement de la
          bande à découvrir dans cette direction, et seulement sur pointeur
          fin : sur tactile, le glissement suffit. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-1 md:flex">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Cartes précédentes"
          disabled={!canScrollLeft}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full
                     border border-slate/30 bg-navy/80 text-cream backdrop-blur transition-all
                     duration-300 ease-rylix hover:border-accent/60 hover:text-accent
                     disabled:pointer-events-none disabled:opacity-0"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 stroke-current" fill="none">
            <path d="M15 4l-8 8 8 8" strokeWidth="1.25" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Cartes suivantes"
          disabled={!canScrollRight}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full
                     border border-slate/30 bg-navy/80 text-cream backdrop-blur transition-all
                     duration-300 ease-rylix hover:border-accent/60 hover:text-accent
                     disabled:pointer-events-none disabled:opacity-0"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 stroke-current" fill="none">
            <path d="M9 4l8 8-8 8" strokeWidth="1.25" />
          </svg>
        </button>
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
          alt={`Pochette de ${release.title}, ${release.type.toLowerCase()} de RYLIX.`}
          loading="lazy"
          decoding="async"
          className="photo h-full w-full object-cover transition-transform duration-[300ms] ease-rylix group-hover:scale-[1.04]"
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
        {photos.map(({ key, alt, image }) => (
          <img
            key={key}
            src={image!.src}
            srcSet={image!.srcSet}
            sizes="(max-width: 768px) 34vw, 11vw"
            // Le texte alternatif de la galerie, repris tel quel : ces
            // vignettes sont les mêmes photos, au même titre descriptif.
            alt={alt}
            loading="lazy"
            decoding="async"
            className="photo h-full w-full object-cover transition-transform duration-[300ms] ease-rylix group-hover:scale-[1.06]"
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
