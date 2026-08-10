import { Seo } from '@/components/Seo'
import { Hero } from '@/components/Hero'
import { HomeCards } from '@/components/HomeCards'
import { TurntableSection } from '@/components/TurntableSection'
import { Marquee } from '@/components/Marquee'
import { Manifesto } from '@/components/Manifesto'
import { VinylSection } from '@/components/VinylSection'
import { FinalCta } from '@/components/FinalCta'
import { AmbientLayer } from '@/components/AmbientLayer'
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

      <TurntableSection />

      <Marquee />

      {/* Les cinq entrées du site, sur une seule ligne qui glisse au scroll.
          Un champ de particules 3D dérive derrière, visible dans les
          interstices transparents des cartes — profondeur, pas décor. */}
      <section className="relative overflow-hidden py-lg md:py-xl" aria-labelledby="explorer">
        <AmbientLayer className="pointer-events-none absolute inset-0 z-0 opacity-70" />

        <div className="container-rylix relative z-10">
          <RuleReveal className="mb-lg" />
          <Reveal>
            {/* Vrai h2 : sans lui la page passerait du h1 du hero aux h3 des
                cartes, en sautant un niveau. */}
            <h2 id="explorer" className="label mb-8">
              Explorer
            </h2>
          </Reveal>
        </div>

        <div className="relative z-10">
          <HomeCards />
        </div>
      </section>

      <Manifesto />
      <VinylSection />
      <FinalCta />
    </>
  )
}
