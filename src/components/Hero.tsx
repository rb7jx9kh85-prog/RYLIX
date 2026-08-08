import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Image } from './Image'
import { hero, site } from '@/lib/content'
import { DURATION, EASE, transition, usePrefersReducedMotion } from '@/lib/motion'
import { MD, useMediaQuery } from '@/lib/useMediaQuery'

const veil = 'bg-gradient-to-t from-navy via-navy/45 to-navy/20'

/**
 * Hero à deux images, superposées en profondeur et reliées par le scroll :
 *
 *   1. `background` — la photo de fond, avec une légère dérive de parallaxe
 *   2. le logotype RYLIX
 *   3. `background` une seconde fois, découpée à l'ellipse du sujet : ce
 *      calque repasse l'artiste par-dessus le logotype (le « X » se glisse
 *      derrière lui)
 *   4. `reveal` — une seconde photo, ancrée en bas de l'écran, qui monte et
 *      recouvre toute la scène au fil du défilement : la transition entre
 *      les deux images se fait au geste du visiteur, pas sur un minuteur
 *
 * Les deux photos dérivent à des vitesses différentes (voir `photoY` et
 * `revealY`) : c'est cet écart qui donne la sensation de profondeur.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLHeadingElement>(null)
  const xRef = useRef<HTMLSpanElement>(null)

  const reduce = usePrefersReducedMotion()
  const isDesktop = useMediaQuery(MD)
  const subject = isDesktop ? hero.subject.desktop : hero.subject.mobile
  const markX = isDesktop ? hero.markX.desktop : hero.markX.mobile
  const bgPosition = isDesktop ? hero.background.objectPosition.desktop : hero.background.objectPosition.mobile
  const revealPosition = isDesktop ? hero.reveal.objectPosition.desktop : hero.reveal.objectPosition.mobile

  // La section fait 220svh : la progression couvre toute cette hauteur, pas
  // seulement un écran — c'est la réserve de défilement qui permet au
  // contenu épinglé (ci-dessous) de jouer sa transition sans être poussé
  // hors champ en même temps.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.3 })

  // Le fond dérive lentement ; le logotype remonte plus vite — c'est ce
  // différentiel qui glisse le X derrière l'artiste dès les premiers pixels
  // de défilement.
  const photoY = useTransform(progress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '10%'])
  const photoScale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1, 1.05])
  const markY = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, -120])
  const metaOpacity = useTransform(progress, [0, 0.45], [1, 0])

  // Le panneau de révélation monte depuis le bas et recouvre tout à
  // `revealEnd` : une vitesse nettement différente de celle du fond, pour que
  // les deux images se déplacent visiblement l'une par rapport à l'autre.
  const revealStops = [0, hero.revealEnd, 1]
  const revealY = useTransform(progress, revealStops, reduce ? ['100%', '100%', '100%'] : ['100%', '0%', '0%'])
  const revealScale = useTransform(progress, revealStops, reduce ? [1, 1, 1] : [1.08, 1, 1])
  // Fondu sur les 12 premiers % de la hauteur du panneau, pour que son bord
  // avant se dissolve dans le calque du dessous plutôt que de le trancher.
  const revealMask = 'linear-gradient(to bottom, transparent 0%, #000 12%)'

  const markOffset = useMarkAlignment({ markRef, xRef, targetX: markX })

  const solid = Math.max(0, 100 - hero.subjectFeather)
  const subjectMask = `radial-gradient(ellipse ${subject.rx}% ${subject.ry}% at ${subject.x}% ${subject.y}%, #000 ${solid}%, transparent 100%)`

  return (
    // Épinglé : le wrapper est plus haut que l'écran (220svh) pour ménager
    // une vraie zone de défilement pendant laquelle le contenu visuel, lui,
    // reste fixe (sticky) — sans cette réserve de hauteur, la révélation et
    // le défilement de la page se superposeraient et brouilleraient l'effet.
    <section ref={sectionRef} className="relative h-[220svh]">
      <div className="grain sticky top-0 isolate flex h-[100svh] flex-col justify-end overflow-hidden">
        {/* 1 — photo de fond */}
        <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0 z-0">
          <Image
            imageKey={hero.background.imageKey}
            alt={hero.background.alt}
            sizes="100vw"
            priority
            className="h-full w-full"
            objectPosition={bgPosition}
          />
        </motion.div>
        <div aria-hidden className={`absolute inset-0 z-[1] ${veil}`} />

        {/* 2 — logotype */}
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

        {/* 3 — l'artiste, repassé par-dessus le logotype */}
        <motion.div
          aria-hidden
          style={{ y: photoY, scale: photoScale, maskImage: subjectMask, WebkitMaskImage: subjectMask }}
          className="pointer-events-none absolute inset-0 z-[3]"
        >
          <Image
            imageKey={hero.background.imageKey}
            alt=""
            sizes="100vw"
            priority
            className="h-full w-full"
            objectPosition={bgPosition}
          />
          <div className={`absolute inset-0 ${veil}`} />
        </motion.div>

        {/* 4 — panneau de révélation, monte au scroll */}
        <motion.div
          style={{
            y: revealY,
            scale: revealScale,
            // Bord supérieur adouci : sans ce dégradé, la jonction avec le
            // calque du dessous serait une ligne nette, plutôt qu'un fondu.
            maskImage: revealMask,
            WebkitMaskImage: revealMask,
          }}
          className="absolute inset-0 z-[4]"
        >
          <Image
            imageKey={hero.reveal.imageKey}
            alt={hero.reveal.alt}
            sizes="100vw"
            className="h-full w-full"
            objectPosition={revealPosition}
          />
          <div aria-hidden className={`absolute inset-0 ${veil}`} />
        </motion.div>

        {/* Baseline + CTA — toujours au-dessus */}
        <motion.div
          style={{ opacity: metaOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition(DURATION.base, 0.45)}
          className="container-rylix relative z-[5] flex flex-col gap-6 pb-16 md:flex-row
                     md:items-center md:justify-between md:pb-24"
        >
          <p className="label text-cream/80">{site.tagline}</p>
          <Link to="/musique" className="btn self-start md:self-auto">
            Écouter
          </Link>
        </motion.div>

        <ScrollHint />
      </div>
    </section>
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
      className="pointer-events-none absolute inset-x-0 bottom-5 z-[5] flex justify-center"
    >
      <motion.span
        className="block h-8 w-px bg-gradient-to-b from-transparent via-cream/50 to-transparent"
        animate={reduce ? undefined : { scaleY: [0.4, 1, 0.4], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
