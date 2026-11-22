import { Image } from './Image'
import { Reveal } from './PageTransition'
import { release } from '@/lib/content'
import { formatReleaseDate } from '@/lib/format'

/**
 * La dernière sortie : pochette, titre, date et liens vers chaque plateforme.
 * Sert sur l'accueil et sur la page Musique.
 */
export function ReleaseSection() {
  return (
    <section id="sortie" className="scroll-mt-20 py-lg md:py-xl" aria-labelledby="sortie-titre">
      <div className="container-rylix grid gap-10 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-6 lg:col-span-5">
          <Image
            imageKey={release.coverKey}
            alt={`Pochette de ${release.title}`}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-square w-full rounded-sm"
          />
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col md:col-span-6 lg:col-span-6 lg:col-start-7">
          <p className="label">Dernier single</p>
          <h2
            id="sortie-titre"
            className="mt-3 font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-cream"
          >
            {release.title}
          </h2>
          <p className="mt-4 text-fg-muted">
            {release.type} · sorti le{' '}
            <time dateTime={release.releasedAt}>{formatReleaseDate(release.releasedAt)}</time>
          </p>

          <ul className="mt-8 flex flex-col">
            {release.platforms.map((p) => (
              <li key={p.name} className="border-t border-slate/20 last:border-b">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between py-3.5"
                >
                  <span className="font-medium text-cream transition-colors duration-200 group-hover:text-accent">
                    {p.name}
                  </span>
                  <span className="label transition-colors duration-200 group-hover:text-cream">
                    Écouter
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
