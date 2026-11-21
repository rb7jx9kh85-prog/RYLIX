import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { ReleaseSection } from '@/components/ReleaseSection'
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

      <PageHeader title="Musique" />

      <div className="-mt-lg md:-mt-xl">
        <ReleaseSection />
      </div>
    </>
  )
}
