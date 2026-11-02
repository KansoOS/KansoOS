# Guide développeur — dashboard-web

## Stack

React 19 + TypeScript + Vite, sans router (une seule page, l'app bascule entre connexion/inscription/dashboard par état React) et sans dépendance runtime hors `react`/`react-dom` — le projet reste volontairement minimal, pas de UI kit ni de state manager. i18n maison (voir `src/i18n/`), mocks réseau via MSW (voir `src/mocks/`), tests unitaires avec Vitest + Testing Library, tests end-to-end avec Playwright.

## Démarrer en local

```bash
cp .env.example .env
npm install
npm run dev
```

`VITE_USE_MOCKS` dans `.env` choisit la source de données : `true` sert tout depuis `src/mocks/handlers.ts` (aucun backend requis), `false` appelle le vrai `backend-mdm` sur `VITE_API_BASE_URL`. Les deux sources doivent rester alignées sur le même contrat, c'est pour ça que les mocks sont écrits pour reproduire exactement le comportement réel du backend, pas une version simplifiée.

Avec Docker : `npm run docker:up` (dev, hot-reload) ou `npm run docker:prod:up` (build figé).

## Structure

- `src/api/` — un fichier par domaine (`auth.ts`, `spaces.ts`, `contacts.ts`...), tous passent par `client.ts` qui gère l'access token (mémoire + `localStorage`, attaché en `Authorization: Bearer` sur chaque requête, purgé automatiquement sur un 401).
- `src/hooks/` — `useAsync` générique, enveloppé par un hook par ressource (`useMe`, `useSpace`, `useMandate`...).
- `src/components/` — un composant par écran ou bloc réutilisable. `icons.tsx` regroupe les icônes SVG inline, volontairement sans dépendance d'icônes.
- `src/i18n/` — dictionnaire typé (`types.ts` définit la forme, `locales/fr.ts` et `locales/en.ts` doivent la respecter exactement, sinon erreur TypeScript). `useT()` pour traduire, `useI18n()` pour aussi avoir la locale active et `setLocale`.
- `src/mocks/` — handlers MSW qui reproduisent le contrat réel du backend (voir plus bas), utilisés à la fois par `VITE_USE_MOCKS=true` en dev et par tous les tests unitaires.

## Tests

```bash
npm run test       # vitest, unitaire, jsdom, contre les mocks MSW
npm run test:e2e   # playwright, vrai navigateur, contre le dashboard servi par les mocks
npm run lint        # oxlint
```

Les tests e2e (`e2e/`) couvrent ce que jsdom ne peut pas vérifier : rendu réel, responsive (pas de débordement horizontal sur petit écran), et accessibilité via un scan automatisé `@axe-core/playwright` (règles WCAG 2.1 AA) sur les écrans de connexion, d'inscription et du dashboard. Un changement de couleur ou de mise en page qui casse le contraste ou le responsive fait échouer la suite — c'est voulu, ça a déjà attrapé plusieurs vrais bugs pendant le développement (contraste insuffisant, débordement horizontal causé par l'absence de `box-sizing: border-box` global combinée à une media query).

Playwright lance son propre serveur de dev sur le port 5175 avec `VITE_USE_MOCKS=true` (voir `playwright.config.ts`) — pas besoin du backend réel pour ces tests.

## Ce qui manque encore côté backend

`backend-mdm` n'implémente pour l'instant que l'authentification (`/auth/*`, `/me`) et les espaces/mandats (`/spaces/*`, `/spaces/:id/mandate`). Les contacts, appareils, politique d'autonomie et journal/demandes tournent à 100 % sur les mocks, sans équivalent réel côté serveur — à vérifier contre le vrai code backend avant de construire dessus, `API-CONTRACT.md` à la racine du repo n'est pas toujours à jour sur ces routes-là.

Il manque aussi une route pour lister les espaces d'un aidant connecté (`/v1/me` ne renvoie que `{id, email, createdAt}`) — c'est pour ça que `App.tsx` demande actuellement l'identifiant de l'espace à la main plutôt que de le proposer dans une liste.

## Conventions

Commits : titre seul, pas de corps ni de co-auteur, style `type(scope): description` (`feat(espace): ...`, `fix: ...`). Un push sur une branche non-main déclenche automatiquement une pull request en draft (voir le repo `.github`, worker `auto-draft-pr`) — pas besoin d'en ouvrir une à la main.
