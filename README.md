# KansoOS

Monorepo vitrine de l'organisation **KansoOS** : une copie à jour du code nécessaire au fonctionnement du logiciel, centralisée en un seul endroit pour présenter et parcourir le projet rapidement.

## Contenu

| Dossier | Repo source | Description |
|---|---|---|
| [`backend-mdm/`](./backend-mdm) | [KansoOS/kanso-mdm-backend](https://github.com/KansoOS/kanso-mdm-backend) | API (NestJS + Prisma) — synchronisé **avec son `dist/` déjà construit** (voir `sync.yml`), en plus des sources : pas besoin de compiler pour l'exécuter ailleurs que via `make up` |
| [`dashboard-web/`](./dashboard-web) | [KansoOS/kanso-web-dashboard](https://github.com/KansoOS/kanso-web-dashboard) | Dashboard (React + Vite) |
| [`infra/`](./infra) | [KansoOS/kanso-infra](https://github.com/KansoOS/kanso-infra) | Configuration infra |

Automation de l'organisation (dont le worker qui alimente cette synchro) : [KansoOS/.github](https://github.com/KansoOS/.github) — pas mirorée ici, c'est de la méta-configuration plutôt que du code produit.

## Comment ça reste à jour

Chaque dossier ci-dessus est une **copie en lecture seule** du dernier `master`/`main` de son repo source, synchronisée automatiquement à chaque push dessus (voir `.github/workflows/sync.yml`, déclenché par le worker `auto-draft-pr` de l'organisation). Pas d'historique de commits conservé par fichier — un seul commit `sync: <repo>@<sha>` par mise à jour.

**On ne modifie jamais le code directement ici** : toute modification doit passer par le repo source correspondant, elle sera reprise automatiquement au prochain push sur sa branche par défaut.

## Lancer / tester tout en local

Les `.env` de chaque sous-projet sont gitignorés dans leur repo source, donc jamais synchronisés ici — un `Makefile` à la racine gère ça et orchestre les deux projets sans avoir à connaître leurs commandes internes :

```bash
make setup          # crée les .env manquants (secrets + ports dédiés à la vitrine)
make up             # lance backend + dashboard en Docker, applique les migrations Prisma
make test           # lance les tests des deux
make build          # vérifie que les deux compilent
make down           # arrête tout
make logs-backend   # logs du backend en continu
make logs-dashboard # logs du dashboard en continu
make help           # liste toutes les commandes
```

`make up` affiche les URLs une fois lancé : backend sur `http://localhost:3100`, dashboard sur `http://localhost:8181`.

**Tourne à côté d'un checkout de dev habituel sans collision**, sur des ports et des noms de conteneurs dédiés à la vitrine :

| | Dev habituel | Vitrine (ici) |
|---|---|---|
| Backend | `http://localhost:3000` | `http://localhost:3100` |
| Postgres | `localhost:5432` | `localhost:5433` |
| Dashboard | `http://localhost:8081` | `http://localhost:8181` |
| Conteneurs | `kanso-mdm-*-dev`, `kanso-dashboard-*-dev` | `kanso-vitrine-mdm-*`, `kanso-vitrine-dashboard-*` |

Ça marche parce que `backend-mdm/docker-compose.yml` et `dashboard-web/docker-compose.yml` dérivent noms de conteneurs/volume/réseau du nom de projet Compose (`COMPOSE_PROJECT_NAME`, posé par le `Makefile`) plutôt que de les figer en dur — les ports viennent du `.env` généré par `make setup` (`APP_PORT`, `POSTGRES_PORT`, `WEB_PORT`, `CORS_ORIGIN`, `VITE_API_BASE_URL`). En prod, chaque repo garde ses ports "classiques" habituels (`docker-compose.prod.yml`, jamais touché par tout ça) — cette isolation ne concerne que l'usage local de la vitrine.

`infra/` n'a pas encore de contenu exécutable (juste un README pour l'instant).
