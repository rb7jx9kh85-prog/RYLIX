import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page introuvable" description="Cette page n'existe pas." noindex />

      <section className="container-rylix flex min-h-[70vh] flex-col justify-center py-lg">
        <p className="label mb-4">Erreur 404</p>
        <h1 className="font-display text-h1 font-extrabold uppercase">Page introuvable</h1>
        <p className="mt-6 max-w-prose text-fg-muted">Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn mt-10 self-start">
          Retour à l'accueil
        </Link>
      </section>
    </>
  )
}
