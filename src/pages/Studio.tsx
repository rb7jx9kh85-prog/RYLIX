import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { PageHeader } from '@/components/PageHeader'
import { Parallax, Reveal, RuleReveal } from '@/components/PageTransition'
import { Lightbox, type LightboxItem } from '@/components/Lightbox'
import { creditFor, soundcloud, studio, studioPhotos } from '@/lib/content'
import { hasImage } from '@/lib/images'

/** Même grille asymétrique que la Galerie — une seule empreinte par photo. */
const spanClass: Record<string, string> = {
  tall: 'md:col-span-5 aspect-[3/4]',
  portrait: 'md:col-span-7 aspect-[3/4]',
  square: 'md:col-span-5 aspect-square',
  wide: 'md:col-span-7 aspect-[16/10]',
}

// La couleur du lecteur passe par l'URL de l'embed : le token CSS ne peut pas
// l'atteindre, la valeur d'accent est donc recopiée ici à la main.
const soundcloudEmbedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  soundcloud.profileUrl
)}&color=%23e0a661&auto_play=false&show_user=true&visual=false`

export default function Studio() {
  const [index, setIndex] = useState<number | null>(null)

  // Comme la Galerie : on n'affiche que les visuels réellement disponibles.
  const photos = studioPhotos.filter((p) => hasImage(p.key))
  const items: LightboxItem[] = photos.map((p) => ({
    key: p.key,
    alt: p.alt,
    credit: creditFor(p.credit),
  }))

  return (
    <>
      <Seo title="Studio" description={studio.intro} />

      <PageHeader eyebrow={studio.eyebrow} title={studio.title}>
        <p>{studio.intro}</p>
      </PageHeader>

      {/* Photos — coulisses et sessions studio */}
      <section className="container-rylix pb-lg md:pb-xl">
        {photos.length === 0 ? (
          <p className="text-fg-muted">Aucune photo pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
            {photos.map((photo, i) => (
              <Parallax
                key={photo.key}
                distance={i % 2 === 0 ? 34 : -34}
                className={spanClass[photo.span] ?? spanClass.square}
              >
                <Reveal delay={i * 0.06} className="flex h-full flex-col">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className="group block min-h-0 flex-1 overflow-hidden rounded-sm"
                  >
                    <span className="sr-only">Agrandir : {photo.alt}</span>
                    <Image
                      imageKey={photo.key}
                      alt={photo.alt}
                      sizes="(max-width: 768px) 92vw, 50vw"
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover transition-transform duration-[300ms] ease-rylix group-hover:scale-[1.04]"
                    />
                  </button>
                  <p className="mt-3 shrink-0 font-sans text-[10px] uppercase tracking-[0.12em] text-fg-muted/70">
                    Photo — {creditFor(photo.credit).name}
                  </p>
                </Reveal>
              </Parallax>
            ))}
          </div>
        )}
      </section>

      {/* SoundCloud — productions studio non postées ailleurs */}
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

      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  )
}
