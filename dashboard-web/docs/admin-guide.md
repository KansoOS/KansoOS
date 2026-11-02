# Guide admin — infrastructure et organisation KansoOS

Il n'existe pas de rôle "admin" ni de console d'administration dans le produit lui-même — seuls des comptes aidant existent. Ce guide couvre l'administration de l'infrastructure et de l'organisation GitHub, pas une fonctionnalité du dashboard.

## Backend (`backend-mdm`)

Variables d'environnement requises (`.env`, voir `.env.example`) :

- `JWT_SECRET` — au moins 32 caractères, génère avec `openssl rand -base64 48`. Sans lui l'app refuse de démarrer.
- `TOTP_ENCRYPTION_KEY` — exactement 32 octets en base64 (`openssl rand -base64 32`), chiffre les secrets TOTP et hache les codes de secours. La perdre ou la changer bloque la connexion de tous les comptes ayant activé le TOTP — pas de rotation de clé pour l'instant.
- `CORS_ORIGIN` — liste des origines autorisées (séparées par une virgule) pour le dashboard. En dev local : `http://localhost:5173,http://localhost:8081`.
- `DATABASE_URL`, `POSTGRES_*` — connexion Postgres.

Migrations Prisma : `npx prisma migrate deploy` (dans le conteneur : `docker compose exec app npx prisma migrate deploy`). À relancer après chaque nouvelle migration ajoutée au repo — un volume Postgres existant ne se met pas à jour tout seul.

Deux fichiers compose : `docker-compose.yml` (dev, hot-reload) et `docker-compose.prod.yml` (build figé). Ni l'un ni l'autre ne fige plus les noms de conteneurs/volume/réseau — ils sont dérivés de `COMPOSE_PROJECT_NAME`, pour pouvoir faire tourner plusieurs instances isolées côte à côte (voir la vitrine ci-dessous).

## Dashboard (`dashboard-web`)

Mêmes principes côté `docker-compose.yml`. `VITE_USE_MOCKS=false` par défaut : le dashboard attend le vrai backend. Le mettre à `true` fait tourner le dashboard sans backend du tout, utile pour une démo rapide.

## Automatisation de l'organisation GitHub

Un Cloudflare Worker (`auto-draft-pr`, code dans le repo `.github`, dossier `automation/draft-pr-worker/`) écoute les webhooks `push` et `pull_request` au niveau de toute l'organisation. Il ouvre une pull request en draft dès qu'une branche reçoit des commits, met à jour la vitrine (voir plus bas) quand c'est un push sur la branche par défaut d'un repo suivi, et déclenche la synchro.

Il s'authentifie via une **GitHub App** (`kanso-automation`), pas un token personnel — avec un token personnel, GitHub attribue chaque pull request (et, en cas de squash merge, le commit final) au propriétaire du token plutôt qu'à qui a vraiment poussé le code.

Secrets Cloudflare à poser (`npx wrangler secret put NOM`, depuis `automation/draft-pr-worker/`) :

- `WEBHOOK_SECRET` — vérifie que le webhook vient bien de GitHub.
- `GH_APP_ID`, `GH_APP_PRIVATE_KEY` (au format PKCS#8, convertir avec `openssl pkcs8 -topk8 -nocrypt -in original.pem -out pkcs8.pem`), `GH_APP_INSTALLATION_ID` — authentification de la GitHub App.

Redéployer après une modif : `npx wrangler deploy`. Logs en direct : `npx wrangler tail`.

Réglages appliqués sur tous les repos de l'organisation : squash merge désactivé (garde l'auteur réel du commit sur la branche par défaut), suppression automatique de branche au merge activée.

## Monorepo vitrine (`KansoOS`)

Copie en lecture seule, à jour, de `backend-mdm`, `dashboard-web` et `infra`, synchronisée automatiquement à chaque push sur leur branche par défaut (`.github/workflows/sync.yml`, déclenché par le worker ci-dessus via un secret `SYNC_TOKEN`, un PAT classique séparé de la GitHub App). Un seul commit `sync: <repo>@<sha>` par mise à jour, pas d'historique conservé par fichier.

Un `Makefile` à la racine orchestre les deux projets en local sans avoir à connaître leurs commandes internes :

```bash
make setup   # crée les .env manquants (secrets + ports dédiés : 3100/5433/8181)
make up      # lance backend + dashboard en Docker, applique les migrations
make test    # lance les tests des deux
make down    # arrête tout
```

Tourne à côté d'un checkout de dev habituel sans collision, grâce à `COMPOSE_PROJECT_NAME` et des ports dédiés — voir le `README.md` de ce repo pour le détail.
