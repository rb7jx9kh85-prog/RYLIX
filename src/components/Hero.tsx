import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Image } from './Image'
import { hero, site, type HeroSubject } from '@/lib/content'
import { DURATION, EASE, transition, usePrefersReducedMotion } from '@/lib/motion'
import { MD, useMediaQuery } from '@/lib/useMediaQuery'

const veil = 'bg-gradient-to-t from-navy via-navy/45 to-navy/20'

/** Construit le masque radial qui découpe le calque de premier plan sur le sujet. */
function subjectMask(s: HeroSubject['mobile'], feather: number) {
  const solid = Math.max(0, 100 - feather)
  return `radial-gradient(ellipse ${s.rx}% ${s.ry}% at ${s.x}% ${s.y}%, #000 ${solid}%, transparent 100%)`
}

/**
 * Une diapositive du hero. Superpose, quand la diapositive porte un `subject`,
 * la même photo une seconde fois : découpée à l'ellipse du sujet, elle repasse
 * l'artiste par-dessus le logotype. Voir le composant Hero pour le détail de
 * cette technique.
 */
function Slide({
  slide,
  objectPosition,
  photoY,
  photoScale,
  feather,
}: {
  slide: (typeof hero.slides)[number]
  objectPosition: string
  photoY: import('framer-motion').MotionValue<string>
  photoScale: import('framer-motion').MotionValue<number>
  feather: number
}) {
  const isDesktop = useMediaQuery(MD)
  const subject = slide.subject && (isDesktop ? slide.subject.desktop : slide.subject.mobile)

  return (
    <>
      <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0">
        <Image
          imageKey={slide.imageKey}
          alt={slide.alt}
          sizes="100vw"
          priority
          className="h-full w-full"
          objectPosition={objectPosition}
        />
      </motion.div>
      <div aria-hidden className={`absolute inset-0 ${veil}`} />

      {subject && (
        <motion.div
          aria-hidden
          style={{
            y: photoY,
            scale: photoScale,
            maskImage: subjectMask(subject, feather),
            WebkitMaskImage: subjectMask(subject, feather),
          }}
          className="pointer-events-none absolute inset-0"
        >
          <Image
            imageKey={slide.imageKey}
            alt=""
            sizes="100vw"
            priority
            className="h-full w-full"
            objectPosition={objectPosition}
          />
          <div className={`absolute inset-0 ${veil}`} />
        </motion.div>
      )}
    </>
  )
}

/** Rotation 3D + profondeur : la diapositive entrante pivote depuis la tranche, la sortante s'en va de l'autre côté. */
const flipVariants = {
  enter: (dir: number) => ({ rotateY: dir * 78, opacity: 0, scale: 1.05 }),
  center: { rotateY: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ rotateY: dir * -78, opacity: 0, scale: 0.95 }),
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLHeadingElement>(null)
  const xRef = useRef<HTMLSpanElement>(null)

  const reduce = usePrefersReducedMotion()
  const isDesktop = useMediaQuery(MD)
  const markX = isDesktop ? hero.markX.desktop : hero.markX.mobile

  const [slideIndex, setSlideIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const slide = hero.slides[slideIndex]
  const objectPosition = isDesktop ? slide.objectPosition.desktop : slide.objectPosition.mobile

  // Alterne automatiquement entre les diapositives — coupé sous
  // prefers-reduced-motion et pendant que l'onglet est en arrière-plan.
  useEffect(() => {
    if (reduce || hero.slides.length < 2) return

    const tick = () => {
      if (document.hidden) return
      setSlideIndex((i) => {
        const next = (i + 1) % hero.slides.length
        setDirection(next > i || (i === hero.slides.length - 1 && next === 0) ? 1 : -1)
        return next
      })
    }

    const id = window.setInterval(tick, hero.autoplayMs)
    return () => window.clearInterval(id)
  }, [reduce])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.3 })

  // La photo dérive plus lentement que la page ; le logotype remonte plus vite.
  // C'est ce différentiel qui fait passer le X derrière l'artiste au scroll.
  const photoY = useTransform(progress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '10%'])
  const photoScale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1, 1.05])
  const markY = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, -120])
  const metaOpacity = useTransform(progress, [0, 0.45], [1, 0])

  const markOffset = useMarkAlignment({ markRef, xRef, targetX: markX })

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* 1 — diapositives, alternées en 3D */}
      <div className="absolute inset-0 z-0" style={{ perspective: 1600 }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.imageKey}
            custom={direction}
            variants={reduce ? undefined : flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition(1.15)}
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            className="absolute inset-0"
          >
            <Slide
              slide={slide}
              objectPosition={objectPosition}
              photoY={photoY}
              photoScale={photoScale}
              feather={hero.subjectFeather}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2 — logotype, au-dessus des diapositives */}
      <div className="container-rylix relative z-[2] pb-16 md:pb-24">
        <motion.h1
          ref={markRef}
          style={{ y: markY, marginLeft: markOffset }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : DURATION.slow, ease: EASE }}
          className="w-fit font-display text-hero font-extrabold uppercase leading-none text-cream"
        >
          RYLI<span ref={xRef}>X</span>
        </motion.h1>
      </div>

      {/* Baseline + CTA — toujours au-dessus */}
      <motion.div
        style={{ opacity: metaOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition(DURATION.base, 0.45)}
        className="container-rylix relative z-[4] flex flex-col gap-6 pb-16 md:flex-row
                   md:items-center md:justify-between md:pb-24"
      >
        <p className="label text-cream/80">{site.tagline}</p>
        <Link to="/musique" className="btn self-start md:self-auto">
          Écouter
        </Link>
      </motion.div>

      {hero.slides.length > 1 && (
        <SlideDots count={hero.slides.length} active={slideIndex} onSelect={setSlideIndex} setDirection={setDirection} />
      )}

      <ScrollHint />
    </section>
  )
}

