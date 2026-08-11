import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { TurntableSection } from '@/components/TurntableSection'
import { AmbientLayer } from '@/components/AmbientLayer'
import { VinylSection } from '@/components/VinylSection'
import { SocialLinks } from '@/components/SocialLinks'
import { Reveal, RuleReveal, SplitText } from '@/components/PageTransition'
import { discover, release, site, soundcloud } from '@/lib/content'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicRecording',
  name: release.title,
  datePublished: release.releasedAt,
  byArtist: { '@type': 'MusicGroup', name: site.name, url: site.url },
  url: release.spotifyUrl,
}

const soundcloudEmbedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  soundcloud.profileUrl
)}&color=%23d9ff43&auto_play=false&show_user=true&visual=false`

export default function Music() {
  return (
    <>
      <Seo
        title="Musique"
        description={`${release.title} — ${release.type.toLowerCase()} de RYLIX, disponible sur toutes les plateformes.`}
        jsonLd={jsonLd}
      />

      {/* 1. Pochette */}
      <section className="pb-lg pt-32 md:pb-xl md:pt-40">
        <div className="container-rylix">
          <Reveal>
            <Image
              imageKey={release.coverKey}
              alt={`Pochette du single ${release.title} de RYLIX`}
              sizes="(max-width: 768px) 92vw, 640px"
              className="photo mx-auto aspect-square w-full max-w-xl rounded-sm border border-slate/20"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* 2. Découvrez Better Days — texte simple + liens plateformes */}
      <section className="relative overflow-hidden pb-lg md:pb-xl">
        <AmbientLayer className="pointer-events-none absolute inset-0 z-0 opacity-50" />

        <div className="container-rylix relative z-10">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <Reveal>
                <p className="label mb-4">{discover.eyebrow}</p>
              </Reveal>
              <SplitText
                as="h1"
                text={discover.title}
                delay={0.06}
                className="text-balance font-display text-h1 font-extrabold uppercase"
              />
              <Reveal delay={0.18}>
                <p className="mt-6 max-w-prose text-fg-muted">{discover.body}</p>
              </Reveal>
            </div>

            <div className="md:col-span-6">
              <Reveal delay={0.1}>
                <h2 className="label mb-2">Sur toutes les plateformes</h2>
              </Reveal>
              <ul className="flex flex-col">
                {release.platforms.map((p, i) => (
                  <Reveal key={p.name} delay={0.14 + i * 0.05}>
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
      </section>

      {/* 3. Tourne-disque simplifié — production Spotify */}
      <TurntableSection />

      {/* 4 & 5. SoundCloud — titres non postés ailleurs + aperçu */}
      <section className="py-lg md:py-xl" aria-labelledby="soundcloud">
        <div className="container-rylix">
          <RuleReveal className="mb-lg" />
          <Reveal>
            <p id="soundcloud" className="label mb-2">
              {soundcloud.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-balance font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-cream">
              {soundcloud.title}
            </h2>
            <p className="mt-3 max-w-prose text-fg-muted">{soundcloud.body}</p>
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <div className="overflow-hidden rounded-md border border-slate/20 bg-navy-alt">
              <iframe
                title="Aperçu SoundCloud — RYLIX"
                src={soundcloudEmbedSrc}
                width="100%"
                height="300"
                frameBorder="0"
                loading="lazy"
                allow="autoplay"
                className="block w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

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
