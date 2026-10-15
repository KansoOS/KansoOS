# KansoOS

Monorepo vitrine de l'organisation **KansoOS** : une copie à jour du code nécessaire au fonctionnement du logiciel, centralisée en un seul endroit pour présenter et parcourir le projet rapidement.

## Contenu

| Dossier | Repo source | Description |
|---|---|---|
| [`backend-mdm/`](./backend-mdm) | [KansoOS/kanso-mdm-backend](https://github.com/KansoOS/kanso-mdm-backend) | API (NestJS + Prisma) |
| [`dashboard-web/`](./dashboard-web) | [KansoOS/kanso-web-dashboard](https://github.com/KansoOS/kanso-web-dashboard) | Dashboard (React + Vite) |
| [`infra/`](./infra) | [KansoOS/kanso-infra](https://github.com/KansoOS/kanso-infra) | Configuration infra |

Automation de l'organisation (dont le worker qui alimente cette synchro) : [KansoOS/.github](https://github.com/KansoOS/.github) — pas mirorée ici, c'est de la méta-configuration plutôt que du code produit.

## Comment ça reste à jour

Chaque dossier ci-dessus est une **copie en lecture seule** du dernier `master`/`main` de son repo source, synchronisée automatiquement à chaque push dessus (voir `.github/workflows/sync.yml`, déclenché par le worker `auto-draft-pr` de l'organisation). Pas d'historique de commits conservé par fichier — un seul commit `sync: <repo>@<sha>` par mise à jour.

**On ne modifie jamais le code directement ici** : toute modification doit passer par le repo source correspondant, elle sera reprise automatiquement au prochain push sur sa branche par défaut.
