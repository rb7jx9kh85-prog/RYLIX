# RYLIX — site officiel

Site artiste de RYLIX, producteur suisse (Valais). Site statique multipage, sans backend.

- **Stack** : Vite + React 18 + TypeScript, React Router v6, Tailwind CSS, Framer Motion, Lenis
- **Hébergement** : Vercel (statique, `dist/`)
- **Formulaire** : Web3Forms (aucun serveur à maintenir)
- **Aucune clé secrète côté client** — voir [Variables d'environnement](#variables-denvironnement)

---

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:5173
```

| Script | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/` |
| `npm run preview` | Sert `dist/` localement |
| `npm run typecheck` | Vérification TypeScript seule |
| `npm run images` | Régénère les WebP responsive depuis `assets/photos/` |
| `npm run brand` | Régénère le favicon et l'image Open Graph |
| `npm run fonts` | Re-télécharge le woff2 self-hosté (Syne) |

---

## Structure

```
assets/photos/         Photos sources (JPG/PNG haute résolution) — non servies
assets/syne-glyphs.json  Tracés Syne vectorisés (favicon + logotype OG)
public/fonts/          Syne en woff2 (variable), self-hostée
public/images/         WebP responsive générés — ne pas éditer à la main
public/og/             Image Open Graph générée
scripts/               Pipelines images, polices, assets de marque
src/lib/content.ts     Contenu éditorial : liens, sortie, dates, parcours, cadrage du hero
src/lib/motion.ts      Courbe, durées et variantes d'animation partagées
src/lib/images.generated.ts  Manifeste d'images généré — ne pas éditer
src/components/        Layout, header, footer, image, lightbox, SEO
src/pages/             Une page par route
```

### Routes

| Route | Page |
|---|---|
| `/` | Accueil — hero, présentation, teaser dernière sortie |
| `/musique` | Better Days : pochette, player Spotify, plateformes |
| `/galerie` | Grille asymétrique + lightbox |
| `/dates` | Dates confirmées, ou état vide |
| `/parcours` | Lieux, événements et marques |
| `/contact` | Formulaire Web3Forms, email et réseaux |

`/tournee` redirige vers `/dates` : l'ancienne URL reste valide.

---

## Modifier le contenu

Tout le contenu éditorial est dans **`src/lib/content.ts`** — aucune URL n'est écrite en dur
dans les pages.

### Ajouter une date

```ts
export const tourDates: TourDate[] = [
  { date: '2026-08-29', city: 'Finhaut', venue: 'Tournoi populaire du FC Finhaut' },
  { date: '2026-10-04', city: 'Sion', venue: 'Le Port Franc', ticketUrl: 'https://…' },
]
```

Les dates passées sont masquées automatiquement. Liste vide → la page affiche
« Aucune date confirmée pour le moment. »

### Ajouter une entrée au parcours

```ts
export const parcours: ParcoursEntry[] = [
  {
    title: "Ima'Gin Suisse",
    role: 'Événements pour la marque',
    location: 'Les Voëttes, Valais',
    period: '2026',          // facultatif
    url: 'https://ima-gin.swiss/',
  },
]
```

### Ajouter une sortie

Renseigner `release` (titre, date, `spotifyTrackId`, liens plateformes) et déposer la
pochette dans `assets/photos/`, puis `npm run images`.

### Ajouter des photos à la galerie

1. Déposer les fichiers dans `assets/photos/` (JPG ou PNG, pleine résolution)
2. `npm run images` — génère les variantes WebP 480/768/1200/1920 et le manifeste
3. Ajouter l'entrée dans `gallery` (`src/lib/content.ts`) :

```ts
{ key: 'nom-du-fichier-sans-extension', alt: 'Description factuelle.', span: 'wide' }
```

`span` vaut `wide`, `tall` ou `square` — c'est ce qui produit la grille asymétrique.

### Visuels en place

| Fichier source | Emplacement |
|---|---|
| `image-1.jpg` | Hero de l'accueil, et galerie |
| `image-2.jpg` | Galerie |
| `image-3.jpg` | Section présentation de l'accueil |
| `image-4.jpg` | Galerie |
| `better-days-cover.png` | Pochette : accueil, `/musique`, galerie, image Open Graph |

Une entrée de galerie dont l'image n'existe pas dans le manifeste n'est pas
affichée, et la section présentation rend un cadre vide : on peut donc déclarer
un visuel avant de l'avoir, il apparaîtra dès que le fichier sera déposé et
`npm run images` relancé.

---

## Variables d'environnement

Toutes les variables `VITE_*` sont **injectées dans le bundle client, donc publiques**.
Ne jamais y placer de secret. Voir `.env.example`.

| Variable | Rôle | Requise |
|---|---|---|
| `VITE_SITE_URL` | URL canonique de production, sans slash final. Alimente les balises canonical, Open Graph, `robots.txt` et `sitemap.xml`. | Oui en production |
| `VITE_WEB3FORMS_KEY` | Clé d'accès Web3Forms. Une valeur par défaut est déjà en dur dans le code. | Non |
| `VITE_CONTACT_EMAIL` | Remplace l'adresse de contact. Par défaut `contact@rylix.ch`. | Non |

> `VITE_SITE_URL` vaut `https://rylix.ch` par défaut. **Le remplacer par le domaine réel**
> avant la mise en production, sinon les balises canonical et le sitemap pointeront vers
> une URL inexistante.

### Le formulaire de contact

Le formulaire poste directement en JavaScript vers l'API de
[Web3Forms](https://web3forms.com) (`https://api.web3forms.com/submit`), qui
relaie le message par email sans qu'aucun serveur ne soit à maintenir. La clé
d'accès est publique par conception — elle route l'email et sert de garde-fou
anti-spam côté Web3Forms, elle n'authentifie pas un compte.

Pour changer de compte Web3Forms : récupérer la nouvelle clé sur
[web3forms.com](https://web3forms.com), puis soit la remplacer directement dans
`src/lib/content.ts` (`web3formsKey`), soit définir `VITE_WEB3FORMS_KEY` dans
Vercel — cette dernière prend le dessus sur la valeur en dur.

Le formulaire contient un champ piège anti-spam (`botcheck`) traité côté
Web3Forms.

---

## Déploiement Vercel

1. *New Project* → importer le dépôt GitHub
2. Framework preset : **Vite** — les réglages sont déjà dans `vercel.json`
   - Build : `npm run build`
   - Output : `dist`
3. Renseigner les variables d'environnement ci-dessus (Production **et** Preview)
4. Déployer

Chaque push crée un déploiement de preview ; `main` part en production.

`vercel.json` fournit également la réécriture SPA (toutes les routes → `index.html`, ce qui
rend `/musique` accessible en accès direct et au rafraîchissement), le cache long sur les
assets versionnés et quelques en-têtes de sécurité.

---

## Domaine — Vercel + Infomaniak

Le domaine étant réservé chez Infomaniak :

1. **Vercel** → *Project Settings → Domains* → ajouter `tondomaine.ch` **et** `www.tondomaine.ch`
2. Vercel affiche les enregistrements attendus, typiquement :

   | Type | Nom | Valeur |
   |---|---|---|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   > Utiliser les valeurs affichées par Vercel : elles peuvent différer.

3. **Manager Infomaniak** → domaine → *Zone DNS* : créer ou modifier ces deux
   enregistrements, et **supprimer tout `A`/`CNAME`/`ALIAS` existant en conflit** sur `@` et `www`
4. Attendre la propagation (quelques minutes à 24 h). Le statut passe à
   *Valid Configuration* dans Vercel
5. Le certificat SSL est émis automatiquement une fois le DNS validé

Ne pas oublier de mettre `VITE_SITE_URL` à jour avec le domaine réel, puis de redéployer.

---

## Design system

Tokens définis dans `src/index.css`, exposés à Tailwind via `tailwind.config.js`.

| Token | Valeur | Usage |
|---|---|---|
| `--rylix-navy` | `#10151a` | Fond principal |
| `--rylix-navy-alt` | `#171d24` | Fond alternatif |
| `--rylix-slate` | `#4a6572` | Bordures, icônes |
| `--rylix-green` | `#7a9b6e` | Accent ponctuel |
| `--rylix-pale` | `#a8c4cf` | Texte secondaire, hover |
| `--rylix-cream` | `#e8e4d8` | Texte principal |

Chaque couleur existe aussi en canaux RGB (`--rylix-navy-rgb`, …) : c'est ce que Tailwind
consomme, ce qui rend possible les modificateurs d'opacité (`text-cream/80`).

- **Typographie** : Syne sur tout le site, du corps de texte au logotype.
  400/500 pour le texte courant, 700/800 pour les titres. Syne étant une police
  de titrage, l'interligne et l'interlettrage du texte courant sont ouverts dans
  la couche `base` de `src/index.css` pour rester lisibles.
- **Photos** : `filter: grayscale(10%) contrast(1.05) brightness(0.95)` via la classe `.photo`
- **Animations** : fondu + translation courte uniquement ; `prefers-reduced-motion` respecté

La police est self-hostée (`public/fonts/`, sous-ensembles latin + latin-ext, fichier
variable 400-800) : aucune requête vers un domaine tiers, pas de Google Fonts au runtime.

### Animation

Tout le vocabulaire d'animation est centralisé dans `src/lib/motion.ts` : une seule
courbe (`cubic-bezier(0.22, 1, 0.36, 1)`), trois durées. Les pages n'écrivent pas
de valeur d'animation en dur.

- défilement amorti (Lenis), désactivé sous `prefers-reduced-motion`
- révélations au scroll jouées une fois, titres révélés mot à mot derrière un masque
- parallaxe sur le hero, la section présentation et les tuiles de galerie
- filet d'avancement de lecture en haut de page, header qui s'efface en descendant
- survols : fond du CTA qui monte, filet de lien qui se trace, lignes qui se décalent

#### Le « X » derrière l'artiste

Le hero (`src/components/Hero.tsx`) superpose trois calques : la photo, le
logotype, puis **la même photo** découpée à l'ellipse du sujet. Le troisième
calque affiche exactement les mêmes pixels que le premier au même endroit : il
est donc invisible, mais il remet l'artiste au premier plan et le « X » passe
derrière lui.

La position du « X » n'est pas codée en dur : elle est mesurée au rendu
(`useMarkAlignment`) et le logotype est décalé pour que le centre du glyphe tombe
sur `hero.markX`, en pourcentage de la largeur de la fenêtre. Le calcul est refait
au redimensionnement et une fois la police chargée, donc l'alignement tient à
toutes les largeurs malgré le `clamp()` typographique.

Trois valeurs à ajuster dans `src/lib/content.ts` quand la photo change :

| Champ | Effet |
|---|---|
| `hero.objectPosition` | Recadrage — sur desktop, descendre pour garder tête et buste |
| `hero.subject` | Ellipse du sujet (centre + rayons), par point de rupture |
| `hero.markX` | Où doit tomber le centre du « X » — plus bas = moins masqué |

---

## Performance

- Images en WebP, `srcset` 480/768/1200/1920, `sizes` explicite, lazy loading hors hero
- Dimensions intrinsèques sur chaque `<img>` + placeholder LQIP inliné → pas de layout shift
- Polices préchargées, `font-display: swap`
- Pages secondaires chargées en `React.lazy` ; React et Framer Motion en chunks séparés
- Le player Spotify n'est chargé que sur `/musique`, en `loading="lazy"`
