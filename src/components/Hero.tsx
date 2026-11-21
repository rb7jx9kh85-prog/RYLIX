import { motion } from 'framer-motion'
import { Image } from './Image'
import { hero, release, site } from '@/lib/content'
import { EASE, usePrefersReducedMotion } from '@/lib/motion'

/**
 * Ouverture de l'accueil : une photo plein écran, le nom, le métier et la
 * dernière sortie. Rien d'autre, comme sur la page d'accueil d'un site
 * officiel d'artiste. Un simple fondu à l'arrivée, aucun effet au scroll.
 */
export function Hero() {
  const reduce = usePrefersReducedMotion()
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: reduce ? 0 : delay, ease: EASE },
  })

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-navy">
      <Image
        imageKey={hero.imageKey}
        alt={hero.alt}
        sizes="(min-width: 768px) 55vw, 100vw"
        priority
        objectPosition={hero.objectPosition}
        className="absolute inset-0 md:left-[45%]"
      />

      {/* Mobile : la photo (portrait) couvre l'écran, assombrie en haut pour le
          menu et en bas pour le nom. Bureau : elle occupe la droite et se fond
          dans l'encre côté texte. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/0 via-30% to-navy md:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-[45%] hidden w-1/3 bg-gradient-to-r from-navy to-navy/0 md:block"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 hidden h-1/4 bg-gradient-to-t from-navy to-navy/0 md:block"
      />

      <div className="container-rylix relative flex h-full flex-col justify-end pb-10 md:pb-14">
        <div className="flex flex-col gap-8 md:gap-12">
          <div>
            <motion.h1
              {...fade(0.1)}
              className="font-display text-[clamp(3.5rem,15vw,11rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-cream"
            >
              {site.name}
            </motion.h1>
            <motion.p {...fade(0.25)} className="label mt-4 text-pale md:mt-5">
              {site.tagline} · Valais
            </motion.p>
          </div>

          <motion.a
            {...fade(0.4)}
            href="#sortie"
            className="group flex items-center gap-4 self-start"
          >
            <span className="block">
              <span className="label block">Dernier single</span>
              <span className="mt-1 block font-display text-xl font-bold uppercase text-cream transition-colors duration-300 group-hover:text-accent">
                {release.title}
              </span>
            </span>
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/40 transition-colors duration-300 group-hover:border-accent"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-cream">
                <path d="M8 5.5v13l10.5-6.5z" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
