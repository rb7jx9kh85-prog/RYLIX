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
  /**
   * Affichée sur le site (hero, footer) — la même formule partout, pour qu'on
   * retienne le métier plutôt que la géographie.
   */
  tagline: 'DJ et producteur',
  /** Suffixe du <title> de l'accueil — sans tiret pour éviter un double séparateur. */
  titleSuffix: 'DJ et producteur, Valais',
  description:
    'RYLIX est un DJ et producteur suisse originaire du Valais. Better Days, son premier single, est disponible.',
} as const

/**
 * Présentation de l'artiste — reprise dans le second temps du hero (première
 * ligne seulement, à la place du cadre qui s'efface) et en entier dans la
 * section Présentation de l'accueil.
 *
 * Le texte est découpé en paragraphes plutôt qu'en un bloc unique : c'est ce
 * qui le rend lisible aussi bien sur mobile que sur grand écran.
 */
export const presentation = {
  eyebrow: 'Présentation',
  /** Titre de la section Présentation, sur l'accueil. */
  title: 'DJ producteur suisse',
  paragraphs: [
    "Guitariste, DJ, producteur, je suis passionné de musique depuis mon enfance, que ce soit en écoutant ou en jouant — ça m'a toujours fait vibrer.",
    "Mais j'ai assez vite eu l'envie de faire mes propres compositions, de créer quelque chose venant de moi. De vouloir faire vibrer les gens à leur tour.",
  ],
} as const

/** Section tourne-disque — juste sous le hero. */
export const turntableSection = {
  eyebrow: 'Écouter',
  hint: 'Lecture directe, via Spotify.',
} as const

/**
 * Origine du nom d'artiste — petite note citée en bas de la section Explorer.
 * Texte de l'artiste, à la première personne.
 */
export const artistName = {
  eyebrow: 'Le nom',
  quote: '',
} as const

/**
 * Clôture graphique, juste avant le footer.
 *
 * Chaque mot est lui-même le lien : le verbe annonce ce qu'on trouve au bout,
 * plutôt qu'un paragraphe qui l'explique puis une rangée d'icônes séparée.
 */
export const finalCta = [
  { word: 'Écouter', platform: 'Spotify', url: 'https://open.spotify.com/artist/7J5z5bTji0fyEE3X0xhI3k' },
  { word: 'Regarder', platform: 'YouTube', url: 'https://www.youtube.com/@RYLIXStudio' },
  { word: 'Suivre', platform: 'Instagram', url: 'https://www.instagram.com/rylix_music' },
] as const

export type NavItem = { label: string; to: string }

export const nav: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Musique', to: '/musique' },
  { label: 'Studio', to: '/studio' },
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
  intro: ['DJ et producteur'],
  /** Coordonnées du Valais (Sion), affichées dans le bandeau bas. */
  coordinates: '46°06′00″ N / 7°04′22″ E',
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
    to: '/studio',
    label: 'Studio',
    kind: 'list',
    teaser: 'Coulisses et productions SoundCloud.',
    lines: ['Photos du studio \u2014 \u00e0 venir.', '\u00c9coute directe via SoundCloud.'],
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
    teaser: 'Bookings, collaborations.',
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
    { name: 'SoundCloud', url: 'https://soundcloud.com/rylix-s' },
  ] satisfies Platform[],
} as const

export const artist = {
  spotifyUrl: 'https://open.spotify.com/artist/7J5z5bTji0fyEE3X0xhI3k',
  imusicianUrl: 'https://music.imusician.pro/artist/rylix',
} as const

/**
 * Titres SoundCloud — productions non postées sur les autres plateformes.
 * Aperçu joué directement via le lecteur embarqué officiel SoundCloud.
 */
export const soundcloud = {
  eyebrow: 'SoundCloud',
  title: 'Découvrez des titres sur SoundCloud',
  body: 'Productions non postées sur les autres plateformes.',
  profileUrl: 'https://soundcloud.com/rylix-s',
} as const

