import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { resolveImage } from '@/lib/images'
import { hero, presentation, site } from '@/lib/content'
import { EASE, usePrefersReducedMotion } from '@/lib/motion'

const LETTERS = 'RYLIX'.split('')

/**
 * Écriture de la présentation, calquée sur le logotype : capitales, graisse
 * display, et mix-blend-difference pour que le texte s'inverse en passant sur
 * les cadres photo au lieu de se poser dessus.
 */
const PRESENTATION_TEXT =
  'm-0 font-display font-extrabold uppercase leading-[1.12] tracking-[-0.015em] ' +
  'text-cream mix-blend-difference text-[clamp(14px,3.4vw,19px)] ' +
  'md:text-[clamp(15px,1.55vw,26px)]'

/** Courbe d'intro commune — sortie franche, sans rebond. */
const intro = (duration: number, delay: number) => ({ duration, delay, ease: EASE })

/**
 * Hero éditorial en deux temps, épinglé sur 320svh — course longue pour
 * laisser le temps de lire le texte et d'observer les photos avant que le
 * cadre 02 ne prenne toute la place.
 *
 * Temps 1 — à l'entrée : deux rideaux papier s'ouvrent verticalement, les
 * cadres se dévoilent par clip-path, les lettres de RYLIX montent une à une
 * derrière leur masque.
 *
 * Temps 2 — au défilement : le cadre 01 s'efface et laisse la place au texte
 * de présentation, qui apparaît dans la même zone ; le cadre 02 grandit,
 * passe devant le logotype, lequel s'estompe pour se poser en fond.
 *
 * En continu : les cadres dérivent à des vitesses différentes, leurs photos
 * glissent en sens inverse à l'intérieur (double parallaxe), et réagissent au
 * pointeur en sens opposés.
 *
 * Chaque cadre superpose trois couches de mouvement indépendantes : la dérive
 * de scroll (conteneur externe), l'intro clip-path (figure), la parallaxe
 * pointeur (interne). Le mot reste plein en toutes circonstances — le fondu
 * entre ses deux exemplaires le fait passer derrière les cadres plutôt que de
 * se mélanger avec eux. Tout est statique sous prefers-reduced-motion.
 */
