# Déploiement — Infomaniak

Le site est une application statique (build Vite). Le workflow
`.github/workflows/deploy-infomaniak.yml` construit le site et envoie
`dist/` par SSH (rsync) vers l'hébergement web Infomaniak à chaque push sur
`claude/rylix-design-tokens-yz5jhf`.

## À faire une fois, dans le Manager Infomaniak

1. **Générer une paire de clés SSH dédiée au déploiement** (ne pas réutiliser une clé personnelle) :
   ```
   ssh-keygen -t ed25519 -C "deploy-rylix" -f deploy_rylix -N ""
   ```
2. Dans le Manager Infomaniak → ton hébergement web → **FTP-SSH** → section clés SSH : ajouter le contenu de `deploy_rylix.pub`.
3. Toujours dans **FTP-SSH** : noter l'hôte SSH, le port et le nom d'utilisateur de l'hébergement.
4. Vérifier le **dossier racine** du site (souvent `/sites/rylix.ch/` ou similaire selon la structure de ton hébergement — visible dans le gestionnaire de fichiers Infomaniak).
5. S'assurer que le nom de domaine `rylix.ch` est bien **attaché à cet hébergement** (Manager → Domaine → associer à l'hébergement web). Comme le domaine et l'hébergement sont chez le même fournisseur, cette association se fait en général sans toucher aux enregistrements DNS à la main.

## À faire une fois, dans GitHub

Dépôt → **Settings → Secrets and variables → Actions** → New repository secret, pour chacun :

| Secret                  | Valeur                                                   |
| ----------------------- | -------------------------------------------------------- |
| `INFOMANIAK_SSH_KEY`    | Contenu de `deploy_rylix` (la clé **privée**, en entier) |
| `INFOMANIAK_SSH_HOST`   | Hôte SSH donné par Infomaniak                            |
| `INFOMANIAK_SSH_USER`   | Utilisateur SSH donné par Infomaniak                     |
| `INFOMANIAK_SSH_PORT`   | Port SSH (souvent `22`)                                  |
| `INFOMANIAK_REMOTE_DIR` | Dossier racine du site, ex. `/sites/rylix.ch/`           |

Une fois les 5 secrets ajoutés, pousser sur `claude/rylix-design-tokens-yz5jhf` déclenche le déploiement automatiquement. Le workflow peut aussi être relancé manuellement depuis l'onglet **Actions** du dépôt (bouton _Run workflow_).

## Vercel

Le projet Vercel connecté à ce dépôt continue de déployer en parallèle tant
qu'il n'est pas déconnecté (utile pour les aperçus de pull request). Une fois
le déploiement Infomaniak validé en production, déconnecter l'intégration
Vercel (Vercel → Project Settings → Git) évite un double déploiement sur le
même domaine.
