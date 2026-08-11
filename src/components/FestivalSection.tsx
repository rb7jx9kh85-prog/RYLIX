import { Image } from './Image'
import { Reveal, SplitText } from './PageTransition'
import { festival } from '@/lib/content'

/**
 * Collaboration avec le festival ima-gin — statement + trois visuels pris
 * sur place, lien direct vers ima-gin.swiss.
 */
export function FestivalSection() {
  return (
    <section className="py-lg md:py-xl" aria-labelledby="festival">
      <div className="container-rylix">
        <div className="mb-10 flex items-center gap-4 md:mb-14">
          <span className="font-sans text-sm text-accent">04</span>
          <Reveal>
            <p id="festival" className="label">
              {festival.eyebrow}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <h2 className="text-balance font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              <SplitText
                as="span"
                text={festival.title}
                delay={0.06}
                className="block text-[clamp(1.75rem,5vw,3rem)]"
              />
            </h2>

            <Reveal delay={0.16} className="mt-6 max-w-prose">
              <p className="text-lg leading-relaxed text-fg-muted">{festival.body}</p>
            </Reveal>

            <Reveal delay={0.22}>
              <a
                href={festival.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-label="Voir"
                className="btn mt-8"
              >
                ima-gin.swiss
              </a>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-7 md:grid-cols-3 md:gap-6">
            {festival.photos.map((photo, i) => (
              <Reveal
                key={photo.key}
                delay={0.1 + i * 0.06}
                className={i === 0 ? 'col-span-2 md:col-span-1' : ''}
              >
                <Image
                  imageKey={photo.key}
                  alt={photo.alt}
                  sizes="(max-width: 768px) 46vw, 22vw"
                  className="aspect-[3/4] w-full overflow-hidden rounded-sm border border-slate/20"
                  imgClassName="h-full w-full object-cover"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
