import { motion } from 'framer-motion'
import { hero, site } from '@/lib/content'
import { resolveImage } from '@/lib/images'
import { EASE, usePrefersReducedMotion } from '@/lib/motion'

/**
 * Ouverture de l'accueil : une photo plein écran, le nom et le métier.
 * Rien d'autre, comme sur la page d'accueil d'un site
 * officiel d'artiste. Un simple fondu à l'arrivée, aucun effet au scroll.
 */
export function Hero() {
  const reduce = usePrefersReducedMotion()
  const portrait = resolveImage(hero.imageKey)
  const landscape = resolveImage(hero.desktopImageKey)
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: reduce ? 0 : delay, ease: EASE },
  })

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-navy">
      {/* Deux cadrages de la même photo : portrait sur mobile, paysage sur
          bureau. La version paysage garde la photo d'origine au centre ; seuls
          les côtés (montagnes) ont été prolongés. Le navigateur ne télécharge
          que celle qui correspond à l'écran. */}
      {portrait && landscape && (
        <picture>
          <source media="(min-width: 768px)" srcSet={landscape.srcSet} sizes="100vw" />
          <img
            src={portrait.src}
            srcSet={portrait.srcSet}
            sizes="100vw"
            alt={hero.alt}
            {...{ fetchpriority: 'high' }}
            decoding="async"
            className="photo absolute inset-0 h-full w-full object-cover object-[50%_40%] md:object-center"
          />
        </picture>
      )}

      {/* Lisibilité du menu en haut et du nom en bas, sans noircir la photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/0 via-30% to-navy md:from-navy/65 md:via-transparent md:via-50% md:to-navy/90"
      />

      <div className="container-rylix relative flex h-full flex-col justify-end pb-40 md:pb-20">
        <div className="flex flex-col gap-8 md:items-center md:gap-10 md:text-center">
          <div>
            <motion.h1
              {...fade(0.1)}
              className="font-display text-[clamp(3.5rem,15vw,11rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-cream"
            >
              {site.name}
            </motion.h1>
            <motion.p {...fade(0.25)} className="label mt-4 text-pale md:mt-5">
              {site.tagline}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
