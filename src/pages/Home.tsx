import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Hero } from '@/components/Hero'
import { Image } from '@/components/Image'
import { Reveal, RuleReveal, SplitText } from '@/components/PageTransition'
import { artist, homeCards, release, site, socials, tourDates } from '@/lib/content'
import { formatReleaseDate, isUpcoming } from '@/lib/format'
import { hasImage } from '@/lib/images'

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
  const upcoming = tourDates.filter((d) => isUpcoming(d.date)).length

  // Le teaser des dates suit l'état réel de la liste plutôt qu'un texte figé.
  const teaserFor = (to: string, fallback: string) => {
    if (to !== '/dates') return fallback
    if (upcoming === 0) return 'Aucune date confirmée pour le moment.'
    return `${upcoming} date${upcoming > 1 ? 's' : ''} confirmée${upcoming > 1 ? 's' : ''}.`
  }

  return (
    <>
      <Seo description={site.description} jsonLd={jsonLd} />

      <Hero />

      {/* Dernière sortie */}
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

      {/* Aperçus des onglets */}
      <section className="container-rylix pb-lg md:pb-xl" aria-labelledby="explorer">
        <RuleReveal className="mb-lg" />

        <Reveal>
          <p id="explorer" className="label mb-8">
            Explorer
          </p>
        </Reveal>

        {/* La carte illustrée occupe toute la largeur, les cartes purement
            typographiques se rangent dessous : mélanger les deux dans une même
            rangée étirerait les secondes à vide. */}
        <div className="grid gap-4 sm:grid-cols-3 md:gap-6">
          {homeCards.map((card, i) => {
            const illustrated = Boolean(card.imageKey && hasImage(card.imageKey))

            return (
              <Reveal
                key={card.to}
                delay={i * 0.06}
                className={illustrated ? 'sm:col-span-3' : ''}
              >
                <Link
                  to={card.to}
                  className="group flex h-full flex-col justify-between overflow-hidden rounded-sm
                             border border-slate/25 transition-colors duration-500 ease-rylix
                             hover:border-accent/60"
                >
                  {illustrated && (
                    <Image
                      imageKey={card.imageKey as string}
                      alt={card.imageAlt ?? ''}
                      sizes="(max-width: 640px) 92vw, 90vw"
                      className="aspect-[16/9] w-full sm:aspect-[21/7]"
                      imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-rylix group-hover:scale-[1.04]"
                    />
                  )}

                  <div className="flex items-end justify-between gap-6 p-5 md:p-6">
                    <div>
                      <h3 className="font-display text-h3 font-bold uppercase leading-none text-cream transition-colors duration-300 ease-rylix group-hover:text-accent">
                        {card.label}
                      </h3>
                      <p className="mt-2 text-sm text-fg-muted">
                        {teaserFor(card.to, card.teaser)}
                      </p>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      fill="none"
                      className="h-4 w-4 shrink-0 stroke-slate transition-all duration-500 ease-rylix
                                 group-hover:translate-x-1 group-hover:stroke-accent"
                    >
                      <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.25" />
                    </svg>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}
