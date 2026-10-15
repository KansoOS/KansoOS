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

## Lancer / tester tout en local

Les `.env` de chaque sous-projet sont gitignorés dans leur repo source, donc jamais synchronisés ici — un `Makefile` à la racine gère ça et orchestre les deux projets sans avoir à connaître leurs commandes internes :

```bash
make setup    # crée les .env manquants (secrets générés pour le backend)
make up       # lance backend + dashboard en Docker, applique les migrations Prisma
make test     # lance les tests des deux
make build    # vérifie que les deux compilent
make down     # arrête tout
make help     # liste toutes les commandes
```

`make up` affiche les URLs une fois lancé : backend sur `http://localhost:3000`, dashboard sur `http://localhost:8081`.

⚠️ **`backend-mdm/` et `dashboard-web/` réutilisent les mêmes noms de conteneurs/ports que vos checkouts de dev habituels** (`kanso-mdm-dev`, `kanso-dashboard-dev` — définis en dur dans leurs `docker-compose.yml`). `make up` ici recrée ces mêmes conteneurs plutôt que d'en lancer une deuxième instance à côté : n'utilise pas la vitrine et ton checkout de dev en même temps, ils se marchent dessus.

`infra/` n'a pas encore de contenu exécutable (juste un README pour l'instant).
