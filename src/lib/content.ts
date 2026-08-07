/**
 * Source de vérité éditoriale du site.
 * Tout le contenu réel (liens, sortie, dates) est centralisé ici : les pages
 * ne contiennent pas d'URL en dur. Aucune clé API — uniquement des liens publics.
 */

export const site = {
  name: 'RYLIX',
  /** Utilisé pour les URL canoniques et le sitemap. Surchargé par VITE_SITE_URL. */
  url: (import.meta.env.VITE_SITE_URL ?? 'https://rylix.ch').replace(/\/$/, ''),
  locale: 'fr_CH',
  lang: 'fr',
  /** Affichée sur le site (hero, footer). */
  tagline: 'Producteur suisse — Valais',
  /** Suffixe du <title> de l'accueil — sans tiret pour éviter un double séparateur. */
  titleSuffix: 'Producteur suisse, Valais',
  description:
    'RYLIX est un producteur suisse originaire du Valais. Better Days, son premier single, est disponible.',
  bio: "RYLIX est un producteur suisse originaire du Valais. Better Days, son premier single, pose les premières bases d'un univers encore en construction — entre paysages alpins et production électronique. D'autres sorties suivront pour affiner cette direction.",
} as const

export type NavItem = { label: string; to: string }

export const nav: NavItem[] = [
  { label: 'Musique', to: '/musique' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Tournée', to: '/tournee' },
  { label: 'Contact', to: '/contact' },
]

export type Platform = { name: string; url: string }

export const release = {
  title: 'Better Days',
  type: 'Single',
  /** Date de sortie ISO. */
  releasedAt: '2026-07-31',
  /** Clé dans src/lib/images.generated.ts */
  coverKey: 'better-days-cover',
  spotifyTrackId: '7tMcpnveczqSb8D1BJ8Zy3',
  spotifyUrl: 'https://open.spotify.com/track/7tMcpnveczqSb8D1BJ8Zy3',
  platforms: [
    { name: 'Spotify', url: 'https://open.spotify.com/track/7tMcpnveczqSb8D1BJ8Zy3' },
    {
      name: 'Apple Music',
      url: 'https://music.apple.com/ch/album/better-days/6790406972?i=6790406977',
    },
    { name: 'Deezer', url: 'https://www.deezer.com/track/4150859232' },
    { name: 'YouTube', url: 'https://www.youtube.com/@RYLIXStudio' },
  ] satisfies Platform[],
} as const

export const artist = {
  spotifyUrl: 'https://open.spotify.com/artist/7J5z5bTji0fyEE3X0xhI3k',
  imusicianUrl: 'https://music.imusician.pro/artist/rylix',
} as const

export type SocialName = 'Instagram' | 'TikTok' | 'YouTube' | 'Spotify'
export type Social = { name: SocialName; url: string; handle: string }

export const socials: Social[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/rylix_music', handle: '@rylix_music' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@rylix.music1', handle: '@rylix.music1' },
  { name: 'YouTube', url: 'https://www.youtube.com/@RYLIXStudio', handle: '@RYLIXStudio' },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/artist/7J5z5bTji0fyEE3X0xhI3k',
    handle: 'RYLIX',
  },
]

export type TourDate = {
  /** ISO — YYYY-MM-DD */
  date: string
  city: string
  venue: string
  /** Billetterie. Vide si l'entrée est libre ou si la billetterie n'est pas ouverte. */
  ticketUrl?: string
}

/**
 * Dates confirmées uniquement. Liste vide -> la page /tournee affiche son état vide.
 */
export const tourDates: TourDate[] = [
  {
    date: '2026-08-29',
    city: 'Finhaut',
    venue: 'Tournoi populaire du FC Finhaut',
  },
]

export type GalleryPhoto = {
  /** Clé dans src/lib/images.generated.ts */
  key: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Poids dans la grille asymétrique. */
  span: 'wide' | 'tall' | 'square'
}

export const gallery: GalleryPhoto[] = [
  {
    key: 'rylix-portrait-valais',
    alt: 'RYLIX de profil devant un massif alpin valaisan, lumière de fin de journée.',
    span: 'tall',
  },
  {
    key: 'better-days-cover',
    alt: "Pochette du single Better Days : silhouette de dos face à une vallée alpine.",
    span: 'square',
  },
]

/** Endpoint Formspree. Défini dans Vercel (VITE_FORMSPREE_ID) — jamais de secret ici. */
export const formspreeId = import.meta.env.VITE_FORMSPREE_ID ?? ''
export const formspreeEndpoint = formspreeId ? `https://formspree.io/f/${formspreeId}` : ''

/** Adresse de repli affichée si elle est définie (VITE_CONTACT_EMAIL). */
export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL ?? ''
