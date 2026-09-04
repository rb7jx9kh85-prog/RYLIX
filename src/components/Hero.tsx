import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { resolveImage } from '@/lib/images'
import { hero, presentation, site } from '@/lib/content'
import { usePrefersReducedMotion } from '@/lib/motion'

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

/**
 * Hero éditorial en deux temps, épinglé sur 320svh — course longue pour
 * laisser le temps de lire le texte et d'observer les photos.
 *
 * Tout est visible dès le premier rendu : ni rideau d'ouverture, ni
 * révélation progressive, ni dérive de parallaxe au scroll ou au pointeur.
 * Les cadres, le logotype et l'accroche gardent la position et la taille
 * qu'ils ont toujours eues — seule la mécanique d'entrée a disparu.
 *
 * Le seul mouvement qui subsiste est fonctionnel, pas décoratif : le cadre
 * 01 et l'accroche du temps 1 s'effacent en fondu pendant que la
 * présentation du temps 2 apparaît dans la même zone (le pinning réutilise
 * le même espace d'écran pour deux temps du récit) — sans ce fondu les deux
 * temps se superposeraient à l'écran. Ce fondu n'entraîne plus aucun
 * déplacement : ni les cadres, ni le mot RYLIX, ni les textes ne
 * translatent plus au scroll.
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

  // --- Fondu fonctionnel entre les deux temps (voir doc ci-dessus) ---
  const primaryOpacity = useTransform(progress, [0.18, 0.44], reduce ? [1, 1] : [1, 0])
  const chapterOneOpacity = useTransform(progress, [0.05, 0.3], reduce ? [1, 1] : [1, 0])
  const presentationOpacity = useTransform(progress, [0.34, 0.58], reduce ? [0, 0] : [0, 1])

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

        {/* Cadres photo */}
        {/* Cadres : z-index géré cadre par cadre (le 02 passe devant le mot).
            Le conteneur n'est pas masqué aux lecteurs d'écran : les deux
            photos portent un texte alternatif descriptif (voir hero.*.alt). */}
        <div className="absolute inset-0">
          {/* 01 — grand cadre. Fixe ; seule son opacité varie (voir doc plus
              haut), pour laisser place au temps 2. */}
          <motion.div
            style={{ opacity: primaryOpacity }}
            className="absolute left-[12vw] top-[18vh] z-[2] h-[58vh] w-[67vw]
                       md:left-[28vw] md:top-[13vh] md:h-[min(74vh,830px)] md:w-[min(38vw,610px)]"
          >
            <figure className="m-0 h-full w-full overflow-hidden bg-navy-alt shadow-[0_36px_90px_rgba(0,0,0,0.38)]">
              <div className="h-full w-full">
                {primary && (
                  <img
                    src={primary.src}
                    srcSet={primary.srcSet}
                    sizes="(max-width: 768px) 67vw, 38vw"
                    width={primary.width}
                    height={primary.height}
                    alt={hero.primary.alt}
                    {...{ fetchpriority: 'high' }}
                    style={{ objectPosition: 'center 48%' }}
                    className="photo h-[115%] w-full object-cover"
                  />
                )}
              </div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/30" />
            </figure>
          </motion.div>

          {/* 02 — petit cadre incliné. Fixe, aucune animation. */}
          <div
            className="absolute left-[72vw] top-[32vh] z-[2] h-[35vh] w-[36vw]
                       md:top-[26vh] md:h-[min(50vh,570px)] md:w-[min(21vw,350px)]"
          >
            <figure className="m-0 h-full w-full overflow-hidden bg-navy-alt shadow-[0_36px_90px_rgba(0,0,0,0.38)]">
              <div className="h-full w-full">
                {secondary && (
                  <img
                    src={secondary.src}
                    srcSet={secondary.srcSet}
                    sizes="(max-width: 768px) 36vw, 21vw"
                    width={secondary.width}
                    height={secondary.height}
                    alt={hero.secondary.alt}
                    {...{ fetchpriority: 'high' }}
                    style={{ objectPosition: 'center 46%' }}
                    className="photo h-[115%] w-full object-cover"
                  />
                )}
              </div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/30" />
            </figure>
          </div>
        </div>

        {/* RYLIX — au premier plan, à 80% d'opacité : la photo affleure à
            travers les lettres sans que leur dessin soit jamais entamé. Fixe,
            aucune animation d'entrée. */}
        <h1
          className="pointer-events-none absolute inset-x-[3vw] top-[48%] z-[6] flex items-center
                     justify-between font-display font-extrabold uppercase leading-[1.2]
                     text-cream/80 md:inset-x-[2.2vw] md:top-[47%]"
          aria-label="RYLIX"
        >
          {LETTERS.map((letter, i) => (
            <span
              key={`${letter}-${i}`}
              aria-hidden
              className="inline-flex overflow-hidden px-[0.02em] py-[0.12em]"
            >
              <span
                // 17vw : la somme des cinq glyphes Syne 800 tient alors dans la
                // largeur du conteneur, sans rognage aux bords. L'interligne du
                // conteneur parent (leading-[1.2]) est calé sur la hauteur réelle
                // du glyphe à cette graisse — plus serré, le haut et le bas des
                // lettres se retrouvent rognés par l'overflow-hidden ci-dessus.
                className="inline-block text-[17vw] tracking-[-0.045em] md:text-[clamp(7rem,19vw,21rem)] md:tracking-[-0.06em]"
              >
                {letter}
              </span>
            </span>
          ))}
        </h1>

        {/* Accroche, haut gauche. Visible d'emblée ; sous mouvement réduit,
            la présentation est empilée juste dessous : la chorégraphie qui la
            révèle au scroll est désactivée, elle doit rester atteignable
            autrement. */}
        <div className="absolute left-[18px] right-[18px] top-[13%] z-10 md:left-[30px] md:right-auto md:top-[24%] md:max-w-[46vw]">
          <motion.p
            style={{ opacity: chapterOneOpacity }}
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
        </div>

        {/* Second temps — la présentation, là où était le cadre 01.
            Sous mouvement réduit elle est déjà rendue avec l'accroche.

            Même écriture que le logotype : capitales, graisse display,
            mix-blend-difference — le texte s'inverse en passant sur les
            cadres, exactement comme RYLIX au premier temps. */}
        {!reduce && (
          <motion.div
            style={{ opacity: presentationOpacity }}
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

        {/* Bandeau bas : repère et progression. Visible d'emblée ; la barre
            de progression reste liée au scroll — c'est un indicateur
            fonctionnel, pas une révélation. */}
        <div
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
        </div>
      </div>
    </section>
  )
}
