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
  titleSuffix: 'DJ et producteur',
  description: 'RYLIX est DJ et producteur. Better Days, son premier single, est disponible.',
} as const

/**
 * Présentation de l'artiste, affichée dans la section Biographie de l'accueil.
 *
 * Le texte est découpé en paragraphes plutôt qu'en un bloc unique : c'est ce
 * qui le rend lisible aussi bien sur mobile que sur grand écran.
 */
export const presentation = {
  eyebrow: 'Présentation',
  /** Titre de la section Biographie, sur l'accueil. */
  title: 'DJ et producteur',
  paragraphs: [
    "La musique l'a fait vibrer depuis l'enfance, qu'il l'écoute ou qu'il la joue. Pendant six ans, il a fait de la guitare à l'École de Jazz et de Musique Actuelle (EJMA). Entre-temps, il a appris la batterie en autodidacte.",
    "C'est grâce à l'EJMA qu'il a fait ses débuts sur scène. Cette expérience lui a permis de jouer avec d'autres groupes, en dehors de ce cadre.",
    "Depuis l'automne 2025, il se consacre entièrement à la musique assistée par ordinateur (MAO) et au DJ. Il collabore avec d'autres artistes, toujours avec la même envie : faire vibrer les gens à leur tour.",
  ],
} as const

export type NavItem = { label: string; to: string }

