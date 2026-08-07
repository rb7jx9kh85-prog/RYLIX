import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Image } from './Image'
import { hero, site } from '@/lib/content'
import { DURATION, EASE, transition, usePrefersReducedMotion } from '@/lib/motion'
import { MD, useMediaQuery } from '@/lib/useMediaQuery'

/**
 * Hero plein écran en trois calques :
 *
 *   1. la photo, en fond, avec une parallaxe lente
 *   2. le logotype RYLIX
 *   3. la même photo, découpée à l'ellipse du sujet, repassée par-dessus
 *
 * Le calque 3 affiche exactement les mêmes pixels que le calque 1 au même
 * endroit : il est donc invisible en tant que tel, mais il remet l'artiste
 * au premier plan. Le « X », aligné sur le centre du sujet, se glisse derrière
 * lui — l'occlusion se renforce à mesure que le logotype remonte au scroll.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLHeadingElement>(null)
  const xRef = useRef<HTMLSpanElement>(null)

  const reduce = usePrefersReducedMotion()
  const isDesktop = useMediaQuery(MD)
  const subject = isDesktop ? hero.subject.desktop : hero.subject.mobile
  const markX = isDesktop ? hero.markX.desktop : hero.markX.mobile
  const objectPosition = isDesktop ? hero.objectPosition.desktop : hero.objectPosition.mobile

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

  // Ellipse du sujet : opaque au centre, fondue sur `subjectFeather` % du rayon.
  const solid = Math.max(0, 100 - hero.subjectFeather)
  const subjectMask =
    `radial-gradient(ellipse ${subject.rx}% ${subject.ry}% at ${subject.x}% ${subject.y}%,` +
    ` #000 ${solid}%, transparent 100%)`

  const veil = 'bg-gradient-to-t from-navy via-navy/45 to-navy/20'

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* 1 — photo de fond */}
      <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0 z-0">
        <Image
          imageKey={hero.imageKey}
          fallbackKey={hero.fallbackImageKey}
          alt={hero.alt}
          sizes="100vw"
          priority
          className="h-full w-full"
          objectPosition={objectPosition}
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
        style={{
          y: photoY,
          scale: photoScale,
          maskImage: subjectMask,
          WebkitMaskImage: subjectMask,
        }}
        className="pointer-events-none absolute inset-0 z-[3]"
      >
        <Image
          imageKey={hero.imageKey}
          fallbackKey={hero.fallbackImageKey}
          alt=""
          sizes="100vw"
          priority
          className="h-full w-full"
          objectPosition={objectPosition}
        />
        {/* Même voile que le calque 1 : les deux se superposent au pixel près. */}
        <div className={`absolute inset-0 ${veil}`} />
      </motion.div>

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

      <ScrollHint />
    </section>
  )
}

/**
 * Décale horizontalement le logotype pour que le centre du « X » tombe
 * exactement sur le centre du sujet (`targetX`, en % de la largeur de la
 * fenêtre). Le décalage est borné pour que le mot reste entièrement visible.
 *
 * Recalculé au redimensionnement et au changement de taille de police, plutôt
 * que codé en dur : la valeur dépend de la largeur de rendu réelle du logotype,
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
