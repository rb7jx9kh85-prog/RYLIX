import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { resolveImage } from '@/lib/images'
import { hero, site } from '@/lib/content'
import { EASE, usePrefersReducedMotion } from '@/lib/motion'

const LETTERS = 'RYLIX'.split('')

/** Courbe d'intro commune — sortie franche, sans rebond. */
const intro = (duration: number, delay: number) => ({ duration, delay, ease: EASE })

/**
 * Hero éditorial, épinglé sur 230svh :
 *
 *  - à l'entrée, deux rideaux papier s'ouvrent verticalement, les cadres se
 *    dévoilent par clip-path et les lettres de RYLIX montent une à une
 *    derrière leur masque
 *  - au défilement (section épinglée), les deux cadres dérivent à des vitesses
 *    et amplitudes différentes, leurs photos glissent en sens inverse à
 *    l'intérieur (double parallaxe), le mot se compresse, et le chapitre
 *    d'ouverture cède la place à l'annonce de la sortie en accent acide
 *  - au pointeur, les cadres réagissent en sens opposés — la scène respire
 *
 * Chaque cadre superpose trois couches de mouvement indépendantes : la dérive
 * de scroll (conteneur externe), l'intro clip-path (figure), la parallaxe
 * pointeur (interne). Le mot est en mix-blend-difference : il s'inverse en
 * passant sur les cadres. Tout est statique sous prefers-reduced-motion.
 */
