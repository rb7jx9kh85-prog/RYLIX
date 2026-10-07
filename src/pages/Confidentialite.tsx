import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { contactEmail, cookiePolicyUrl, site } from '@/lib/content'

export default function Confidentialite() {
  return (
    <>
      <Seo
        title="Confidentialité"
        description="Comment RYLIX traite les données transmises via le formulaire de contact."
        noindex
      />

      <PageHeader eyebrow="Informations" title="Confidentialité" />

      <section className="container-rylix flex flex-col gap-10 pb-lg md:pb-xl">
        <Reveal>
          <h2 className="label mb-3">Données collectées</h2>
          <p className="max-w-prose text-fg-muted">
            Le site ne collecte des données personnelles qu'en cas d'utilisation du formulaire de
            contact : nom, adresse email et message. Aucune autre information n'est demandée, aucun
            compte n'est créé.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="label mb-3">Utilisation</h2>
          <p className="max-w-prose text-fg-muted">
            Ces informations servent uniquement à répondre à la demande envoyée (booking,
            collaboration, question). Le formulaire est transmis par le prestataire Web3Forms
            directement à l'adresse {contactEmail} : {site.name} ne conserve pas de base de données
            de contacts sur ses propres serveurs.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="label mb-3">Cookies</h2>
          <p className="max-w-prose text-fg-muted">
            Le bandeau affiché à la première visite est géré par le prestataire Biskoui.{' '}
            <a
              href={cookiePolicyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet"
            >
              Politique de cookies
            </a>{' '}
            ou{' '}
            <button
              type="button"
              onClick={() => window.biskoui?.showBanner()}
              className="link-quiet"
            >
              modifier les préférences
            </button>
            .
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="label mb-3">Droits</h2>
          <p className="max-w-prose text-fg-muted">
            L'accès, la correction ou la suppression de ces données peuvent être demandés par email
            à{' '}
            <a href={`mailto:${contactEmail}`} className="link-quiet">
              {contactEmail}
            </a>
            . Selon la localisation, l'autorité compétente peut aussi être contactée (CNIL en
            France, PFPDT en Suisse).
          </p>
        </Reveal>
      </section>
    </>
  )
}
