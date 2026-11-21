import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { Hero } from '@/components/Hero'
import { Image } from '@/components/Image'
import { ReleaseSection } from '@/components/ReleaseSection'
import { Reveal } from '@/components/PageTransition'
import { SocialLinks } from '@/components/SocialLinks'
import {
  artist,
  contactEmail,
  creditFor,
  gallery,
  presentation,
  site,
  socials,
  type TourDate,
} from '@/lib/content'
import { formatShortDate, getYear, isUpcoming } from '@/lib/format'
import { useFirestoreCollection } from '@/lib/useFirestoreCollection'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: site.name,
  description: site.description,
  url: site.url,
  genre: 'Electronic',
  sameAs: socials.map((s) => s.url).concat(artist.imusicianUrl),
}

/** Photo de la section Biographie, et sélection montrée en aperçu de la galerie. */
const BIO_PHOTO = 'rylix-dj-1'
const GALLERY_PREVIEW = ['image-2', 'rylix-dj-exterieur', 'image-3', 'rylix-dj-2']

export default function Home() {
  return (
    <>
      <Seo description={site.description} jsonLd={jsonLd} />
      <Hero />
      <ReleaseSection />
      <Bio />
      <DatesPreview />
      <GalleryPreview />
      <Booking />
    </>
  )
}

/** En-tête de section : sur-titre et lien « tout voir » sur la même ligne. */
function SectionHead({
  id,
  title,
  to,
  more,
}: {
  id: string
  title: string
  to?: string
  more?: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 border-b border-slate/20 pb-4 md:mb-10">
      <h2
        id={id}
        className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold uppercase leading-none tracking-[-0.02em] text-cream"
      >
        {title}
      </h2>
      {to && more && (
        <Link to={to} className="label shrink-0 hover:text-cream">
          {more}
        </Link>
      )}
    </div>
  )
}

function Bio() {
  const photo = gallery.find((p) => p.key === BIO_PHOTO)
  const credit = creditFor(photo?.credit)

  return (
    <section className="bg-navy-alt py-lg md:py-xl" aria-labelledby="bio">
      <div className="container-rylix grid items-center gap-10 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-5">
          <figure>
            <Image
              imageKey={BIO_PHOTO}
              alt={photo?.alt ?? site.name}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/5] w-full rounded-sm"
            />
            {credit && (
              <figcaption className="mt-2 text-xs text-fg-muted/70">Photo {credit.name}</figcaption>
            )}
          </figure>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-7 lg:col-span-6 lg:col-start-7">
          <p className="label">Biographie</p>
          <h2
            id="bio"
            className="mt-3 text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-cream"
          >
            {presentation.title}
          </h2>
          <div className="mt-6 flex max-w-prose flex-col gap-4 text-lg text-pale">
            {presentation.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link to="/parcours" className="btn mt-8">
            Parcours
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function DatesPreview() {
  const { items, loading } = useFirestoreCollection<TourDate>('dates', 'date', 'asc')
  const upcoming = items
    .filter((d) => isUpcoming(d.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)

  return (
    <section className="py-lg md:py-xl" aria-labelledby="dates">
      <div className="container-rylix">
        <Reveal>
          <SectionHead id="dates" title="Dates" to="/dates" more="Toutes les dates" />
        </Reveal>

        {loading ? (
          <div className="h-24" aria-hidden />
        ) : upcoming.length === 0 ? (
          <Reveal>
            <p className="text-fg-muted">
              Aucune date annoncée pour le moment. Booking :{' '}
              <a href={`mailto:${contactEmail}`} className="link-quiet">
                {contactEmail}
              </a>
            </p>
          </Reveal>
        ) : (
          <ol className="flex flex-col">
            {upcoming.map((d) => (
              <li
                key={`${d.date}-${d.venue}`}
                className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-6 gap-y-1 border-b border-slate/20 py-5 md:grid-cols-[9rem_1fr_1fr_auto] md:items-center"
              >
                <time
                  dateTime={d.date}
                  className="font-display text-lg font-bold uppercase text-cream"
                >
                  {formatShortDate(d.date)}
                  <span className="ml-2 font-sans text-sm font-normal text-fg-muted/70">
                    {getYear(d.date)}
                  </span>
                </time>
                <p className="text-lg text-cream">{d.city}</p>
                <p className="col-start-2 text-fg-muted md:col-start-auto">{d.venue}</p>
                {d.ticketUrl && (
                  <a
                    href={d.ticketUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn col-start-2 mt-3 justify-self-start md:col-start-auto md:mt-0"
                  >
                    Billets
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

function GalleryPreview() {
  const photos = GALLERY_PREVIEW.map((key) => gallery.find((p) => p.key === key)).filter(
    (p): p is (typeof gallery)[number] => Boolean(p)
  )

  return (
    <section className="pb-lg md:pb-xl" aria-labelledby="photos">
      <div className="container-rylix">
        <Reveal>
          <SectionHead id="photos" title="Photos" to="/galerie" more="Voir la galerie" />
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {photos.map((p, i) => (
            <li key={p.key}>
              <Reveal delay={i * 0.05}>
                <Link to="/galerie" className="group block overflow-hidden rounded-sm">
                  <Image
                    imageKey={p.key}
                    alt={p.alt}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="aspect-[4/5] w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 ease-rylix group-hover:scale-[1.03]"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Booking() {
  return (
    <section className="border-t border-slate/20 py-lg md:py-xl" aria-labelledby="booking">
      <Reveal className="container-rylix flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="booking" className="label">
            Booking et contact
          </h2>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-3 block break-all font-display text-[clamp(1.5rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.02em] text-cream transition-colors duration-300 hover:text-accent"
          >
            {contactEmail}
          </a>
          <SocialLinks className="mt-8" />
        </div>
        <Link to="/contact" className="btn shrink-0">
          Formulaire de contact
        </Link>
      </Reveal>
    </section>
  )
}
