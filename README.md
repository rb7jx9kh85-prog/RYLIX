# RYLIX — site officiel

Site artiste de RYLIX, DJ et producteur suisse (Valais). Site statique multipage, sans backend.

- **Stack** : Vite + React 18 + TypeScript, React Router v6, Tailwind CSS, Framer Motion
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
| `/` | Accueil — hero (dont présentation), puis les cinq entrées du site sur une ligne |
| `/musique` | Better Days : pochette et lecture Spotify, aperçu SoundCloud |
| `/galerie` | Photos en grille asymétrique + lightbox, créditées |
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

### Structure de l'accueil

`src/pages/Home.tsx`, de haut en bas, comme sur un site officiel d'artiste :

1. **Hero** (`src/components/Hero.tsx`) : photo plein écran (`hero` dans
   `src/lib/content.ts`), nom et métier
2. **Dernier single** (`src/components/ReleaseSection.tsx`, aussi sur `/musique`) :
   pochette, date, liens vers chaque plateforme
3. **Biographie** : texte de `presentation` et une photo créditée
4. **Dates** : les quatre prochaines, lues en direct dans l'admin
5. **Photos** : quatre photos de la galerie (`GALLERY_PREVIEW`)
6. **Booking et contact** : email, réseaux, lien vers le formulaire

### Ajouter une entrée au parcours

Depuis l'admin RYLIX (collection `parcours`), sans nouveau build : titre, rôle, lieu,
période, lien. La page classe du plus récent au plus ancien d'après le champ
**Période** (`periodRank`, `src/lib/format.ts`) :

- `Septembre 2026` ou `sept. 2026`, ou le mois seul (`Mars`, l'année de l'ajout fait foi) ;
  abréviation d'au moins trois lettres, sans ambiguïté (`juil.` oui, `jui` non)
- `2026` sans mois : l'entrée passe avant les entrées datées de la même année
- à période égale, la dernière ajoutée passe en premier

### Ajouter une sortie

Renseigner `release` (titre, date, liens plateformes) et déposer la
pochette dans `assets/photos/`, puis `npm run images`.

### Ajouter des photos à la galerie

1. Déposer les fichiers dans `assets/photos/` (JPG ou PNG, pleine résolution)
2. `npm run images` — génère les variantes WebP 480/768/1200/1920 et le manifeste
3. Ajouter l'entrée dans `gallery` (`src/lib/content.ts`) :

```ts
{ key: 'nom-du-fichier-sans-extension', alt: 'Description factuelle.' }
```

La galerie est une planche contact de 4 colonnes (2 sur mobile) : chaque photo garde son format, taille et alignement varient selon `LAYOUT` (`src/pages/Gallery.tsx`). Garder un nombre de photos multiple de 4 pour que la dernière rangée soit pleine. Seules les photos où RYLIX apparaît y figurent. Auteur inconnu : `credit: null` (aucun crédit affiché).

### Visuels en place

| Fichier source | Emplacement |
|---|---|
| `image-1.jpg` | Hero (mobile), et galerie |
| `hero-paysage.jpg` | Hero (bureau) — généré par `scripts/compose-hero.mjs` |
| `image-2.jpg`, `image-3.jpg`, `image-4.jpg` | Galerie |
| `rylix-wildstrubel.jpg` | Galerie — Wildstrubel by UTMB 2026 (auteur inconnu, non crédité) |
| `rylix-dj-1.jpg`, `rylix-dj-2.jpg`, `rylix-dj-exterieur.jpg` | Galerie — événement Ima'Gin |
| `better-days-cover.png` | Pochette : accueil, `/musique`, image Open Graph |

Les photos sont créditées à leur auteur, sauf `credit: null` (auteur inconnu). L'auteur
par défaut est `photographer` ; une entrée de galerie porte `credit: '<clé>'` (voir
`photographers`) quand la photo est de quelqu'un d'autre, comme la série Ima'Gin d'Anne
Sophie Fioretto. Un auteur peut avoir une structure (`org`, avec son site) : c'est elle
qui porte le lien, pas le nom de la personne. Le crédit s'affiche dans l'en-tête de la
galerie et dans la lightbox. Le `alt` de chaque entrée reste une description de l'image,
pour les lecteurs d'écran.

