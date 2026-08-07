import { Link } from 'react-router-dom'
import { contactEmail, nav, site } from '@/lib/content'
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

      <div className="container-rylix pb-8">
        <p className="text-sm text-fg-muted/70">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}
