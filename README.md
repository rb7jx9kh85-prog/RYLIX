# RYLIX — site officiel

Site artiste de RYLIX, producteur suisse (Valais). Site statique multipage, sans backend.

- **Stack** : Vite + React 18 + TypeScript, React Router v6, Tailwind CSS, Framer Motion
- **Hébergement** : Vercel (statique, `dist/`)
- **Formulaire** : Formspree (aucun serveur à maintenir)
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
| `npm run fonts` | Re-télécharge les woff2 self-hostés (Inter + Syne) |

---

## Structure

```
assets/photos/         Photos sources (JPG/PNG haute résolution) — non servies
assets/syne-glyphs.json  Tracés Syne vectorisés (favicon + logotype OG)
public/fonts/          Inter + Syne en woff2, self-hostés
public/images/         WebP responsive générés — ne pas éditer à la main
public/og/             Image Open Graph générée
scripts/               Pipelines images, polices, assets de marque
src/lib/content.ts     Contenu éditorial : liens, sortie, dates, réseaux
src/lib/images.generated.ts  Manifeste d'images généré — ne pas éditer
src/components/        Layout, header, footer, image, lightbox, SEO
src/pages/             Une page par route
```

### Routes

| Route | Page |
|---|---|
| `/` | Accueil — hero, teaser dernière sortie, bio |
| `/musique` | Better Days : pochette, player Spotify, plateformes |
| `/galerie` | Grille asymétrique + lightbox |
| `/tournee` | Dates confirmées, ou état vide |
| `/contact` | Formulaire Formspree + réseaux |

---

## Modifier le contenu

Tout le contenu éditorial est dans **`src/lib/content.ts`** — aucune URL n'est écrite en dur
dans les pages.

### Ajouter une date de tournée

```ts
export const tourDates: TourDate[] = [
  { date: '2026-08-29', city: 'Finhaut', venue: 'Tournoi populaire du FC Finhaut' },
  { date: '2026-10-04', city: 'Sion', venue: 'Le Port Franc', ticketUrl: 'https://…' },
]
```

Les dates passées sont masquées automatiquement. Liste vide → la page affiche
« Aucune date confirmée pour le moment. »

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

> **À faire** : la galerie ne contient pour l'instant que deux visuels (la photo
> d'artiste et la pochette de Better Days), les seuls disponibles publiquement.
> Prévoir 4 à 6 photos comme prévu par la direction artistique.

---

## Variables d'environnement

Toutes les variables `VITE_*` sont **injectées dans le bundle client, donc publiques**.
Ne jamais y placer de secret. Voir `.env.example`.

| Variable | Rôle | Requise |
|---|---|---|
| `VITE_SITE_URL` | URL canonique de production, sans slash final. Alimente les balises canonical, Open Graph, `robots.txt` et `sitemap.xml`. | Oui en production |
| `VITE_FORMSPREE_ID` | Identifiant du formulaire Formspree (partie après `/f/`). Sans lui, le formulaire s'affiche désactivé. | Pour le formulaire |
| `VITE_CONTACT_EMAIL` | Adresse affichée sous le formulaire. | Non |

> `VITE_SITE_URL` vaut `https://rylix.ch` par défaut. **Le remplacer par le domaine réel**
> avant la mise en production, sinon les balises canonical et le sitemap pointeront vers
> une URL inexistante.

### Activer le formulaire de contact

1. Créer un formulaire sur [formspree.io](https://formspree.io) et récupérer l'endpoint
   `https://formspree.io/f/xxxxxxx`
2. Dans Vercel : *Project Settings → Environment Variables* → `VITE_FORMSPREE_ID` = `xxxxxxx`
3. Redéployer (les variables `VITE_*` sont lues au build, pas au runtime)

Le formulaire contient un champ piège anti-spam (`_gotcha`) traité côté Formspree.

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

- **Titres** : Syne 700/800, majuscules
- **Texte courant** : Inter 400/500
- **Photos** : `filter: grayscale(10%) contrast(1.05) brightness(0.95)` via la classe `.photo`
- **Animations** : fondu + translation courte uniquement ; `prefers-reduced-motion` respecté

Les polices sont self-hostées (`public/fonts/`, sous-ensembles latin + latin-ext) : aucune
requête vers un domaine tiers, et pas de Google Fonts au runtime.

---

## Performance

- Images en WebP, `srcset` 480/768/1200/1920, `sizes` explicite, lazy loading hors hero
- Dimensions intrinsèques sur chaque `<img>` + placeholder LQIP inliné → pas de layout shift
- Polices préchargées, `font-display: swap`
- Pages secondaires chargées en `React.lazy` ; React et Framer Motion en chunks séparés
- Le player Spotify n'est chargé que sur `/musique`, en `loading="lazy"`
