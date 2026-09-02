import { Seo } from '@/components/Seo'
import { Hero } from '@/components/Hero'
import { HomeCards } from '@/components/HomeCards'
import { TurntableSection } from '@/components/TurntableSection'
import { NameNote } from '@/components/NameNote'
import { FinalCta } from '@/components/FinalCta'
import { AmbientLayer } from '@/components/AmbientLayer'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { artist, site, socials } from '@/lib/content'
import { useIsMobile } from '@/lib/motion'

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
  const isMobile = useIsMobile()

  return (
    <>
      <Seo description={site.description} jsonLd={jsonLd} />

      <Hero />

      <TurntableSection />

      {/* Explorer — en flux normal, plus de scroll détourné : la page défile
          normalement, la bande de cartes ne répond qu'au glissement latéral
          explicite (voir HomeCards). Le champ de particules 3D reste réservé
          au bureau, où le pointeur fin en profite ; sur mobile on garde une
          mise en scène plus sobre, sans le coût three.js. */}
      <section className="relative overflow-hidden py-lg md:py-xl" aria-labelledby="explorer">
        {!isMobile && (
          <AmbientLayer className="pointer-events-none absolute inset-0 z-0 opacity-70" />
        )}
        {isMobile && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[60vh] bg-gradient-to-b from-accent/5 via-transparent to-transparent"
          />
        )}

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

        <NameNote />
      </section>

      <FinalCta />
    </>
  )
}
