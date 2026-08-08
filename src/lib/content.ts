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
} as const

/**
 * Section de présentation, juste sous le hero de l'accueil.
 * `imageKey` pointe vers une clé du manifeste généré par `npm run images`.
 */
export const presentation = {
  eyebrow: 'Présentation',
  text: 'pas de texte pour le moment',
  imageKey: 'image-3',
  imageAlt: 'RYLIX assis devant un mur de pierres sèches, à travers les herbes hautes.',
} as const

export type NavItem = { label: string; to: string }

export const nav: NavItem[] = [
  { label: 'Musique', to: '/musique' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Dates', to: '/dates' },
  { label: 'Parcours', to: '/parcours' },
  { label: 'Contact', to: '/contact' },
]

export type HeroSubject = {
  mobile: { x: number; y: number; rx: number; ry: number }
  desktop: { x: number; y: number; rx: number; ry: number }
}

export type HeroSlide = {
  /** Clé dans src/lib/images.generated.ts */
  imageKey: string
  alt: string
  /** Recadrage (object-position) par point de rupture. */
  objectPosition: { mobile: string; desktop: string }
  /**
   * Zone occupée par l'artiste, en % de la boîte affichée — sert à découper
   * le calque de premier plan qui repasse l'artiste par-dessus le logotype.
   * Absente : la diapositive n'a pas cet effet (image trop texturée pour un
   * découpage net, ou sujet déjà partiellement masqué par le décor).
   */
  subject?: HeroSubject
}

/**
 * Hero à deux diapositives, alternées en 3D (rotation + profondeur). La
 * première porte l'effet signature du site — le « X » de RYLIX qui se glisse
 * derrière l'artiste — la seconde s'affiche pleine image, sans découpage.
 */
export const hero = {
  slides: [
    {
      imageKey: 'image-1',
      alt: 'RYLIX de profil devant un massif alpin valaisan.',
      // Sur grand écran le cadrage est descendu pour que la tête ET le buste
      // de l'artiste tiennent dans le format paysage.
      objectPosition: { mobile: '50% 30%', desktop: '52% 58%' },
      // x/y = centre de l'ellipse, rx/ry = rayons, en % de la boîte affichée.
      subject: {
        mobile: { x: 68, y: 52, rx: 20, ry: 32 },
        desktop: { x: 66, y: 64, rx: 13, ry: 36 },
      },
    },
    {
      imageKey: 'image-4',
      alt: 'RYLIX assis, aperçu à travers des herbes hautes.',
      objectPosition: { mobile: '50% 38%', desktop: '50% 44%' },
    },
  ] satisfies HeroSlide[],
  /** Douceur du bord de l'ellipse d'occlusion, en % du rayon. */
  subjectFeather: 38,
  /**
   * Position visée pour le centre du « X », en % de la largeur de la fenêtre.
   * Calée sur l'ellipse de la première diapositive : seule la fin du mot
   * passe derrière l'artiste, le reste du logotype reste entièrement lisible.
   */
  markX: { mobile: 48, desktop: 53 },
  /** Intervalle entre deux diapositives, en ms. */
  autoplayMs: 7000,
} as const

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
 * Dates confirmées uniquement. Liste vide -> la page /dates affiche son état vide.
 */
export const tourDates: TourDate[] = [
  {
    date: '2026-08-29',
    city: 'Finhaut',
    venue: 'Tournoi populaire du FC Finhaut',
  },
]

export type ParcoursEntry = {
  /** Lieu, événement ou marque. */
  title: string
  /** Nature de la collaboration, en une ligne factuelle. */
  role: string
  /** Localité, si connue. */
  location?: string
  /** Année ou période — omise tant qu'elle n'est pas confirmée. */
  period?: string
  url?: string
}

/**
 * Lieux et événements où RYLIX s'est produit. Liste vide -> état vide sobre.
 */
export const parcours: ParcoursEntry[] = [
  {
    title: "Ima'Gin Suisse",
    role: 'Événements pour la marque',
    location: 'Les Voëttes, Valais',
    url: 'https://ima-gin.swiss/',
  },
]

export type GalleryPhoto = {
  /** Clé dans src/lib/images.generated.ts */
  key: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Empreinte dans la grille asymétrique. */
  span: 'tall' | 'portrait' | 'square' | 'wide'
}

/**
 * Les entrées dont l'image n'existe pas encore dans le manifeste sont ignorées
 * à l'affichage : on peut donc déclarer un visuel avant de l'avoir, il
 * apparaîtra dès que le fichier sera déposé et `npm run images` relancé.
 */
export const gallery: GalleryPhoto[] = [
  {
    key: 'image-1',
    alt: 'RYLIX de profil devant un massif alpin valaisan, lumière de fin de journée.',
    span: 'tall',
  },
  {
    key: 'image-2',
    alt: 'RYLIX de profil au pied d\u2019une tour médiévale, drapeaux suisse et valaisan en haut.',
    span: 'portrait',
  },
  {
    key: 'image-3',
    alt: 'RYLIX assis devant un mur de pierres s\u00e8ches, \u00e0 travers les herbes hautes.',
    span: 'wide',
  },
  {
    key: 'image-4',
    alt: 'RYLIX assis, aper\u00e7u \u00e0 travers des herbes hautes.',
    span: 'portrait',
  },
  {
    key: 'better-days-cover',
    alt: 'Pochette du single Better Days : silhouette de dos face \u00e0 une vall\u00e9e alpine.',
    span: 'square',
  },
]

/**
 * Clé d'accès Web3Forms — publique par conception (comme un identifiant de
 * formulaire Formspree) : elle sert à router l'email et à appliquer le
 * filtrage anti-spam côté Web3Forms, pas à authentifier un compte.
 * Surchargeable par VITE_WEB3FORMS_KEY si la clé change.
 */
export const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY || '835ba476-97db-4c8c-bf81-72b4421ec4f8'

/** Adresse professionnelle. Surchargeable par VITE_CONTACT_EMAIL. */
export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'contact@rylix.ch'
