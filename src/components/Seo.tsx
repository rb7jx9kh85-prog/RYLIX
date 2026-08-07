import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { site } from '@/lib/content'

type Props = {
  /** Titre de page, sans le suffixe « — RYLIX ». Omis sur l'accueil. */
  title?: string
  description: string
  /** Chemin absolu de l'image Open Graph. */
  image?: string
  /** Empêche l'indexation (pages utilitaires). */
  noindex?: boolean
  /** JSON-LD additionnel. */
  jsonLd?: Record<string, unknown>
}

const DEFAULT_OG = '/og/rylix-og.jpg'

export function Seo({ title, description, image = DEFAULT_OG, noindex, jsonLd }: Props) {
  const { pathname } = useLocation()
  const canonical = `${site.url}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.titleSuffix}`
  const ogImage = image.startsWith('http') ? image : `${site.url}${image}`

  return (
    <Helmet prioritizeSeoTags>
      <html lang={site.lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
