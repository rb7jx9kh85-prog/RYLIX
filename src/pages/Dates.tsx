import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { site, type TourDate } from '@/lib/content'
import { formatShortDate, getYear, isUpcoming } from '@/lib/format'
import { useFirestoreCollection } from '@/lib/useFirestoreCollection'

export default function Dates() {
  const { items: tourDates } = useFirestoreCollection<TourDate>('dates', 'date', 'asc')

  const upcoming = tourDates
    .filter((d) => isUpcoming(d.date))
    .sort((a, b) => a.date.localeCompare(b.date))

  const jsonLd =
    upcoming.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: upcoming.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'MusicEvent',
              name: `${site.name} — ${d.venue}`,
              startDate: d.date,
              eventStatus: 'https://schema.org/EventScheduled',
              location: {
                '@type': 'Place',
                name: d.venue,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: d.city,
                  addressCountry: 'CH',
                },
              },
              performer: { '@type': 'MusicGroup', name: site.name },
            },
          })),
        }
      : undefined

  return (
    <>
      <Seo
        title="Dates"
        description={
          upcoming.length > 0
            ? `Prochaines dates de RYLIX — ${upcoming.length} date${upcoming.length > 1 ? 's' : ''} confirmée${upcoming.length > 1 ? 's' : ''}.`
            : 'Dates de RYLIX. Aucune date confirmée pour le moment.'
        }
        jsonLd={jsonLd}
      />

      <PageHeader eyebrow="Dates" title="Prochaines dates" />

      <section className="container-rylix pb-lg md:pb-xl">
        {upcoming.length === 0 ? (
          <Reveal>
            <RuleReveal />
            <p className="py-lg text-fg-muted">Aucune date confirmée pour le moment.</p>
            <RuleReveal />
          </Reveal>
        ) : (
          <ol className="flex flex-col">
            {upcoming.map((d, i) => (
              <li key={`${d.date}-${d.venue}`} className="border-t border-slate/20 last:border-b">
                <Reveal delay={i * 0.05}>
                  <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8 md:py-8">
                    <div className="flex shrink-0 items-baseline gap-3 md:w-40">
                      <time dateTime={d.date} className="font-display text-h3 font-bold text-cream">
                        {formatShortDate(d.date)}
                      </time>
                      <span className="text-sm text-fg-muted/70">{getYear(d.date)}</span>
                    </div>

                    <div className="flex-1">
                      <p className="text-lg text-cream">{d.city}</p>
                      <p className="text-fg-muted">{d.venue}</p>
                    </div>

                    {d.ticketUrl && (
                      <div className="shrink-0 md:text-right">
                        <a
                          href={d.ticketUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="btn-quiet"
                        >
                          Billetterie
                        </a>
                      </div>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  )
}
