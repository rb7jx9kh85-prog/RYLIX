import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Hero } from '@/components/Hero'
import { Image } from '@/components/Image'
import { Parallax, Reveal, RuleReveal, SplitText } from '@/components/PageTransition'
import { artist, presentation, release, site, socials } from '@/lib/content'
import { formatReleaseDate } from '@/lib/format'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: site.name,
  description: site.description,
  url: site.url,
  genre: 'Electronic',
  foundingLocation: { '@type': 'Place', name: 'Valais, Suisse' },
  sameAs: socials.map((s) => s.url).concat(artist.imusicianUrl),
}

export default function Home() {
  return (
    <>
      <Seo description={site.description} jsonLd={jsonLd} />

      <Hero />

      {/* Présentation — juste sous le hero */}
      <section className="container-rylix py-lg md:py-xl" aria-labelledby="presentation">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <Reveal>
              <p className="label mb-6">{presentation.eyebrow}</p>
            </Reveal>
            <SplitText
              as="h2"
              id="presentation"
              text={presentation.text}
              delay={0.1}
              className="text-balance font-display text-h2 font-bold leading-tight text-cream"
            />
          </div>

          <Parallax distance={48} className="md:col-span-6">
            <Reveal delay={0.08}>
              <Image
                imageKey={presentation.imageKey}
                alt={presentation.imageAlt}
                sizes="(max-width: 768px) 92vw, 46vw"
                className="aspect-[4/5] w-full rounded-sm md:aspect-[3/4]"
              />
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* Dernière sortie */}
      <section className="container-rylix pb-lg md:pb-xl" aria-labelledby="derniere-sortie">
        <RuleReveal className="mb-lg" />

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
                imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-rylix group-hover:scale-[1.04]"
              />
            </Link>
          </Reveal>

          <div className="flex flex-col justify-center md:col-span-7">
            <SplitText
              as="h2"
              id="derniere-sortie"
              text={release.title}
              className="font-display text-h1 font-extrabold uppercase leading-none"
            />
            <Reveal delay={0.12}>
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
        </div>
      </section>
    </>
  )
}
