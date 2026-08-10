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
 * Présentation de l'artiste — affichée dans le second temps du hero, à la
 * place du cadre de gauche qui s'efface au scroll.
 */
export const presentation = {
  eyebrow: 'Présentation',
  text: 'pas de texte pour le moment',
} as const

/** Section tourne-disque — juste sous le hero, avant le bandeau défilant. */
export const turntableSection = {
  eyebrow: 'Écouter',
  hint: 'Lecture directe, via Spotify.',
} as const

/**
 * Bandeau défilant sous le hero — texte d'ambiance, pas d'information
 * nouvelle. Répété en boucle par le composant Marquee.
 */
export const marquee = [
  'Musique électronique',
  'Née dans les Alpes',
  'Valais — Suisse',
  'Production originale',
] as const

/**
 * Statement éditorial — grande typographie cinétique entre les cartes
 * d'accueil et la section son. Texte d'exemple : à remplacer par la vraie
 * voix de l'artiste, pas une information factuelle vérifiable.
 */
export const manifesto = {
  eyebrow: 'Manifeste',
  title: ['Une musique', 'née en', 'altitude.'],
  body: "Chaque morceau part d'un lieu réel avant de devenir un rythme : un sommet, un silence, une lumière de fin de journée. RYLIX cherche l'endroit où l'électronique retrouve le paysage — et n'en garde que l'essentiel.",
} as const

/** Section son / studio — accompagne la scène 3D. */
export const sound = {
  eyebrow: 'Le son',
  title: ['Chaud.', 'Minéral.', 'Brut.'],
  body: 'Textures analogiques, basses profondes, silences travaillés comme des pleins. Une identité sonore pensée pour l’écoute autant que pour la scène.',
} as const

/** Clôture graphique, juste avant le footer. */
export const finalCta = {
  title: ['Écouter.', 'Regarder.', 'Suivre.'],
  body: 'Better Days est disponible partout. La suite se prépare en Valais.',
} as const

export type NavItem = { label: string; to: string }

export const nav: NavItem[] = [
  { label: 'Musique', to: '/musique' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Dates', to: '/dates' },
  { label: 'Parcours', to: '/parcours' },
  { label: 'Contact', to: '/contact' },
]

export type HeroFrame = {
  /** Clé dans src/lib/images.generated.ts */
  imageKey: string
  alt: string
  /** Numéro affiché dans le coin du cadre. */
  index: string
}

/**
 * Hero éditorial en deux temps, sur une section épinglée.
 *
 *  1. les deux cadres photo se dévoilent, RYLIX est étalé au premier plan
 *  2. au scroll, le cadre de gauche s'efface et laisse la place au texte de
 *     présentation ; le cadre de droite grandit et passe devant le logotype,
 *     qui s'estompe en fond
 */
export const hero = {
  /** Grand cadre, centre-gauche — s'efface au profit de la présentation. */
  primary: {
    imageKey: 'image-3',
    alt: 'RYLIX assis devant un mur de pierres sèches, à travers les herbes hautes.',
    index: '01',
  } satisfies HeroFrame,
  /** Petit cadre, droite — grandit et passe au premier plan. */
  secondary: {
    imageKey: 'image-4',
    alt: 'RYLIX assis, aperçu à travers des herbes hautes.',
    index: '02',
  } satisfies HeroFrame,
  /** Accroche en haut à gauche, une ligne par entrée. */
  intro: ['Paysages alpins,', 'production électronique.'],
  /** Pastilles factuelles du premier temps. */
  chips: ['Producteur', 'Valais', 'Suisse'],
  /** Coordonnées du Valais (Sion), affichées dans le bandeau bas. */
  coordinates: '46.2331° N / 7.3606° E',
} as const

export type HomeCard = {
  to: string
  label: string
  /**
   * Ce que l'aperçu montre :
   *  - `cover`  : la pochette de la dernière sortie
   *  - `mosaic` : les vignettes de la galerie
   *  - `list`   : les infos clés de l'onglet, en lignes
   */
  kind: 'cover' | 'mosaic' | 'list'
  /** Une ligne factuelle, sous le titre. */
  teaser: string
  /** Lignes affichées pour `kind: 'list'`. Vide -> le teaser suffit. */
  lines?: string[]
  /** Largeur relative de la carte sur grand écran. */
  span: 2 | 3 | 4
}

/**
 * Les cinq entrées du site, sur une seule ligne : la sortie ouvre, les onglets
 * suivent. Les cartes visuelles (sortie, galerie) sont resserrées, les cartes
 * de texte plus larges — les tailles suivent la densité réelle du contenu
 * plutôt qu'une grille uniforme.
 *
 * Le contenu des cartes dates et parcours est dérivé des listes réelles à
 * l'affichage (voir src/components/HomeCards.tsx), pas recopié ici.
 */
export const homeCards: HomeCard[] = [
  {
    to: '/musique',
    label: 'Musique',
    kind: 'cover',
    teaser: 'Better Days \u2014 premier single.',
    span: 3,
  },
  {
    to: '/galerie',
    label: 'Galerie',
    kind: 'mosaic',
    teaser: 'Photographies alpines, Valais.',
    span: 2,
  },
  {
    to: '/dates',
    label: 'Dates',
    kind: 'list',
    teaser: 'Prochaines dates.',
    span: 4,
  },
  {
    to: '/parcours',
    label: 'Parcours',
    kind: 'list',
    teaser: 'Lieux, \u00e9v\u00e9nements et marques.',
    span: 4,
  },
  {
    to: '/contact',
    label: 'Contact',
    kind: 'list',
    teaser: 'Bookings, collaborations, presse.',
    lines: ['contact@rylix.ch', 'Instagram \u00b7 TikTok \u00b7 YouTube \u00b7 Spotify'],
    span: 2,
  },
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

/** Auteur des photographies du site — crédité sous chaque visuel. */
export const photographer = {
  name: 'Noah Gabioud',
  studio: 'Aloa Photography',
  url: 'https://www.aloa-photography.ch',
} as const

export type GalleryPhoto = {
  /** Clé dans src/lib/images.generated.ts */
  key: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Empreinte dans la grille asymétrique. */
  span: 'tall' | 'portrait' | 'square' | 'wide'
}

/**
 * Dates, parcours et galerie sont gérés depuis l'admin RYLIX
 * (https://rylix-admin.vercel.app, Firebase Firestore) et récupérés au moment
 * du build par scripts/fetch-firestore-content.mjs — voir
 * src/lib/content.generated.ts (généré, ne pas éditer).
 *
 * Les entrées de galerie dont l'image n'existe pas encore dans le manifeste
 * sont ignorées à l'affichage : on peut donc déclarer un visuel dans l'admin
 * avant de l'avoir traité par le pipeline d'images, il apparaîtra dès que le
 * fichier sera déposé dans assets/photos/ et `npm run images` relancé.
 */
export { tourDates, parcours, gallery } from './content.generated'

/**
 * Clé d'accès Web3Forms — publique par conception (comme un identifiant de
 * formulaire Formspree) : elle sert à router l'email et à appliquer le
 * filtrage anti-spam côté Web3Forms, pas à authentifier un compte.
 * Surchargeable par VITE_WEB3FORMS_KEY si la clé change.
 */
export const web3formsKey =
  import.meta.env.VITE_WEB3FORMS_KEY || '835ba476-97db-4c8c-bf81-72b4421ec4f8'

/** Adresse professionnelle. Surchargeable par VITE_CONTACT_EMAIL. */
export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'contact@rylix.ch'
