import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, RuleReveal } from '@/components/PageTransition'
import { site, type ParcoursEntry } from '@/lib/content'
import { useFirestoreCollection } from '@/lib/useFirestoreCollection'

export default function Parcours() {
  const { items: parcours } = useFirestoreCollection<ParcoursEntry>(
    'parcours',
    'createdAt',
    'desc',
  )

  const jsonLd =
    parcours.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Parcours — ${site.name}`,
          itemListElement: parcours.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            ...(p.url ? { url: p.url } : {}),
          })),
        }
      : undefined

  return (
    <>
      <Seo
        title="Parcours"
        description="Lieux, événements et marques pour lesquels RYLIX s'est produit."
        jsonLd={jsonLd}
      />

      <PageHeader eyebrow="Parcours" title="Lieux et événements">
        <p>Là où RYLIX s'est produit.</p>
      </PageHeader>

      <section className="container-rylix pb-lg md:pb-xl">
        {parcours.length === 0 ? (
          <Reveal>
            <RuleReveal />
            <p className="py-lg text-fg-muted">Rien à afficher pour le moment.</p>
            <RuleReveal />
          </Reveal>
        ) : (
          <ol className="flex flex-col">
            {parcours.map((entry, i) => {
              const inner = (
                <div
                  className="flex flex-col gap-3 py-8 transition-transform duration-500 ease-rylix
                             group-hover:translate-x-2 md:flex-row md:items-baseline md:gap-10 md:py-10"
                >
                  <div className="flex-1">
                    <h2 className="font-display text-h2 font-bold uppercase leading-tight text-cream transition-colors duration-300 group-hover:text-pale">
                      {entry.title}
                    </h2>
                    <p className="mt-2 text-fg-muted">{entry.role}</p>
                  </div>

                  <div className="flex shrink-0 items-baseline gap-4 md:flex-col md:items-end md:gap-1 md:text-right">
                    {entry.location && <p className="text-sm text-fg-muted/80">{entry.location}</p>}
                    {entry.period && (
                      <p className="text-sm tabular-nums text-fg-muted/70">{entry.period}</p>
                    )}
                    {entry.url && (
                      <span className="label mt-1 hidden items-center gap-2 text-fg-muted/70 md:inline-flex">
                        Voir
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden
                          fill="none"
                          className="h-3.5 w-3.5 stroke-current transition-transform duration-500 ease-rylix group-hover:translate-x-1"
                        >
                          <path d="M7 17L17 7M9 7h8v8" strokeWidth="1.5" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              )

              return (
                <li key={entry.title} className="border-t border-slate/20 last:border-b">
                  <Reveal delay={i * 0.06}>
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group block"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group block">{inner}</div>
                    )}
                  </Reveal>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </>
  )
}
