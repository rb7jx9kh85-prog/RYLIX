import { Link } from 'react-router-dom'
import { contactEmail, cookiePolicyUrl, hero, nav, site } from '@/lib/content'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer className="mt-lg border-t border-slate/20">
      <div className="container-rylix flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="font-display text-base font-extrabold uppercase tracking-[0.18em] text-cream"
          >
            RYLIX
          </Link>
          <p className="text-sm text-fg-muted/80">{site.tagline}</p>
          <a href={`mailto:${contactEmail}`} className="link-quiet mt-1 self-start text-sm">
            {contactEmail}
          </a>
        </div>

        <nav aria-label="Navigation de pied de page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="label hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SocialLinks />
      </div>

      <div className="container-rylix flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-sm text-fg-muted/70">
            © {new Date().getFullYear()} {site.name}
          </p>
          <a
            href="javascript:void(0);"
            onClick={() => window.biskoui?.showBanner()}
            className="link-quiet text-sm text-fg-muted/70"
          >
            Paramètres de confidentialité
          </a>
          <a
            href={cookiePolicyUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="link-quiet text-sm text-fg-muted/70"
          >
            Politique de cookies
          </a>
        </div>
        <p className="font-sans text-[9px] uppercase tracking-[0.1em] text-fg-muted/60">
          {hero.coordinates}
        </p>
      </div>
    </footer>
  )
}
