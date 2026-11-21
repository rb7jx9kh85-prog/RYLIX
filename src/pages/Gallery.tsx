import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { Lightbox, type LightboxItem } from '@/components/Lightbox'
import { creditFor, gallery, galleryVideos, photographer } from '@/lib/content'
import { hasImage, resolveImage } from '@/lib/images'

/**
 * Taille (part de la largeur de la case) et alignement vertical de chaque
 * photo, repris en boucle. Volontairement irrégulier, comme une planche
 * de tirages posée à la main.
 */
const LAYOUT: { scale: number; align: string }[] = [
  { scale: 1, align: 'items-start' },
  { scale: 0.78, align: 'items-end' },
  { scale: 0.9, align: 'items-center' },
  { scale: 0.84, align: 'items-center' },
  { scale: 0.76, align: 'items-end' },
  { scale: 1, align: 'items-start' },
  { scale: 0.84, align: 'items-center' },
  { scale: 0.94, align: 'items-end' },
]

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
      <Seo title="Photos" description="Photos de RYLIX : portraits et sets." />

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
          // Planche contact : 4 colonnes (2 sur mobile), chaque case a la même
          // hauteur, la photo y garde son format d'origine. Tailles et
          // alignements varient d'une case à l'autre pour casser la grille sans
          // jamais laisser de rangée incomplète.
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-8 md:gap-y-14">
            {photos.map((photo, i) => {
              const img = resolveImage(photo.key)
              if (!img) return null
              const { scale, align } = LAYOUT[i % LAYOUT.length]
              return (
                <li key={photo.key} className={`flex aspect-[3/4] justify-center ${align}`}>
                  <Reveal delay={(i % 4) * 0.05} className="flex h-full w-full justify-center">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`group flex h-full justify-center ${align}`}
                      style={{ width: `${scale * 100}%` }}
                    >
                      <span className="sr-only">Agrandir : {photo.alt}</span>
                      <img
                        src={img.src}
                        srcSet={img.srcSet}
                        sizes="(min-width: 768px) 22vw, 45vw"
                        width={img.width}
                        height={img.height}
                        alt={photo.alt}
                        loading="lazy"
                        decoding="async"
                        className="photo h-auto max-h-full w-auto max-w-full rounded-sm transition-opacity duration-300 ease-rylix group-hover:opacity-85"
                      />
                    </button>
                  </Reveal>
                </li>
              )
            })}
          </ul>
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
          {/* Même hauteur pour toutes les vidéos, côte à côte et centrées :
              une verticale et une horizontale tiennent sur une rangée.
              Muettes et en boucle, son activable via les contrôles natifs. */}
          <ul className="flex flex-wrap items-end justify-center gap-4 md:gap-8">
            {galleryVideos.map((video, i) => (
              <li
                key={video.src}
                className={
                  video.format === 'horizontal'
                    ? 'w-full md:w-auto'
                    : 'w-[calc(50%-0.5rem)] md:w-auto'
                }
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
                    className={`rounded-sm bg-navy-alt object-cover ${
                      video.format === 'horizontal'
                        ? 'aspect-video w-full md:h-[28rem] md:w-auto'
                        : 'aspect-[9/16] w-full md:h-[28rem] md:w-auto'
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
