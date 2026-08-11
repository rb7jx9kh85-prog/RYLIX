import { useRef, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
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
import { useMediaQuery } from '@/lib/useMediaQuery'

const MotionLink = motion(Link)

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
export function HomeCards() {
  const reduce = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const { items: tourDates } = useFirestoreCollection<TourDate>('dates', 'date', 'asc')
  const { items: parcours } = useFirestoreCollection<ParcoursEntry>(
    'parcours',
    'createdAt',
    'desc',
  )

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
    // Mesure hors layout effect : évite de forcer un reflow synchrone à chaque
    // montage/scroll, coûteux sur mobile.
    layoutEffect: false,
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.35 })
  // La course est calée sur la portion du scroll où la bande est réellement à
  // l'écran (elle entre vers 0.15, sort vers 0.85) : étalée sur 0→1, elle se
  // terminerait alors que la section a déjà quitté le champ, et la dernière
  // carte ne serait jamais vue en entier.
  const x = useTransform(progress, [0.15, 0.85], reduce ? ['0%', '0%'] : ['0%', '-19%'])

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

          return (
            <TiltCard key={card.to} card={card}>
              {/* Même ordre pour toutes les cartes : les titres se lisent sur
                  une seule ligne de regard quand on parcourt la bande. */}
              {header}
              <CardBody card={card} gallery={gallery} tourDates={tourDates} parcours={parcours} />
            </TiltCard>
          )
        })}
      </motion.div>
    </div>
  )
}

/**
 * Carte basculée en 3D vers le pointeur — perspective CSS, pas de WebGL.
 * Desktop à pointeur fin uniquement ; repos net au départ du pointeur.
 */
function TiltCard({ card, children }: { card: HomeCard; children: ReactNode }) {
  const canTilt = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = usePrefersReducedMotion()
  const active = canTilt && !reduce

  const ref = useRef<HTMLAnchorElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const springPX = useSpring(px, { stiffness: 220, damping: 22, mass: 0.4 })
  const springPY = useSpring(py, { stiffness: 220, damping: 22, mass: 0.4 })
  const rotateX = useTransform(springPY, [0, 1], [6, -6])
  const rotateY = useTransform(springPX, [0, 1], [-7, 7])

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!active || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <MotionLink
      ref={ref}
      to={card.to}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor-label={card.kind === 'cover' || card.kind === 'mosaic' ? 'Voir' : undefined}
      style={active ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={`group relative flex h-[min(44vh,330px)] shrink-0 snap-start flex-col
                  overflow-hidden rounded-sm border border-slate/25
                  transition-colors duration-500 ease-rylix hover:border-accent/60
                  ${spanClass[card.span]}`}
    >
      {children}
    </MotionLink>
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
    const photos = gallery
      .map((p) => ({ ...p, image: resolveImage(p.key) }))
      .filter((p) => p.image !== null)

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
