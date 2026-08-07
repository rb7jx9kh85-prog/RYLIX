import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { artist, release, site } from '@/lib/content'
import { formatReleaseDate } from '@/lib/format'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicRecording',
  name: release.title,
  datePublished: release.releasedAt,
  byArtist: { '@type': 'MusicGroup', name: site.name, url: site.url },
  url: release.spotifyUrl,
}

export default function Music() {
  return (
    <>
      <Seo
        title="Musique"
        description={`${release.title} — ${release.type.toLowerCase()} de RYLIX, disponible sur toutes les plateformes.`}
        jsonLd={jsonLd}
      />

      <PageHeader eyebrow="Musique" title={release.title}>
        <p>{release.title} — dispo maintenant.</p>
      </PageHeader>

      <section className="container-rylix pb-lg md:pb-xl">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          {/* Pochette */}
          <Reveal className="md:col-span-6">
            <Image
              imageKey={release.coverKey}
              alt={`Pochette du single ${release.title} de RYLIX`}
              sizes="(max-width: 768px) 92vw, 48vw"
              className="aspect-square w-full rounded-sm"
              priority
            />
          </Reveal>

          <div className="flex flex-col gap-10 md:col-span-6">
            {/* Métadonnées */}
            <Reveal>
              <dl className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-3 text-sm">
                <dt className="label">Format</dt>
                <dd className="text-cream">{release.type}</dd>
                <dt className="label">Sortie</dt>
                <dd className="text-cream">{formatReleaseDate(release.releasedAt)}</dd>
                <dt className="label">Artiste</dt>
                <dd className="text-cream">RYLIX</dd>
              </dl>
            </Reveal>

            {/* Player Spotify */}
            <Reveal delay={0.06}>
              <h2 className="label mb-4">Écouter</h2>
              {/* Fond sombre sous l'iframe : évite un rectangle blanc pendant le
                  chargement ou si l'embed est bloqué par un bloqueur de traceurs. */}
              <div className="overflow-hidden rounded-md bg-navy-alt">
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
            <Reveal delay={0.12}>
              <h2 className="label mb-2">Plateformes</h2>
              <ul className="flex flex-col">
                {release.platforms.map((p) => (
                  <li key={p.name} className="border-b border-slate/20 first:border-t">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between py-4 transition-colors duration-200 ease-rylix"
                    >
                      <span className="text-cream transition-colors group-hover:text-pale">
                        {p.name}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden
                        fill="none"
                        className="h-4 w-4 stroke-slate transition-all duration-300 ease-rylix group-hover:translate-x-1 group-hover:stroke-pale"
                      >
                        <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.25" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.16}>
          <RuleReveal className="my-lg" />
          <p className="max-w-prose text-fg-muted">
            Discographie complète et mises à jour sur{' '}
            <a
              href={artist.spotifyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet"
            >
              Spotify
            </a>{' '}
            et sur la{' '}
            <a
              href={artist.imusicianUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet"
            >
              page artiste iMusician
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  )
}
