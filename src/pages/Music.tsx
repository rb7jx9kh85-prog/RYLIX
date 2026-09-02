import { Seo } from '@/components/Seo'
import { TurntableSection } from '@/components/TurntableSection'
import { release, site } from '@/lib/content'

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

      {/* Écouter — la pochette et la lecture Spotify dans un seul bloc. */}
      <div className="pt-24 pb-lg md:pt-28 md:pb-xl">
        <TurntableSection />
      </div>
    </>
  )
}
