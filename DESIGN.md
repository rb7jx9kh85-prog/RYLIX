# Direction artistique — RYLIX

## En une phrase

Un carnet de bord sobre et chaleureux pour un DJ producteur suisse : de l'encre, du papier, un accent ambré — et des photos réelles, pas une maquette.

**Références retenues** : quentinmosimann.com et buntmusic.com, pour leur typographie assumée, leur minimalisme et leur ambiance de couleur — pas pour une structure de page précise à copier.

## Couleurs

Palette encre / papier / ambre. Variables CSS dans `src/index.css` (`--rylix-*`), exposées comme tokens Tailwind dans `tailwind.config.js`. Aucune couleur écrite en dur dans les composants.

| Rôle                            | Token                              | Valeur    |
| ------------------------------- | ---------------------------------- | --------- |
| Fond principal (encre)          | `--rylix-navy` / `bg-navy`         | `#11120f` |
| Fond alternatif (encre claire)  | `--rylix-navy-alt` / `bg-navy-alt` | `#1a1c17` |
| Texte principal (papier)        | `--rylix-cream` / `text-cream`     | `#f2f0e8` |
| Texte secondaire (papier grisé) | `--rylix-pale` / `text-pale`       | `#c8cbbc` |
| Neutre (bordures, icônes)       | `--rylix-slate` / `text-slate`     | `#6f7466` |
| **Accent** (ambre doré)         | `--rylix-green` / `text-accent`    | `#e0a661` |

L'accent est la seule couleur vive du site : sélection de texte, remplissage des boutons au survol, filet de progression de scroll, surbrillance d'un élément actif. Il ne décore jamais un fond entier.

Aucun dégradé décoratif. Les quelques `bg-gradient-to-b` existants (vignettage photo du hero, fond de carte du lecteur, halo très léger en mobile) restent dans la palette ci-dessus et servent un effet physique (lumière, vignette) — jamais un aplat violet/bleu/rose de template.

## Typographie

Une seule famille, **Syne** (self-hostée, `src/styles/fonts.css`), du corps de texte au logotype — `font-display` et `font-sans` pointent toutes les deux vers elle. Pas de deuxième police : Syne couvre aussi bien les titres (graisse 700/800) que le texte courant (400).

Échelle (`tailwind.config.js`, en `clamp()` pour rester fluide) :

| Usage                  | Classe                | Taille                               |
| ---------------------- | --------------------- | ------------------------------------ |
| Logotype hero          | `text-hero`           | 2.75rem → 9rem                       |
| Titre de page          | `text-h1`             | 2rem → 3.25rem                       |
| Titre de section/carte | `text-h2` / `text-h3` | 1.5rem → 2rem / 1.125rem → 1.375rem  |
| Corps de texte         | taille de base        | 1rem, interligne 1.7                 |
| Sur-titre / label      | `.label`              | 0.75rem, majuscules, tracking 0.14em |

Graisses utilisées : 400 (texte courant), 500 (labels), 700/800 (titres h1-h3, logotype). Rien entre les deux.

## Formes

**Un seul rayon d'arrondi pour tout le site : `rounded-sm` (4px)** — boutons, cartes, champs de formulaire, images, badges.

Exception unique, fonctionnelle et non décorative : les deux flèches rondes de navigation d'`HomeCards` (`rounded-full`) sont des boutons-icônes circulaires, pas des boutons texte en pilule. Aucun autre `rounded-full`, `rounded-xl/2xl/3xl` n'est permis ailleurs.

Grille d'espacement régulière, base 0.5rem (`tailwind.config.js`) :

| Token | Valeur |
| ----- | ------ |
| `xs`  | 0.5rem |
| `sm`  | 1rem   |
| `md`  | 2rem   |
| `lg`  | 4rem   |
| `xl`  | 8rem   |

## Icônes

Un seul jeu : des traits dessinés à la main, en SVG inline, `viewBox="0 0 24 24"`, `fill="none"`, trait de `1.25` à `1.5`px (ex. flèches de `HomeCards`, `Contact`, `FinalCta`, `SocialLinks`). Pas de librairie d'icônes tierce, pas de style mixte (traits fins partout, jamais de remplissage plein ni d'icône "glyphe" à côté).

**Aucun emoji dans l'interface.** Zéro exception.

## Mouvement

Une seule courbe d'easing, trois durées (`src/lib/motion.ts`) :

- `EASE = [0.22, 1, 0.36, 1]` — sortie franche, jamais de rebond.
- Durées : `fast` 0.28s (retour au clic/survol), `base` 0.6s (apparition de carte), `slow` 0.95s (révélation de titre/section).

Animations autorisées :

- apparition douce au scroll (fondu + léger décalage vertical, une seule fois — `revealVariants`) ;
- retour visuel au survol et au clic (couleur, trait qui se dessine, remplissage qui monte) ;
- la parallaxe discrète déjà calibrée du hero (pointeur, défilement) — amplitude mesurée, jamais exagérée.

Interdit : rebond, curseur personnalisé, survol qui change la mise en page, chargement artificiellement ralenti.

`prefers-reduced-motion` est respecté partout (CSS global + hook `usePrefersReducedMotion`) : c'est une contrainte du système à chaque nouvelle animation, pas une case à cocher après coup.

## Ton des textes

Ni tutoiement ni vouvoiement envers le visiteur : les intitulés restent factuels ou à l'infinitif/impératif court (« Écouter », « Envoyer », « Voir »), jamais une adresse directe (« Découvre... », « Abonnez-vous... »). La voix à la première personne n'apparaît que quand RYLIX parle de lui-même (bio, citation sur l'origine du nom) — jamais pour interpeller le visiteur.

Phrases courtes, un fait par phrase. Zéro tiret long utilisé comme ponctuation de style à l'intérieur d'une phrase ou d'un paragraphe. Exception bornée : le tiret long reste autorisé comme séparateur label/valeur dans une ligne de métadonnées structurée (titre de page « Photos — RYLIX », légende de crédit « Photo — Nom », ligne date+lieu) — jamais pour créer une pause dramatique dans une phrase.

**Mots et formules à ne jamais utiliser** : « transformez », « boostez », « libérez votre potentiel », « solution tout-en-un », « révolutionnaire », « passionné·e »(en liste de 3 adjectifs), toute liste de trois adjectifs juxtaposés, tout chiffre ou avis non vérifié.

Le titre principal (hero) doit être compris en 3 secondes par quelqu'un qui ne connaît pas RYLIX : nom + métier, rien de plus à ce niveau de lecture.
