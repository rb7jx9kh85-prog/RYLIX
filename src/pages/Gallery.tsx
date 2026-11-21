import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { Lightbox, type LightboxItem } from '@/components/Lightbox'
import { creditFor, gallery, galleryVideos, photographer } from '@/lib/content'
import { hasImage } from '@/lib/images'

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null)

  // On n'affiche que les visuels réellement disponibles : une entrée peut être
  // déclarée dans le contenu avant que la photo ne soit fournie.
  const photos = gallery.filter((p) => hasImage(p.key))
  const items: LightboxItem[] = photos.map((p) => ({
    key: p.key,
    alt: p.alt,
    credit: creditFor(p.credit),
  }))

  // Les auteurs autres que celui par défaut, cités une fois dans l'en-tête.
  const otherCredits = [
    ...new Set(photos.filter((p) => p.credit).map((p) => creditFor(p.credit)?.name)),
  ]

  return (
    <>
      <Seo title="Photos" description="Identité visuelle de RYLIX — photographies alpines." />

      <PageHeader eyebrow="Galerie" title="Photos">
        <p>
          Photographies —{' '}
          <a
            href={photographer.url}
            target="_blank"
            rel="noreferrer noopener"
            className="link-quiet"
          >
            {photographer.name}
          </a>
          , {photographer.studio}
          {otherCredits.length > 0 && <> et {otherCredits.join(', ')}</>}.
        </p>
      </PageHeader>

      <section className="container-rylix pb-lg md:pb-xl">
        {photos.length === 0 ? (
          <p className="text-fg-muted">Aucune photo pour le moment.</p>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {/* Colonnes simples : chaque photo garde son format d'origine,
                sans recadrage ni trou dans la grille. */}
            {photos.map((photo, i) => (
              <Reveal key={photo.key} delay={(i % 2) * 0.06} className="mb-6 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group block w-full overflow-hidden rounded-sm"
                >
                  <span className="sr-only">Agrandir : {photo.alt}</span>
                  <Image
                    imageKey={photo.key}
                    alt={photo.alt}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="w-full"
                    imgClassName="h-auto w-full transition-transform duration-[300ms] ease-rylix group-hover:scale-[1.04]"
                  />
                </button>
                {/* Crédit sous chaque photo, comme une légende d'édition —
                      l'auteur varie d'une série à l'autre. */}
                {photo.credit !== null && (
                  <p className="mt-3 shrink-0 font-sans text-[10px] uppercase tracking-[0.12em] text-fg-muted/70">
                    Photo — {creditFor(photo.credit)?.name}
                  </p>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {galleryVideos.length > 0 && (
        <section className="container-rylix pb-lg md:pb-xl" aria-labelledby="videos">
          <Reveal>
            <h2
              id="videos"
              className="mb-6 border-b border-slate/20 pb-4 font-display text-h2 font-extrabold uppercase text-cream md:mb-8"
            >
              Vidéos
            </h2>
          </Reveal>
          {/* Petites vignettes : muettes et en boucle, son activable via les
              contrôles natifs. Une verticale prend une colonne, une
              horizontale deux. */}
          <ul className="grid grid-cols-2 items-start gap-3 md:grid-cols-4 md:gap-4">
            {galleryVideos.map((video, i) => (
              <li
                key={video.src}
                className={video.format === 'horizontal' ? 'col-span-2' : 'col-span-1'}
              >
                <Reveal delay={i * 0.06}>
                  <video
                    src={video.src}
                    poster={video.poster}
                    aria-label={video.alt}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    className={`w-full rounded-sm bg-navy-alt object-cover ${
                      video.format === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]'
                    }`}
                  />
                  {video.credit && (
                    <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.12em] text-fg-muted/70">
                      Vidéo — {creditFor(video.credit)?.name}
                    </p>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  )
}
