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
      {/* Bureau : la même photo, très floutée, remplit toute la largeur. Les
          côtés gardent ainsi les bleus et gris des montagnes au lieu d'un
          aplat noir. */}
      <div aria-hidden className="absolute inset-0 hidden md:block">
        <Image
          imageKey={hero.imageKey}
          alt=""
          sizes="60vw"
          objectPosition="50% 30%"
          className="absolute inset-0"
          imgClassName="h-full w-full scale-110 object-cover blur-2xl"
        />
      </div>

      {/* La photo nette. Mobile : plein écran. Bureau : centrée, ses deux
          bords s'effacent progressivement dans le fond flouté. */}
      <div className="absolute inset-0 md:left-1/2 md:right-auto md:w-[min(90vw,110vh)] md:-translate-x-1/2 md:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_30%,#000_70%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,#000_30%,#000_70%,transparent)]">
        <Image
          imageKey={hero.imageKey}
          alt={hero.alt}
          sizes="(min-width: 768px) 90vw, 100vw"
          priority
          objectPosition={hero.objectPosition}
          className="absolute inset-0"
          // Bureau : cadrage plus bas pour que le visage reste au-dessus du nom.
          imgClassName="h-full w-full object-cover md:![object-position:50%_62%]"
        />
      </div>

      {/* Lisibilité du menu en haut et du nom en bas, sans noircir la photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/0 via-30% to-navy md:from-navy/65 md:via-transparent md:via-50% md:to-navy/90"
      />

      <div className="container-rylix relative flex h-full flex-col justify-end pb-10 md:pb-14">
        <div className="flex flex-col gap-8 md:items-center md:gap-10 md:text-center">
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
            className="group flex items-center gap-4 self-start md:self-center"
          >
            <span className="block md:text-left">
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
