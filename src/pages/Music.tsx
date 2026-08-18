import { Seo } from '@/components/Seo'
import { TurntableSection } from '@/components/TurntableSection'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { release, site, soundcloud } from '@/lib/content'

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

      {/* Écouter — la pochette et la lecture Spotify dans un seul bloc. */}
      <div className="pt-24 md:pt-28">
        <TurntableSection />
      </div>

      {/* SoundCloud — titres non postés ailleurs */}
      <section className="pb-lg md:pb-xl" aria-labelledby="soundcloud">
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
    </>
  )
}
