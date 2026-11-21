import type { ReactNode } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/PageTransition'
import { contactEmail, cookiePolicyUrl, site } from '@/lib/content'

function Block({
  title,
  delay = 0,
  children,
}: {
  title: string
  delay?: number
  children: ReactNode
}) {
  return (
    <Reveal delay={delay}>
      <h2 className="label mb-3">{title}</h2>
      <div className="flex max-w-prose flex-col gap-3 text-fg-muted">{children}</div>
    </Reveal>
  )
}

export default function Confidentialite() {
  return (
    <>
      <Seo
        title="Confidentialité"
        description="Données traitées par le site RYLIX, prestataires utilisés et droits des visiteurs."
        noindex
      />

      <PageHeader eyebrow="Informations" title="Confidentialité" />

      <section className="container-rylix flex flex-col gap-10 pb-lg md:pb-xl">
        <Block title="Responsable">
          <p>
            {site.name}, joignable à{' '}
            <a href={`mailto:${contactEmail}`} className="link-quiet">
              {contactEmail}
            </a>
            . Le site ne crée aucun compte et ne contient ni publicité ni outil de mesure
            d'audience.
          </p>
        </Block>

        <Block title="Hébergement" delay={0.04}>
          <p>
            Le site est hébergé par Vercel Inc. (États-Unis). Comme tout serveur web, il reçoit
            l'adresse IP et le navigateur des visiteurs et en garde une trace technique pour la
            sécurité du service. Base légale : intérêt légitime à faire fonctionner le site.
          </p>
        </Block>

        <Block title="Dates et parcours" delay={0.08}>
          <p>
            Les dates et le parcours sont chargés depuis le service Google Cloud Firestore (Google).
            L'affichage de ces informations transmet l'adresse IP du visiteur à Google. Aucun cookie
            n'est déposé pour cela.
          </p>
        </Block>

        <Block title="Formulaire de contact" delay={0.12}>
          <p>
            Le formulaire envoie le nom, l'adresse email et le message au prestataire Web3Forms, qui
            les transmet par email à {contactEmail}. Ces informations servent uniquement à répondre
            à la demande. Elles sont conservées le temps de l'échange, puis supprimées. Base légale
            : la demande envoyée.
          </p>
        </Block>

        <Block title="Lecteur Spotify" delay={0.16}>
          <p>
            Le lecteur Spotify n'est chargé qu'après un clic sur « Écouter ici ». Spotify AB (Suède)
            dépose alors ses propres cookies, selon sa{' '}
            <a
              href="https://www.spotify.com/legal/privacy-policy/"
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet"
            >
              politique de confidentialité
            </a>
            . Sans ce clic, aucune donnée n'est transmise à Spotify.
          </p>
        </Block>

        <Block title="Cookies" delay={0.2}>
          <p>
            Le site ne dépose lui-même aucun cookie publicitaire ou de mesure d'audience. Le bandeau
            affiché à la première visite est géré par le prestataire suisse Biskoui, qui enregistre
            le choix exprimé.{' '}
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
        </Block>

        <Block title="Transferts hors de Suisse et de l'UE" delay={0.24}>
          <p>
            Vercel et Google sont des entreprises établies aux États-Unis. Les transferts de données
            vers ces prestataires sont encadrés par leurs garanties contractuelles (Data Privacy
            Framework ou clauses contractuelles types de la Commission européenne).
          </p>
        </Block>

        <Block title="Droits" delay={0.28}>
          <p>
            L'accès, la correction, l'effacement ou l'opposition au traitement des données peuvent
            être demandés par email à{' '}
            <a href={`mailto:${contactEmail}`} className="link-quiet">
              {contactEmail}
            </a>
            . Une réclamation peut aussi être adressée à l'autorité compétente : la CNIL en France,
            le PFPDT en Suisse.
          </p>
        </Block>
      </section>
    </>
  )
}
