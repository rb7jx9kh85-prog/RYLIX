import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { PageHeader } from '@/components/PageHeader'
import { Marquee } from '@/components/Marquee'
import { AmbientLayer } from '@/components/AmbientLayer'
import { VinylSection } from '@/components/VinylSection'
import { SocialLinks } from '@/components/SocialLinks'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { usePrefersReducedMotion } from '@/lib/motion'
import { release, site } from '@/lib/content'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicRecording',
  name: release.title,
  datePublished: release.releasedAt,
  byArtist: { '@type': 'MusicGroup', name: site.name, url: site.url },
  url: release.spotifyUrl,
}

const releaseDate = new Date(release.releasedAt).toLocaleDateString('fr-CH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function Music() {
  const reduce = usePrefersReducedMotion()

  return (
    <>
      <Seo
        title="Musique"
        description={`${release.title} — ${release.type.toLowerCase()} de RYLIX, disponible sur toutes les plateformes.`}
        jsonLd={jsonLd}
      />

      <PageHeader eyebrow="Musique" title={release.title}>
        <p>
          {release.type} — sorti le {releaseDate}.
        </p>
      </PageHeader>

      <section className="relative overflow-hidden pb-lg md:pb-xl">
        <AmbientLayer className="pointer-events-none absolute inset-0 z-0 opacity-50" />

        <div className="container-rylix relative z-10">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            {/* Pochette, disque en dérive dessous */}
            <Reveal className="relative md:col-span-6">
              <div className="group relative">
                {!reduce && (
                  <div
                    aria-hidden
                    className="absolute -bottom-8 -right-8 h-[72%] w-[72%] animate-[spin_16s_linear_infinite]
                               rounded-full border border-pale/15 opacity-0 transition-opacity
                               duration-700 ease-rylix group-hover:opacity-100 md:h-[65%] md:w-[65%]"
                    style={{
                      background:
                        'repeating-radial-gradient(circle, rgba(200,203,188,0.12) 0px, rgba(200,203,188,0.12) 1px, transparent 1px, transparent 7px), #1a1c17',
                    }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
                  </div>
                )}

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[-12%] -z-10 rounded-full opacity-0
                             blur-3xl transition-opacity duration-700 ease-rylix group-hover:opacity-60"
                  style={{
                    background: 'radial-gradient(circle, rgba(217,255,67,0.35), transparent 70%)',
                  }}
                />

                <Image
                  imageKey={release.coverKey}
                  alt={`Pochette du single ${release.title} de RYLIX`}
                  sizes="(max-width: 768px) 92vw, 48vw"
                  className="photo aspect-square w-full rounded-sm border border-slate/20 transition-transform
                             duration-700 ease-rylix group-hover:-translate-x-2 group-hover:-translate-y-2"
                  priority
                />
              </div>
            </Reveal>

            <div className="flex flex-col gap-10 md:col-span-6 md:justify-center">
              {/* Player Spotify */}
              <Reveal>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="label">Écouter</h2>
                  <EqualizerBars active={!reduce} />
                </div>
                {/* Fond sombre sous l'iframe : évite un rectangle blanc pendant le
                    chargement ou si l'embed est bloqué par un bloqueur de traceurs. */}
                <div className="overflow-hidden rounded-md border border-slate/20 bg-navy-alt">
                  <iframe
                    title={`Lecteur Spotify — ${release.title} par RYLIX`}
                    src={`https://open.spotify.com/embed/track/${release.spotifyTrackId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="block w-full"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </Reveal>

              {/* Plateformes */}
              <div>
                <Reveal delay={0.08}>
                  <h2 className="label mb-2">Sur toutes les plateformes</h2>
                </Reveal>
                <ul className="flex flex-col">
                  {release.platforms.map((p, i) => (
                    <Reveal key={p.name} delay={0.1 + i * 0.05}>
                      <li className="border-b border-slate/20 first:border-t">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor-label="Écouter"
                          className="group relative flex items-center justify-between overflow-hidden py-4"
                        >
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-0 bg-accent/5 transition-[width]
                                       duration-500 ease-rylix group-hover:w-full"
                          />
                          <span className="relative flex items-center gap-3">
                            <span
                              aria-hidden
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate/40 transition-colors
                                         duration-300 ease-rylix group-hover:bg-accent"
                            />
                            <span className="text-cream transition-colors duration-300 ease-rylix group-hover:text-accent">
                              {p.name}
                            </span>
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            fill="none"
                            className="relative h-4 w-4 stroke-slate transition-all duration-500 ease-rylix
                                       group-hover:translate-x-1 group-hover:stroke-accent"
                          >
                            <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.25" />
                          </svg>
                        </a>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <VinylSection />

      <section className="py-lg md:py-xl" aria-labelledby="partager">
        <div className="container-rylix">
          <RuleReveal className="mb-lg" />
          <div className="grid gap-12 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-5">
              <p id="partager" className="label mb-2">
                Partager
              </p>
              <p className="max-w-prose text-fg-muted">
                {release.title} se découvre aussi de bouche à oreille — le lien en un geste.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="min-w-0 md:col-span-7">
              <ShareLink />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-lg md:pb-xl" aria-labelledby="suivre">
        <div className="container-rylix">
          <RuleReveal className="mb-lg" />
          <div className="grid gap-12 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-5">
              <p id="suivre" className="label mb-2">
                Suivre
              </p>
              <p className="max-w-prose text-fg-muted">
                Les prochaines sorties et dates se suivent d’abord ici.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="md:col-span-7">
              <SocialLinks variant="list" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

/** Copie le lien du morceau — partage natif sur mobile si disponible. */
function ShareLink() {
  const [copied, setCopied] = useState(false)
  const url = release.spotifyUrl

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: release.title, url })
        return
      } catch {
        // Partage annulé ou indisponible : on retombe sur la copie.
      }
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-4 border-y border-slate/20 py-4">
      <code className="min-w-0 flex-1 truncate font-sans text-sm text-fg-muted">{url}</code>
      <button type="button" onClick={handleShare} className="btn shrink-0">
        {copied ? 'Copié' : 'Partager'}
      </button>
    </div>
  )
}

/** Barres façon égaliseur — décor discret, sans prétendre suivre l'audio réel. */
function EqualizerBars({ active }: { active: boolean }) {
  const bars = [
    { duration: 0.7, delay: 0 },
    { duration: 0.9, delay: 0.1 },
    { duration: 0.6, delay: 0.05 },
    { duration: 1.05, delay: 0.15 },
  ]

  return (
    <div aria-hidden className="flex h-4 items-end gap-1">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`eq-bar w-1 rounded-full bg-accent/70 ${active ? 'is-playing' : ''}`}
          style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </div>
  )
}