export const nav: NavItem[] = [
  { label: 'Musique', to: '/musique' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Dates', to: '/dates' },
  { label: 'Parcours', to: '/parcours' },
  { label: 'Contact', to: '/contact' },
]

/**
 * Photo plein écran de l'accueil. Sur bureau, `desktopImageKey` : la même
 * photo, intacte au centre, dont les côtés ont été prolongés (montagnes
 * générées puis floutées comme l'arrière-plan d'origine) pour tenir en 16:9.
 */
export const hero = {
  imageKey: 'image-1',
  desktopImageKey: 'hero-paysage',
  alt: 'RYLIX de profil devant un massif alpin, lumière de fin de journée.',
} as const

export type Platform = { name: string; url: string }

export const release = {
  title: 'Better Days',
  type: 'Single',
  /** Date de sortie ISO. */
  releasedAt: '2026-07-31',
  /** Clé dans src/lib/images.generated.ts */
  coverKey: 'better-days-cover',
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

export type SocialName = 'Instagram' | 'TikTok' | 'YouTube' | 'Spotify'
export type Social = { name: SocialName; url: string; handle: string }

export const socials: Social[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/rylix_music', handle: '@rylix_music' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@rylix_music1', handle: '@rylix_music1' },
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
  /**
   * Période en texte libre : « Septembre 2026 », « Mars » ou « 2026 ». Elle
   * fixe l'ordre de la page (voir `periodRank`) ; omise tant qu'elle n'est
   * pas confirmée.
   */
  period?: string
  url?: string
  /** Date d'ajout dans l'admin (ISO), posée par Firestore. */
  createdAt?: string
}

/**
 * Auteur par défaut des photographies du site — crédité sous chaque visuel
 * qui ne déclare pas son propre `credit`.
 */
export type Credit = {
  name: string
  /** Studio ou structure de l'auteur, avec son site : c'est elle qui porte le lien. */
  org?: { name: string; url: string }
}

export const photographer = {
  name: 'Noah Gabioud',
  org: { name: 'Aloa Photography', url: 'https://www.aloa-photography.ch' },
} as const satisfies Credit

/**
 * Autres photographes. Une entrée de galerie porte `credit: '<clé>'` pour
 * être créditée à quelqu'un d'autre que `photographer`.
 */
export const photographers = {
  'anne-sophie-fioretto': {
    name: 'Anne Sophie Fioretto',
    org: { name: "Ima'Gin Swiss", url: 'https://ima-gin.swiss' },
  },
} as const satisfies Record<string, Credit>

export type PhotographerKey = keyof typeof photographers

/**
 * Crédit affiché pour une photo : auteur par défaut si rien n'est déclaré,
 * aucun crédit si `null` (auteur inconnu, rien n'est inventé).
 */
export function creditFor(credit?: PhotographerKey | null): Credit | null {
  if (credit === null) return null
  if (credit && credit in photographers) return photographers[credit]
  return photographer
}

export type GalleryPhoto = {
  /** Clé dans src/lib/images.generated.ts */
  key: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Auteur, si ce n'est pas celui par défaut (voir `photographers`). `null` : auteur inconnu, pas de crédit affiché. */
  credit?: PhotographerKey | null
}

/**
 * Dates et parcours restent gérés depuis l'admin RYLIX (Firestore) et lus en
 * direct à chaque chargement — voir src/lib/useFirestoreCollection.ts.
 *
 * La galerie, elle, est déclarée ici : ce sont des fichiers commités dans le
 * dépôt (assets/photos/), pas un contenu administrable en direct.
 *
 * Une entrée dont l'image n'existe pas encore dans le manifeste est ignorée
 * à l'affichage : la déclarer ici avant d'avoir déposé le fichier ne casse
 * rien, elle apparaît dès que la photo est ajoutée dans assets/photos/ et
 * `npm run images` relancé.
 */
export const gallery: GalleryPhoto[] = [
  {
    key: 'image-1',
    alt: 'RYLIX de profil devant un massif alpin, lumière de fin de journée.',
  },
  {
    key: 'rylix-dj-1',
    alt: 'RYLIX aux platines, casque audio, contrôleur DJ Pioneer.',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'image-2',
    alt: 'RYLIX de profil au pied d’une tour médiévale, drapeaux en haut.',
  },
  {
    key: 'rylix-wildstrubel',
    alt: 'RYLIX aux platines sous un abri en bois, casque autour du cou, pendant le Wildstrubel by UTMB.',
    credit: null,
  },
  {
    key: 'image-3',
    alt: 'RYLIX assis devant un mur de pierres sèches, à travers les herbes hautes.',
  },
  {
    key: 'rylix-dj-exterieur',
    alt: 'RYLIX aux platines en extérieur, terrasse du Miroir de l’Argentine.',
    credit: 'anne-sophie-fioretto',
  },
  {
    key: 'image-4',
    alt: 'RYLIX assis, aperçu à travers des herbes hautes.',
  },
  {
    key: 'rylix-dj-2',
    alt: 'RYLIX aux platines, casquette Ima’Gin, contrôleur DJ Hercules, noir et blanc.',
    credit: 'anne-sophie-fioretto',
  },
]

export type GalleryVideo = {
  /**
   * Chemin statique dans public/videos/ (ex. '/videos/clip.mp4'). Hors de
   * public/images/, que `npm run images` vide et régénère à chaque passage.
   */
  src: string
  /** Image affichée avant que la vidéo ne démarre. Chemin statique dans public/, optionnel. */
  poster?: string
  /** Texte alternatif factuel — accessibilité, pas de storytelling. */
  alt: string
  /** Sens de la vidéo : fixe le cadre de la vignette. */
  format: 'vertical' | 'horizontal'
  /** Auteur — omis si inconnu (pas de crédit par défaut, contrairement aux photos). */
  credit?: PhotographerKey
}

/**
 * Vidéos de la Galerie, dans leur propre petite section sous les photos :
 * lecture automatique muette en boucle, son activable via les contrôles.
 * Déposer le fichier (H.264, ~720p) dans public/videos/ puis ajouter une
 * entrée ici ; aucun script à relancer.
 */
export const galleryVideos: GalleryVideo[] = [
  {
    src: '/videos/wildstrubel-2026.mp4',
    poster: '/videos/wildstrubel-2026.jpg',
    alt: 'Vue depuis la cabine DJ de RYLIX au Wildstrubel by UTMB : enceinte, transats sur la pelouse.',
    format: 'vertical',
  },
  {
    src: '/videos/guitare-terrasse.mp4',
    poster: '/videos/guitare-terrasse.jpg',
    alt: 'RYLIX à la guitare avec un autre musicien, sur une terrasse en montagne.',
    format: 'vertical',
  },
]

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

/** Politique de cookies, générée et hébergée par Biskoui. */
export const cookiePolicyUrl = 'https://policies.biskoui.ch/986029'

/**
 * Liens de pied de page vers les pages légales. Mentions légales retirée
 * temporairement : page et route conservées (voir App.tsx), simplement pas
 * liées tant que legalEntity ci-dessous n'est pas renseigné avec les vraies
 * informations de l'éditeur.
 */
export const legalNav: NavItem[] = [{ label: 'Confidentialité', to: '/confidentialite' }]

/**
 * Identité de l'éditeur du site, pour la page Mentions légales.
 * Champs non déductibles du code : à compléter avec les informations réelles
 * de l'exploitant avant mise en ligne.
 */
export const legalEntity = {
  publisherName:
    '[À COMPLÉTER — nom complet et statut légal de l’exploitant du site, ex. « Jean Dupont, artiste indépendant »]',
  address: '[À COMPLÉTER — adresse postale complète]',
  /** Numéro IDE (Suisse) ou SIRET (France) si une activité est enregistrée. */
  registrationId: '[À COMPLÉTER — numéro IDE ou SIRET si applicable, sinon laisser tel quel]',
} as const
