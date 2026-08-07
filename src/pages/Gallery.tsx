import { useState } from 'react'
import { Seo } from '@/components/Seo'
import { Image } from '@/components/Image'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { Lightbox, type LightboxItem } from '@/components/Lightbox'
import { gallery } from '@/lib/content'
import type { ImageKey } from '@/lib/images.generated'

/** Grille asymétrique : chaque photo occupe une empreinte différente. */
const spanClass: Record<string, string> = {
  wide: 'md:col-span-8 aspect-[16/10]',
  tall: 'md:col-span-5 aspect-[3/4]',
  square: 'md:col-span-7 aspect-square md:aspect-[4/3]',
}

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null)

  const items: LightboxItem[] = gallery.map((p) => ({ key: p.key as ImageKey, alt: p.alt }))

  return (
    <>
      <Seo
        title="Galerie"
        description="Identité visuelle de RYLIX — photographies alpines, Valais."
      />

      <PageHeader eyebrow="Galerie" title="Images" />

      <section className="container-rylix pb-lg md:pb-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          {gallery.map((photo, i) => (
            <Reveal
              key={photo.key}
              delay={i * 0.05}
              className={spanClass[photo.span] ?? spanClass.square}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group block h-full w-full overflow-hidden rounded-sm"
              >
                <span className="sr-only">Agrandir : {photo.alt}</span>
                <Image
                  imageKey={photo.key as ImageKey}
                  alt={photo.alt}
                  sizes="(max-width: 768px) 92vw, 50vw"
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-rylix group-hover:scale-[1.03]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  )
}
