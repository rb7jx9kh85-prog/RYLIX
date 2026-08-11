import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { PageHeader } from '@/components/PageHeader'
import { Parallax, Reveal } from '@/components/PageTransition'
import { Lightbox, type LightboxItem } from '@/components/Lightbox'
import { photographer, type GalleryPhoto } from '@/lib/content'
import { hasImage } from '@/lib/images'
import { useFirestoreCollection } from '@/lib/useFirestoreCollection'

/** Grille asymétrique : chaque photo occupe une empreinte différente. */
const spanClass: Record<string, string> = {
  tall: 'md:col-span-5 aspect-[3/4]',
  portrait: 'md:col-span-7 aspect-[3/4]',
  square: 'md:col-span-5 aspect-square',
  wide: 'md:col-span-7 aspect-[16/10]',
}

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const { items: gallery } = useFirestoreCollection<GalleryPhoto>('galerie', 'createdAt', 'desc')

  // On n'affiche que les visuels réellement disponibles : une entrée peut être
  // déclarée dans le contenu avant que la photo ne soit fournie.
  const photos = gallery.filter((p) => hasImage(p.key))
  const items: LightboxItem[] = photos.map((p) => ({ key: p.key, alt: p.alt }))

  return (
    <>
      <Seo
        title="Photos"
        description="Identité visuelle de RYLIX — photographies alpines, Valais."
      />

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
          , {photographer.studio}.
        </p>
      </PageHeader>

      <section className="container-rylix pb-lg md:pb-xl">
        {photos.length === 0 ? (
          <p className="text-fg-muted">Aucune photo pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
            {photos.map((photo, i) => (
              <Parallax
                key={photo.key}
                // Les tuiles paires dérivent vers le haut, les impaires vers le bas :
                // la grille respire au scroll sans jamais se désaligner.
                distance={i % 2 === 0 ? 34 : -34}
                className={spanClass[photo.span] ?? spanClass.square}
              >
                <Reveal delay={i * 0.06} className="flex h-full flex-col">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    data-cursor-label="Voir"
                    className="group block min-h-0 flex-1 overflow-hidden rounded-sm"
                  >
                    <span className="sr-only">Agrandir : {photo.alt}</span>
                    <Image
                      imageKey={photo.key}
                      alt={photo.alt}
                      sizes="(max-width: 768px) 92vw, 50vw"
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-rylix group-hover:scale-[1.04]"
                    />
                  </button>
                  {/* Crédit sous chaque photo, comme une légende d'édition. */}
                  <p className="mt-3 shrink-0 font-sans text-[10px] uppercase tracking-[0.12em] text-fg-muted/70">
                    Photo — {photographer.name}
                  </p>
                </Reveal>
              </Parallax>
            ))}
          </div>
        )}
      </section>

      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  )
}
