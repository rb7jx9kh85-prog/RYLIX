import { motion } from 'framer-motion'
import { release, turntableSection } from '@/lib/content'
import { resolveImage } from '@/lib/images'
import { EASE } from '@/lib/motion'

/**
 * Juste sous le hero : la pochette de Better Days, avec le vrai lecteur
 * Spotify compact en dessous (contrôles natifs, attribution Spotify
 * intacte). Pas de mise en scène façon tourne-disque — juste la pochette et
 * le lecteur.
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="md:col-span-7"
          >
            <div
              className="mx-auto flex max-w-md flex-col gap-6 overflow-hidden rounded-md
                         border border-slate/25 bg-gradient-to-b from-navy-alt/90 to-navy
                         p-6 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.65)] md:p-8"
            >
              <Cover cover={cover?.src} title={release.title} />

              {/* Lecteur Spotify compact — vrais contrôles, vraie attribution. */}
              <div className="overflow-hidden rounded-sm bg-navy-alt">
                <iframe
                  title={`Lecteur Spotify — ${release.title}`}
                  src={`https://open.spotify.com/embed/track/${release.spotifyTrackId}`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="block w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** La pochette de Better Days, carrée. */
function Cover({ cover, title }: { cover?: string; title: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-slate/25 bg-navy-alt">
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