/** En-tête de l'onglet Studio — coulisses en photos et productions SoundCloud. */
export const studio = {
  eyebrow: 'Studio',
  title: 'Dans le studio',
  intro: 'Coulisses et sessions studio en images — les photos arrivent bientôt.',
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

/**
 * Auteur par défaut des photographies du site — crédité sous chaque visuel
 * qui ne déclare pas son propre `credit`.
 */
export const photographer = {
  name: 'Noah Gabioud',
  studio: 'Aloa Photography',
  url: 'https://www.aloa-photography.ch',
} as const

/**
 * Autres photographes. Une entrée de galerie porte `credit: '<clé>'` pour
 * être créditée à quelqu'un d'autre que `photographer`.
 */
export const photographers = {
  'anne-sophie-fioretto': { name: 'Anne Sophie Fioretto' },
} as const

export type PhotographerKey = keyof typeof photographers

/** Crédit affiché pour une photo — auteur par défaut si rien n'est déclaré. */
export function creditFor(credit?: PhotographerKey): { name: string; url?: string } {
  if (credit && credit in photographers) return photographers[credit]
  return { name: photographer.name, url: photographer.url }
}

export type GalleryPhoto = {
  /** Clé dans src/lib/images.generated.ts */
  key: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Empreinte dans la grille asymétrique. */
  span: 'tall' | 'portrait' | 'square' | 'wide'
  /** Auteur, si ce n'est pas celui par défaut (voir `photographers`). */
  credit?: PhotographerKey
}

/**
 * Dates et parcours restent gérés depuis l'admin RYLIX
 * (https://rylix-admin.vercel.app, Firebase Firestore) et lus en direct via
 * le SDK Firebase — voir src/lib/useFirestoreCollection.ts.
 *
 * La galerie, elle, est déclarée ici : ce sont des fichiers commités dans le
 * dépôt (assets/photos/), pas un contenu administrable en direct — pas de
 * dépendance Firebase pour l'afficher.
 *
 * Une entrée dont l'image n'existe pas encore dans le manifeste est ignorée
 * à l'affichage : la déclarer ici avant d'avoir déposé le fichier ne casse
 * rien, elle apparaît dès que la photo est ajoutée dans assets/photos/ et
 * `npm run images` relancé.
 */
export const gallery: GalleryPhoto[] = [
  {
    key: 'image-1',
    alt: 'RYLIX de profil devant un massif alpin valaisan, lumière de fin de journée.',
    span: 'tall',
  },
  {
    key: 'image-2',
    alt: 'RYLIX de profil au pied d’une tour médiévale, drapeaux suisse et valaisan en haut.',
    span: 'portrait',
  },
  {
    key: 'image-3',
    alt: 'RYLIX assis devant un mur de pierres sèches, à travers les herbes hautes.',
    span: 'wide',
  },
  {
    key: 'image-4',
    alt: 'RYLIX assis, aperçu à travers des herbes hautes.',
    span: 'portrait',
  },
  {
    key: 'rylix-dj-exterieur',
    alt: 'RYLIX aux platines en extérieur, terrasse du Miroir de l’Argentine, Valais.',
    span: 'portrait',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'imagin-chalet',
    alt: 'Chalet Miroir de l’Argentine et massif alpin, lors d’un événement Ima’Gin en Valais.',
    span: 'wide',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'rylix-dj-1',
    alt: 'RYLIX aux platines, casque audio, contrôleur DJ Pioneer.',
    span: 'tall',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'imagin-affiche',
    alt: 'Affiche Ima’Gin Suisse, gin alpin, devant les montagnes valaisannes.',
    span: 'square',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'rylix-dj-2',
    alt: 'RYLIX aux platines, casquette Ima’Gin, contrôleur DJ Hercules, noir et blanc.',
    span: 'portrait',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'imagin-ballon',
    alt: 'Ballon publicitaire Ima’Gin au-dessus des chalets, Valais.',
    span: 'wide',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'imagin-crepuscule',
    alt: 'Ciel crépusculaire au-dessus des sapins et de la lune, Valais.',
    span: 'square',
    credit: 'anne-sophie-fioretto',
  },
]

export type GalleryVideo = {
  /** Chemin statique dans public/videos/ — fichier commité tel quel, pas de pipeline de traitement. */
  src: string
  /** Image affichée avant que la vidéo ne démarre. Chemin statique dans public/, optionnel. */
  poster?: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Empreinte dans la grille asymétrique — mêmes valeurs que `GalleryPhoto`. */
  span: 'tall' | 'portrait' | 'square' | 'wide'
  /** Auteur, si ce n'est pas celui par défaut (voir `photographers`). */
  credit?: PhotographerKey
}

/**
 * Vidéos de la Galerie — lues automatiquement (muettes, en boucle) dans la
 * même grille que les photos. Déposer le fichier dans public/videos/ puis
 * ajouter une entrée ici ; contrairement aux photos, aucun script à relancer.
 */
export const galleryVideos: GalleryVideo[] = []

/**
 * Photos de l'onglet Studio — coulisses et sessions, dans le même esprit que
 * `gallery` ci-dessus (mêmes clés d'image, même règle : une entrée sans
 * fichier correspondant est ignorée à l'affichage plutôt que de casser le
 * build). Vide pour l'instant : les photos suivront.
 */
export const studioPhotos: GalleryPhoto[] = []

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