/** Puces de position discrètes — permettent aussi de choisir une diapositive au clic. */
function SlideDots({
  count,
  active,
  onSelect,
  setDirection,
}: {
  count: number
  active: number
  onSelect: (i: number) => void
  setDirection: (d: number) => void
}) {
  return (
    <div
      role="group"
      aria-label="Choisir une image du hero"
      className="absolute bottom-24 right-6 z-[4] flex gap-2 md:bottom-28 md:right-10"
    >
      {Array.from({ length: count }).map((_, i) => (
        // Le bouton porte la cible tactile complète (min. 44px) ; le repère
        // visuel reste fin et centré dedans — la zone cliquable ne doit pas
        // suivre le rendu graphique.
        <button
          key={i}
          type="button"
          aria-current={i === active}
          onClick={() => {
            setDirection(i > active ? 1 : -1)
            onSelect(i)
          }}
          className="group flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pale"
        >
          <span
            aria-hidden
            className="block h-1.5 rounded-full bg-cream/40 transition-all duration-500 ease-rylix group-hover:bg-cream/70"
            style={{ width: i === active ? 22 : 8, opacity: i === active ? 1 : 0.6 }}
          />
          <span className="sr-only">Image {i + 1}</span>
        </button>
      ))}
    </div>
  )
}

/**
 * Décale horizontalement le logotype pour que le centre du « X » tombe
 * exactement sur `targetX` (en % de la largeur de la fenêtre). Le décalage
 * est borné pour que le mot reste entièrement visible.
 *
 * Recalculé au redimensionnement et au chargement de la police, plutôt que
 * codé en dur : la valeur dépend de la largeur de rendu réelle du logotype,
 * qui varie avec le clamp() typographique.
 */
function useMarkAlignment({
  markRef,
  xRef,
  targetX,
}: {
  markRef: React.RefObject<HTMLElement>
  xRef: React.RefObject<HTMLElement>
  targetX: number
}): number {
  const [offset, setOffset] = useState(0)

  const measure = useCallback(() => {
    const mark = markRef.current
    const x = xRef.current
    if (!mark || !x) return

    // On mesure à décalage nul pour obtenir la position naturelle du X.
    const previous = mark.style.marginLeft
    mark.style.marginLeft = '0px'
    const xCenter = x.getBoundingClientRect().left + x.getBoundingClientRect().width / 2
    const markLeft = mark.getBoundingClientRect().left
    const markWidth = mark.getBoundingClientRect().width
    mark.style.marginLeft = previous

    const target = (window.innerWidth * targetX) / 100
    const raw = target - xCenter

    // Le logotype ne doit ni sortir de la fenêtre à droite, ni reculer à gauche
    // au-delà de sa marge de conteneur.
    const maxRight = window.innerWidth - 24 - (markLeft + markWidth)
    setOffset(Math.round(Math.max(0, Math.min(raw, maxRight))))
  }, [markRef, xRef, targetX])

  useLayoutEffect(measure, [measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return offset
}

/** Repère de défilement discret, effacé dès que la page bouge. */
function ScrollHint() {
  const reduce = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 120], [1, 0])

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-5 z-[4] flex justify-center"
    >
      <motion.span
        className="block h-8 w-px bg-gradient-to-b from-transparent via-cream/50 to-transparent"
        animate={reduce ? undefined : { scaleY: [0.4, 1, 0.4], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