La galerie est déclarée dans `gallery` (`src/lib/content.ts`), pas administrée
en direct : contrairement aux dates et au parcours (Firestore, admin RYLIX,
lus via l'API REST publique, sans SDK ni clé), ce sont des fichiers commités
dans le dépôt.

Une entrée de galerie dont l'image n'existe pas dans le manifeste n'est pas
affichée : on peut donc déclarer un visuel avant de l'avoir, il apparaîtra dès que le fichier sera déposé et
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

Palette « Ink & Acid » — encre chaude, papier, accent acide. Les noms de
tokens historiques sont conservés (seules les valeurs ont changé), donc les
classes Tailwind existantes restent valables.

| Token | Valeur | Usage |
|---|---|---|
| `--rylix-navy` | `#11120f` | Encre — fond principal |
| `--rylix-navy-alt` | `#1a1c17` | Encre claire — fond alternatif |
| `--rylix-slate` | `#6f7466` | Gris chaud — bordures, icônes |
| `--rylix-green` | `#d9ff43` | Jaune acide — accent (classes `accent`/`green`) |
| `--rylix-pale` | `#c8cbbc` | Papier grisé — texte secondaire |
| `--rylix-cream` | `#f2f0e8` | Papier — texte principal |

Chaque couleur existe aussi en canaux RGB (`--rylix-navy-rgb`, …) : c'est ce que Tailwind
consomme, ce qui rend possible les modificateurs d'opacité (`text-cream/80`).

- **Typographie** : Syne sur tout le site, du corps de texte au logotype.
  400/500 pour le texte courant, 700/800 pour les titres. Syne étant une police
  de titrage, l'interligne et l'interlettrage du texte courant sont ouverts dans
  la couche `base` de `src/index.css` pour rester lisibles.
- **Photos** : `filter: saturate(0.72) contrast(1.04) brightness(0.92)` via la classe `.photo` — désaturation douce
- **Animations** : fondu + translation courte uniquement ; `prefers-reduced-motion` respecté

La police est self-hostée (`public/fonts/`, sous-ensembles latin + latin-ext, fichier
variable 400-800) : aucune requête vers un domaine tiers, pas de Google Fonts au runtime.

### Animation

Tout le vocabulaire d'animation est centralisé dans `src/lib/motion.ts` : une seule
courbe (`cubic-bezier(0.22, 1, 0.36, 1)`), trois durées. Les pages n'écrivent pas
de valeur d'animation en dur.

- défilement natif du navigateur, sans amorti ni effet détourné
- révélations au scroll jouées une fois, titres de page révélés mot à mot
- header qui s'efface en descendant et revient en remontant
- survols : fond du CTA qui monte, filet de lien qui se trace, lignes qui se décalent

#### Le hero

`src/components/Hero.tsx` : une photo, un fondu à l'arrivée, rien au scroll.

- mobile : la photo (portrait) couvre l'écran, le nom est posé en bas
- bureau : `hero-paysage`, la même photo au format 16:9. La photo d'origine est
  intacte au centre ; seuls les côtés sont un décor de montagnes généré
  (`assets/hero/fond-montagnes.jpg`), flouté de plus en plus vers les bords.
  Assemblage : `node scripts/compose-hero.mjs` puis `npm run images`.
- nom et métier centrés en bas
- photos et texte alternatif dans `hero` (`src/lib/content.ts`)

## Performance

- Images en WebP, `srcset` 480/768/1200/1920, `sizes` explicite, lazy loading hors hero
- Dimensions intrinsèques sur chaque `<img>` + placeholder LQIP inliné → pas de layout shift
- Polices préchargées, `font-display: swap`
- Pages secondaires chargées en `React.lazy` ; React et Framer Motion en chunks séparés
- Aucun lecteur ni script tiers sur les pages : les plateformes d'écoute sont de simples liens
