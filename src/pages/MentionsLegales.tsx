import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { contactEmail, legalEntity, photographer, photographers, site } from '@/lib/content'

export default function MentionsLegales() {
  return (
    <>
      <Seo
        title="Mentions légales"
        description="Mentions légales du site RYLIX : éditeur, hébergement, crédits."
        noindex
      />

      <PageHeader eyebrow="Informations" title="Mentions légales" />

      <section className="container-rylix flex flex-col gap-10 pb-lg md:pb-xl">
        <Reveal>
          <h2 className="label mb-3">Éditeur du site</h2>
          <p className="max-w-prose text-fg-muted">
            {legalEntity.publisherName}
            <br />
            {legalEntity.address}
            <br />
            {legalEntity.registrationId}
            <br />
            Contact :{' '}
            <a href={`mailto:${contactEmail}`} className="link-quiet">
              {contactEmail}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="label mb-3">Hébergement</h2>
          <p className="max-w-prose text-fg-muted">
            Le site est hébergé par Vercel Inc.
            <br />
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet"
            >
              vercel.com
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="label mb-3">Nom de domaine</h2>
          <p className="max-w-prose text-fg-muted">{site.url.replace('https://', '')}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="label mb-3">Crédits photographiques</h2>
          <p className="max-w-prose text-fg-muted">
            Sauf mention contraire sous une photo, les visuels du site sont réalisés par{' '}
            {photographer.name} ({photographer.studio}).
            <br />
            Autres photographes crédités sur la Galerie :{' '}
            {Object.values(photographers)
              .map((p) => p.name)
              .join(', ')}
            .
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="label mb-3">Propriété intellectuelle</h2>
          <p className="max-w-prose text-fg-muted">
            Les textes, visuels et enregistrements présentés sur ce site appartiennent à {site.name}{' '}
            ou aux auteurs cités ci-dessus. Toute reprise doit faire l'objet d'une autorisation
            préalable.
          </p>
        </Reveal>
      </section>
    </>
  )
}