export function Hero() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, mass: 0.3 })

  // --- Dérives liées au scroll (immobiles sous reduced-motion) ---
  const pct = (from: number, to: number) =>
    useTransform(progress, [0, 1], reduce ? [`${from}%`, `${from}%`] : [`${from}%`, `${to}%`])
  const num = (from: number, to: number) =>
    useTransform(progress, [0, 1], reduce ? [from, from] : [from, to])

  const primaryX = pct(0, -34)
  const primaryY = pct(0, -8)
  const primaryScale = num(1, 0.72)
  const primaryRotate = num(0, -2.2)
  const primaryImgY = pct(0, 12)

  const secondaryX = pct(0, -47)
  const secondaryY = pct(0, -4)
  const secondaryScale = num(1, 1.5)
  const secondaryRotate = num(2.5, 1.2)
  const secondaryImgY = pct(0, -8)

  const wordY = pct(0, -18)
  const wordScale = num(1, 0.88)

  const chapterOneOpacity = useTransform(progress, [0.05, 0.3], reduce ? [1, 1] : [1, 0])
  const chapterOneY = pct(0, -12)
  const chapterTwoOpacity = useTransform(progress, [0.38, 0.62], reduce ? [0, 0] : [0, 1])
  const chapterTwoY = useTransform(progress, [0.38, 0.62], reduce ? [0, 0] : [28, 0])
  // Le CTA du second chapitre n'est cliquable que lorsqu'il est visible.
  const chapterTwoEvents = useTransform(chapterTwoOpacity, (v) =>
    v > 0.5 ? ('auto' as const) : ('none' as const)
  )

  // --- Parallaxe au pointeur, en sens opposés ---
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springPX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.4 })
  const springPY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.4 })
  const primaryPointerX = useTransform(springPX, (v) => v * 14)
  const primaryPointerY = useTransform(springPY, (v) => v * 10)
  const secondaryPointerX = useTransform(springPX, (v) => v * -10)
  const secondaryPointerY = useTransform(springPY, (v) => v * -8)

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5)
      pointerY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, pointerX, pointerY])

  const primary = resolveImage(hero.primary.imageKey)
  const secondary = resolveImage(hero.secondary.imageKey)

  return (
    <section
      ref={sectionRef}
      className="relative h-[230svh] min-h-[1400px] bg-navy"
      aria-label="RYLIX — introduction"
    >
      <div className="sticky top-0 isolate h-[100svh] min-h-[640px] overflow-hidden bg-navy">
        {/* Grain pellicule */}
        <div className="grain-live" aria-hidden />

        {/* Rideaux d'ouverture */}
        {!reduce && (
          <>
            <motion.div
              aria-hidden
              initial={{ y: '0%' }}
              animate={{ y: '-102%' }}
              transition={intro(1.3, 0.1)}
              className="pointer-events-none absolute left-0 top-0 z-30 h-[50.5%] w-full bg-cream"
            />
            <motion.div
              aria-hidden
              initial={{ y: '0%' }}
              animate={{ y: '102%' }}
              transition={intro(1.3, 0.1)}
              className="pointer-events-none absolute bottom-0 left-0 z-30 h-[50.5%] w-full bg-cream"
            />
          </>
        )}

        {/* Cadres photo */}
        <div className="absolute inset-0 z-[2]" aria-hidden>
          {/* 01 — grand cadre : dérive scroll sur le conteneur, intro sur la
              figure, pointeur à l'intérieur — trois couches indépendantes. */}
          <motion.div
            style={{ x: primaryX, y: primaryY, scale: primaryScale, rotate: primaryRotate }}
            className="absolute left-[12vw] top-[18vh] h-[58vh] w-[67vw]
                       md:left-[28vw] md:top-[13vh] md:h-[min(74vh,830px)] md:w-[min(38vw,610px)]"
          >
            <motion.figure
              initial={reduce ? false : { clipPath: 'inset(50% 0% 50% 0%)', scale: 1.12 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
              transition={intro(1.7, 0.18)}
              className="m-0 h-full w-full overflow-hidden bg-navy-alt shadow-[0_36px_90px_rgba(0,0,0,0.38)]"
            >
              <motion.div style={{ x: primaryPointerX, y: primaryPointerY }} className="h-full w-full">
                {primary && (
                  <motion.img
                    src={primary.src}
                    srcSet={primary.srcSet}
                    sizes="(max-width: 768px) 67vw, 38vw"
                    width={primary.width}
                    height={primary.height}
                    alt=""
                    fetchPriority="high"
                    style={{ y: primaryImgY, objectPosition: 'center 48%' }}
                    className="photo h-[115%] w-full object-cover"
                  />
                )}
              </motion.div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/30" />
              <span className="absolute bottom-2.5 right-3 z-[2] font-sans text-[9px] tracking-[0.16em] text-accent">
                {hero.primary.index}
              </span>
            </motion.figure>
          </motion.div>

          {/* 02 — petit cadre incliné */}
          <motion.div
            style={{ x: secondaryX, y: secondaryY, scale: secondaryScale, rotate: secondaryRotate }}
            className="absolute left-[72vw] top-[32vh] h-[35vh] w-[36vw]
                       md:top-[26vh] md:h-[min(50vh,570px)] md:w-[min(21vw,350px)]"
          >
            <motion.figure
              initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)', y: '12%' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', y: '0%' }}
              transition={intro(1.45, 0.48)}
              className="m-0 h-full w-full overflow-hidden bg-navy-alt shadow-[0_36px_90px_rgba(0,0,0,0.38)]"
            >
              <motion.div
                style={{ x: secondaryPointerX, y: secondaryPointerY }}
                className="h-full w-full"
              >
                {secondary && (
                  <motion.img
                    src={secondary.src}
                    srcSet={secondary.srcSet}
                    sizes="(max-width: 768px) 36vw, 21vw"
                    width={secondary.width}
                    height={secondary.height}
                    alt=""
                    fetchPriority="high"
                    style={{ y: secondaryImgY, objectPosition: 'center 46%' }}
                    className="photo h-[115%] w-full object-cover"
                  />
                )}
              </motion.div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/30" />
              <span className="absolute bottom-2.5 right-3 z-[2] font-sans text-[9px] tracking-[0.16em] text-accent">
                {hero.secondary.index}
              </span>
            </motion.figure>
          </motion.div>
        </div>

        {/* RYLIX — étalé lettre par lettre, inversé sur les cadres */}
        <motion.h1
          style={{ y: wordY, scale: wordScale }}
          className="pointer-events-none absolute inset-x-[3vw] top-[48%] z-[6] flex items-center
                     justify-between font-display font-extrabold uppercase leading-[0.7]
                     text-cream mix-blend-difference md:inset-x-[2.2vw] md:top-[47%]"
          aria-label="RYLIX"
        >
          {LETTERS.map((letter, i) => (
            <span
              key={`${letter}-${i}`}
              aria-hidden
              className="inline-flex overflow-hidden px-[0.02em] py-[0.12em]"
            >
              <motion.span
                initial={reduce ? false : { y: '118%', rotate: 3 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={intro(1.05, 0.38 + i * 0.045)}
                className="inline-block text-[24vw] tracking-[-0.06em] md:text-[clamp(7rem,19vw,21rem)]"
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Accroche, haut gauche */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={intro(0.8, 0.76)}
          className="absolute left-[18px] top-[13%] z-10 md:left-[30px] md:top-[24%]"
        >
          <motion.p
            style={{ opacity: chapterOneOpacity, y: chapterOneY }}
            className="m-0 font-display text-[17px] font-bold leading-[1.05] tracking-[-0.02em]
                       text-cream md:text-[clamp(18px,1.5vw,26px)]"
          >
            {hero.intro.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.p>
        </motion.div>

        {/* Chapitre 1 — pastilles factuelles */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={intro(0.8, 0.83)}
          className="absolute bottom-[12vh] left-[18px] z-10 md:bottom-[11vh] md:left-[30px]"
        >
          <motion.div
            style={{ opacity: chapterOneOpacity, y: chapterOneY }}
            className="flex gap-1.5 md:gap-2"
          >
            {hero.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-cream/45 px-2.5 py-1.5 font-sans text-[8px]
                           uppercase tracking-[0.08em] text-cream md:text-[10px]"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Chapitre 2 — l'annonce de la sortie, révélée au scroll */}
        <motion.div
          style={{ opacity: chapterTwoOpacity, y: chapterTwoY, pointerEvents: chapterTwoEvents }}
          className="absolute bottom-[12vh] left-[18px] z-10 max-w-[320px] md:bottom-[11vh] md:left-[30px]"
        >
          <p className="m-0 font-display text-[clamp(24px,2.4vw,39px)] font-bold leading-[0.95] tracking-[-0.03em] text-accent">
            {hero.outro.title}
          </p>
          <p className="mb-0 mt-[15px] font-sans text-xs leading-[1.35] text-cream/70">
            {hero.outro.text}
          </p>
          <Link to={hero.outro.to} className="btn-quiet mt-5 text-cream hover:text-accent">
            {hero.outro.ctaLabel}
            <svg viewBox="0 0 24 24" aria-hidden fill="none" className="h-3.5 w-3.5 stroke-current">
              <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.5" />
            </svg>
          </Link>
        </motion.div>

        {/* Bandeau bas : repère / progression / coordonnées */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={intro(0.8, 0.9)}
          className="absolute bottom-[18px] left-[18px] right-[18px] z-[12] grid
                     grid-cols-[auto,1fr] items-center gap-[18px] font-sans text-[9px] uppercase
                     tracking-[0.1em] text-cream/80 md:bottom-6 md:left-[30px] md:right-[30px]
                     md:grid-cols-[auto,1fr,auto]"
        >
          <span>{site.tagline}</span>
          <span className="h-px overflow-hidden bg-cream/25">
            <motion.span
              style={{ scaleX: progress }}
              className="block h-full w-full origin-left bg-accent"
            />
          </span>
          <span className="hidden md:block">{hero.coordinates}</span>
        </motion.div>
      </div>
    </section>
  )
}
