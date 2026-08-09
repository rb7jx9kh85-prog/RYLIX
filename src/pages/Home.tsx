import { Seo } from '@/components/Seo'
import { Hero } from '@/components/Hero'
import { HomeCards } from '@/components/HomeCards'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { artist, site, socials } from '@/lib/content'

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

      {/* Les cinq entrées du site, sur une seule ligne qui glisse au scroll */}
      <section className="py-lg md:py-xl" aria-labelledby="explorer">
        <div className="container-rylix">
          <RuleReveal className="mb-lg" />
          <Reveal>
            {/* Vrai h2 : sans lui la page passerait du h1 du hero aux h3 des
                cartes, en sautant un niveau. */}
            <h2 id="explorer" className="label mb-8">
              Explorer
            </h2>
          </Reveal>
        </div>

        <HomeCards />
      </section>
    </>
  )
}
