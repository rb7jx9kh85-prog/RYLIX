import { motion, type Variants } from 'framer-motion'
import { release, turntableSection } from '@/lib/content'
import { resolveImage } from '@/lib/images'
import { EASE } from '@/lib/motion'

const panelVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.08 } },
}

const partVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
}

/**
 * Juste sous le hero : la pochette de Better Days, en fiche technique façon
 * tourne-disque. Pas de lecteur embarqué — la pochette renvoie directement
 * vers Spotify.
 */
export function TurntableSection() {
  const cover = resolveImage(release.coverKey)

  return (
    <section className="py-lg md:py-xl" aria-labelledby="ecouter">
      <div className="container-rylix">
        <div className="mb-10 flex items-center gap-4 md:mb-14">
          <span className="font-sans text-sm text-accent">01</span>
          <p id="ecouter" className="label">
            {turntableSection.eyebrow}
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="md:col-span-5"
          >
            <h2 className="text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-cream">
              {release.title}
            </h2>
            <p className="mt-4 max-w-prose text-fg-muted">{turntableSection.hint}</p>

            <a
              href={release.spotifyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.1em]"
            >
              Écouter sur Spotify
              <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 stroke-current" fill="none">
                <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.25" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            variants={panelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            className="md:col-span-7"
          >
            <motion.div
              className="relative mx-auto flex max-w-md flex-col items-center gap-8 overflow-hidden
                         rounded-md border border-slate/25 bg-gradient-to-b from-navy-alt/90 to-navy
                         p-8 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.65)] md:p-12"
            >
              {/* Filet de lumière en haut du panneau — accroche l'œil comme un
                  bord métallique, cohérent avec le reste de la fiche technique. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r
                           from-transparent via-cream/30 to-transparent"
              />
              {/* Plaque signalétique — détail de "vraie machine". */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-6 top-6 flex items-center gap-2
                           font-sans text-[9px] uppercase tracking-[0.18em] text-fg-muted/45 md:left-8 md:top-8"
              >
                <span>RYLIX</span>
                <span className="h-1 w-1 rounded-full bg-slate/50" />
                <span>33⅓ RPM</span>
              </div>

              <motion.div variants={partVariants} className="w-full max-w-[280px]">
                <Cover cover={cover?.src} title={release.title} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** La pochette de Better Days, carrée — plaque signalétique en fond. */
function Cover({ cover, title }: { cover?: string; title: string }) {
  return (
    <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-sm border border-slate/25 bg-navy-alt">
      {cover ? (
        <img
          src={cover}
          alt={`Pochette de ${title}`}
          className="photo h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-full w-full bg-navy-alt" />
      )}
    </div>
  )
}
