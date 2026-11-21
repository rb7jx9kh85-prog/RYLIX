import { useState } from 'react'
import { Image } from './Image'
import { Reveal } from './PageTransition'
import { release } from '@/lib/content'
import { formatReleaseDate } from '@/lib/format'

/**
 * La dernière sortie : pochette, titre, date, liens vers chaque plateforme et
 * lecteur Spotify chargé au clic. Sert sur l'accueil et sur la page Musique.
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

          <div className="mt-8">
            <SpotifyPlayer />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Le lecteur Spotify dépose ses propres cookies : il n'est chargé qu'au clic,
 * jamais à l'affichage de la page. La hauteur est réservée d'avance pour que
 * rien ne saute quand l'iframe arrive.
 */
function SpotifyPlayer() {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <div className="overflow-hidden rounded-sm bg-navy-alt">
        <iframe
          title={`Lecteur Spotify, ${release.title}`}
          src={`https://open.spotify.com/embed/track/${release.spotifyTrackId}?autoplay=1`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block w-full"
        />
      </div>
    )
  }

  return (
    <div className="flex h-[152px] flex-col items-start justify-center gap-3 rounded-sm bg-navy-alt px-6">
      <button type="button" className="btn" onClick={() => setLoaded(true)}>
        Écouter ici
      </button>
      <p className="m-0 text-xs text-fg-muted/80">
        Charge le lecteur Spotify, qui dépose ses propres cookies.
      </p>
    </div>
  )
}
