import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { Reveal } from '@/components/PageTransition'
import { artist, release, site, socials } from '@/lib/content'
import { formatReleaseDate } from '@/lib/format'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: site.name,
  description: site.bio,
  url: site.url,
  genre: 'Electronic',
  foundingLocation: { '@type': 'Place', name: 'Valais, Suisse' },
  sameAs: socials.map((s) => s.url).concat(artist.imusicianUrl),
}

export default function Home() {
  const reduce = useReducedMotion()

  return (
    <>
      <Seo description={site.description} jsonLd={jsonLd} />

      {/* Hero plein écran */}
      <section className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Image
          imageKey="rylix-portrait-valais"
          alt="RYLIX de profil devant un massif alpin valaisan."
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full"
          objectPosition="50% 30%"
        />
        {/* Dégradé de lisibilité — pas d'assombrissement global */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/25"
        />

        <div className="container-rylix relative pb-16 md:pb-24">
          <motion.h1
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-hero font-extrabold uppercase leading-none text-cream"
          >
            RYLIX
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-center md:justify-between"
          >
            <p className="label text-cream/70">{site.tagline}</p>
            <Link to="/musique" className="btn self-start md:self-auto">
              Écouter
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Teaser dernière sortie */}
      <section className="container-rylix py-lg md:py-xl" aria-labelledby="derniere-sortie">
        <Reveal>
          <p className="label mb-8">Dernière sortie</p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5">
            <Link to="/musique" className="group block">
              <Image
                imageKey={release.coverKey}
                alt={`Pochette du single ${release.title}`}
                sizes="(max-width: 768px) 92vw, 40vw"
                className="aspect-square w-full rounded-sm"
                imgClassName="h-full w-full object-cover transition-transform duration-700 ease-rylix group-hover:scale-[1.02]"
              />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col justify-center md:col-span-7">
            <h2
              id="derniere-sortie"
              className="font-display text-h1 font-extrabold uppercase leading-none"
            >
              {release.title}
            </h2>
            <p className="mt-4 text-fg-muted">
              {release.type} — {formatReleaseDate(release.releasedAt)}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/musique" className="btn">
                Écouter
              </Link>
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-quiet"
              >
                Ouvrir dans Spotify
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bio courte */}
      <section className="container-rylix pb-lg md:pb-xl" aria-labelledby="a-propos">
        <hr className="rule mb-lg" />
        <div className="grid gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <h2 id="a-propos" className="label">
              À propos
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-8">
            <p className="max-w-prose text-lg leading-relaxed text-cream/90">{site.bio}</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