export function Hero() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, mass: 0.3 })

  // --- Dérives liées au scroll (immobiles sous reduced-motion) ---
  const pct = (from: number, to: number) =>
    useTransform(progress, [0, 1], reduce ? [`${from}%`, `${from}%`] : [`${from}%`, `${to}%`])
  const num = (from: number, to: number) =>
    useTransform(progress, [0, 1], reduce ? [from, from] : [from, to])

  // Cadre 01 — dérive puis s'efface : il laisse la place au texte de
  // présentation, qui apparaît exactement dans la même zone.
  const primaryX = pct(0, -30)
  const primaryY = pct(0, -8)
  const primaryScale = num(1, 0.78)
  const primaryRotate = num(0, -2.2)
  const primaryImgY = pct(0, 12)
  const primaryOpacity = useTransform(progress, [0.18, 0.44], reduce ? [1, 1] : [1, 0])

  // Cadre 02 — grandit et vient occuper la scène.
  const secondaryX = pct(0, -47)
  const secondaryY = pct(0, -4)
  const secondaryScale = num(1, 1.5)
  const secondaryRotate = num(2.5, 1.2)
  const secondaryImgY = pct(0, -8)

  const wordY = pct(0, -18)
  const wordScale = num(1, 0.88)

  const chapterOneOpacity = useTransform(progress, [0.05, 0.3], reduce ? [1, 1] : [1, 0])
  const chapterOneY = pct(0, -12)
  const presentationOpacity = useTransform(progress, [0.34, 0.58], reduce ? [0, 0] : [0, 1])
  const presentationY = useTransform(progress, [0.34, 0.58], reduce ? [0, 0] : [28, 0])

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
      className="relative h-[320svh] min-h-[1900px] bg-navy"
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
        {/* Cadres : z-index géré cadre par cadre (le 02 passe devant le mot).
            Le conteneur n'est pas masqué aux lecteurs d'écran : les deux
            photos portent un texte alternatif descriptif (voir hero.*.alt). */}
        <div className="absolute inset-0">
          {/* 01 — grand cadre : dérive scroll sur le conteneur, intro sur la
              figure, pointeur à l'intérieur — trois couches indépendantes. */}
          <motion.div
            style={{
              x: primaryX,
              y: primaryY,
              scale: primaryScale,
              rotate: primaryRotate,
              opacity: primaryOpacity,
            }}
            className="absolute left-[12vw] top-[18vh] z-[2] h-[58vh] w-[67vw]
                       md:left-[28vw] md:top-[13vh] md:h-[min(74vh,830px)] md:w-[min(38vw,610px)]"
          >
            <motion.figure
              initial={reduce ? false : { clipPath: 'inset(50% 0% 50% 0%)', scale: 1.12 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
              transition={intro(1.7, 0.18)}
              className="m-0 h-full w-full overflow-hidden bg-navy-alt shadow-[0_36px_90px_rgba(0,0,0,0.38)]"
            >
              <motion.div
                style={{ x: primaryPointerX, y: primaryPointerY }}
                className="h-full w-full"
              >
                {primary && (
                  <motion.img
                    src={primary.src}
                    srcSet={primary.srcSet}
                    sizes="(max-width: 768px) 67vw, 38vw"
                    width={primary.width}
                    height={primary.height}
                    alt={hero.primary.alt}
                    {...{ fetchpriority: 'high' }}
                    style={{ y: primaryImgY, objectPosition: 'center 48%' }}
                    className="photo h-[115%] w-full object-cover"
                  />
                )}
              </motion.div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/30" />
            </motion.figure>
          </motion.div>

          {/* 02 — petit cadre incliné */}
          <motion.div
            style={{
              x: secondaryX,
              y: secondaryY,
              scale: secondaryScale,
              rotate: secondaryRotate,
            }}
            className="absolute left-[72vw] top-[32vh] z-[2] h-[35vh] w-[36vw]
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
                    alt={hero.secondary.alt}
                    {...{ fetchpriority: 'high' }}
                    style={{ y: secondaryImgY, objectPosition: 'center 46%' }}
                    className="photo h-[115%] w-full object-cover"
                  />
                )}
              </motion.div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/30" />
            </motion.figure>
          </motion.div>
        </div>

        {/* RYLIX — toujours plein, au premier plan : aucune transparence ne
            vient jamais entamer les lettres, quelle que soit la position du
            cadre 02 en dessous. */}
        <Wordmark y={wordY} scale={wordScale} reduce={reduce} />

        {/* Accroche, haut gauche. Sous mouvement réduit, la présentation est
            empilée juste dessous : la chorégraphie qui la révèle au scroll est
            désactivée, elle doit rester atteignable autrement. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={intro(0.8, 0.76)}
          className="absolute left-[18px] right-[18px] top-[13%] z-10 md:left-[30px] md:right-auto md:top-[24%] md:max-w-[46vw]"
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

          {reduce && (
            <div className="mt-8 max-w-prose">
              <p className="label mb-3">{presentation.eyebrow}</p>
              {presentation.paragraphs.map((paragraph, i) => (
                <p key={i} className={`${PRESENTATION_TEXT} mt-4 first:mt-0`}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </motion.div>

        {/* Second temps — la présentation, là où était le cadre 01.
            Sous mouvement réduit elle est déjà rendue avec l'accroche.

            Même écriture que le logotype : capitales, graisse display,
            mix-blend-difference — le texte s'inverse en passant sur les
            cadres, exactement comme RYLIX au premier temps. */}
        {!reduce && (
          <motion.div
            style={{ opacity: presentationOpacity, y: presentationY }}
            className="pointer-events-none absolute inset-x-[18px] top-[17%] z-[9] max-w-[600px]
                       md:inset-x-auto md:left-[30px] md:top-[20%] md:max-w-[52vw]"
          >
            <p className="label mb-4">{presentation.eyebrow}</p>
            {presentation.paragraphs.map((paragraph, i) => (
              <p key={i} className={`${PRESENTATION_TEXT} mt-4 first:mt-0 md:mt-5`}>
                {paragraph}
              </p>
            ))}
          </motion.div>
        )}

        {/* Bandeau bas : repère et progression */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={intro(0.8, 0.9)}
          className="absolute bottom-[18px] left-[18px] right-[18px] z-[12] grid
                     grid-cols-[auto,1fr] items-center gap-[18px] font-sans text-[9px] uppercase
                     tracking-[0.1em] text-cream/80 md:bottom-6 md:left-[30px] md:right-[30px]"
        >
          <span>{site.tagline}</span>
          <span className="h-px overflow-hidden bg-cream/25">
            <motion.span
              style={{ scaleX: progress }}
              className="block h-full w-full origin-left bg-accent"
            />
          </span>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Le logotype — toujours plein, au premier plan (z-index le plus haut de la
 * section) : aucune opacité réduite ne vient jamais le mélanger avec les
 * photos derrière, quelle que soit la position du cadre 02.
 */
function Wordmark({
  y,
  scale,
  reduce,
}: {
  y: MotionValue<string>
  scale: MotionValue<number>
  reduce: boolean
}) {
  return (
    <motion.h1
      style={{ y, scale }}
      className="pointer-events-none absolute inset-x-[3vw] top-[48%] z-[6] flex items-center
                 justify-between font-display font-extrabold uppercase leading-[1.1]
                 text-cream md:inset-x-[2.2vw] md:top-[47%]"
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
            // 17vw : la somme des cinq glyphes Archivo 800 tient alors dans la
            // largeur du conteneur, sans rognage aux bords. L'interligne du
            // conteneur parent (leading-[1.1]) est calé sur la hauteur réelle
            // du glyphe à cette graisse — plus serré, le haut et le bas des
            // lettres se retrouvent rognés par l'overflow-hidden ci-dessous.
            className="inline-block text-[17vw] tracking-[-0.045em] md:text-[clamp(7rem,19vw,21rem)] md:tracking-[-0.06em]"
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}
