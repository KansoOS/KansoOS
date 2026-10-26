# KansoOS — Contrat d'API v2 (dashboard), basé sur le cahier des charges backend d'Elias

⚠️ Remplace intégralement le contrat v1 (obsolète, modèle parent/enfant). Ce contrat suit le vocabulaire du cahier des charges : espace d'accompagnement, mandat, aidant, personne accompagnée.

Convention : JSON partout. Toutes les routes préfixées `/v1`. Dates en ISO 8601.

⚠️ **Section Auth à jour avec le code réel de `backend-mdm/src/auth`** (implémentée, KSOS-100). Le reste du contrat (espace, mandat, appareils, politique, contacts, journal/demandes) n'est **pas encore implémenté côté backend** — ce sont les routes mockées dans `dashboard-web/src/mocks`, à reconfirmer avec le backend quand il les implémentera.

---

## Auth

Auth par **email/mot de passe**, MFA (TOTP) optionnelle par aidant, activée via `/auth/totp/setup` + `/auth/totp/enable` (hors scope dashboard actuel). `/v1/me` est protégée par un **access token JWT** à envoyer en `Authorization: Bearer <token>` (pas un cookie — c'est à la charge du client de le garder, cf. `dashboard-web/src/api/client.ts`). Un cookie de session distinct, `kanso_session` (HttpOnly/Secure), est posé au login uniquement pour `/auth/logout`.

### `POST /v1/auth/signup`
**Body**
```json
{ "email": "string", "password": "string (8 caractères min.)" }
```
**Réponse 201**
```json
{ "id": "string", "email": "string", "createdAt": "ISO8601 string" }
```
**Erreurs** : 409 si l'email est déjà utilisé.

### `POST /v1/auth/login`
**Body**
```json
{ "email": "string", "password": "string" }
```
**Réponse 200** — deux formes possibles :
- MFA activée sur le compte :
  ```json
  { "mfaRequired": true, "mfaToken": "string (JWT, 5 min)" }
  ```
  → à rejouer sur `POST /v1/auth/login/totp` (ou `/login/recovery`).
- MFA non activée : connexion immédiate.
  ```json
  { "accessToken": "string (JWT, 1h)" }
  ```
  Pose aussi le cookie `kanso_session` (12h, renouvelé à l'activité, 30 min d'inactivité max).

**Erreurs** : 401 si email/mot de passe incorrect.

### `POST /v1/auth/login/totp`
**Body**
```json
{ "mfaToken": "string", "code": "string (6 chiffres)" }
```
**Réponse 200** — même forme que le login réussi ci-dessus (`{ "accessToken": "string" }` + cookie).
**Erreurs** : 401 si code invalide/mfaToken invalide, 429 après trop de tentatives (verrou 15 min).

### `POST /v1/auth/login/recovery`
**Body**
```json
{ "mfaToken": "string", "recoveryCode": "string (xxxx-xxxx-xxxx-xxxx)" }
```
**Réponse 200** — même forme que `/login/totp` (code de récupération à usage unique).

### `POST /v1/auth/logout`
Authentifiée par le cookie `kanso_session` (pas par le bearer token).
**Réponse 204** — détruit la session et efface le cookie.

### `GET /v1/me`
Authentifiée par `Authorization: Bearer <accessToken>`.
**Réponse 200**
```json
{ "id": "string", "email": "string", "createdAt": "ISO8601 string" }
```
**Erreurs** : 401 si bearer token manquant/invalide/expiré.

---

## Espace et mandat

> ⚠️ Pas encore implémenté côté `backend-mdm` — contrat cible, servi par les mocks (`dashboard-web/src/mocks`).

### `GET /v1/spaces/{id}`
**Réponse 200**
```json
{ "id": "string", "nom_affichage": "string" }
```

### `GET /v1/spaces/{id}/mandate`
**Réponse 200**
```json
{
  "id": "string",
  "perimetre": ["contacts.gerer", "niveaux.proposer", "journal.consulter"],
  "date_debut": "ISO8601 string",
  "date_fin": "ISO8601 string",
  "revoque_le": "ISO8601 string | null",
  "revoque_par": "string | null"
}
```

### `POST /v1/spaces/{id}/mandate/revoke`
**Réponse 204**

---

## Appareils

> ⚠️ Pas encore implémenté côté `backend-mdm` — contrat cible, servi par les mocks (`dashboard-web/src/mocks`).

### `POST /v1/spaces/{id}/devices/pairing-code`
**Réponse 201**
```json
{ "code": "string", "expires_at": "ISO8601 string" }
```

### `GET /v1/spaces/{id}/devices`
**Réponse 200**
```json
[
  {
    "id": "string",
    "etat": "string",
    "derniere_synchronisation": "ISO8601 string"
  }
]
```

### `POST /v1/devices/{id}/revoke`
**Réponse 204**

---

## Politique

> ⚠️ Pas encore implémenté côté `backend-mdm` — contrat cible, servi par les mocks (`dashboard-web/src/mocks`).

### `GET /v1/spaces/{id}/policy`
**Réponse 200**
```json
{
  "version": "number",
  "profils": {
    "communication": 1,
    "demarches": 1,
    "medias": 1,
    "achats": 1
  }
}
```

### `PUT /v1/spaces/{id}/policy`
**Body**
```json
{
  "profils": {
    "communication": 1,
    "demarches": 1,
    "medias": 1,
    "achats": 1
  }
}
```
**Réponse 200** — nouvelle version de la politique, même forme que le GET.

---

## Contacts

> ⚠️ Pas encore implémenté côté `backend-mdm` — contrat cible, servi par les mocks (`dashboard-web/src/mocks`).

### `GET /v1/spaces/{id}/contacts`
**Réponse 200**
```json
[
  { "id": "string", "libelle": "string", "niveau_confiance": "connu | en_validation | inconnu" }
]
```

### `POST /v1/spaces/{id}/contacts`
**Body**
```json
{ "libelle": "string", "numero": "string" }
```
**Réponse 201** — même forme qu'un item du GET.

### `PATCH /v1/spaces/{id}/contacts/{cid}`
**Body**
```json
{ "niveau_confiance": "connu | en_validation | inconnu" }
```
**Réponse 200**

### `DELETE /v1/spaces/{id}/contacts/{cid}`
**Réponse 204**

---

## Journal et demandes

> ⚠️ Pas encore implémenté côté `backend-mdm` — contrat cible, servi par les mocks (`dashboard-web/src/mocks`).

### `GET /v1/spaces/{id}/events`
**Query params** : `page`, `type` (optionnel)
**Réponse 200**
```json
{
  "items": [
    { "id": "string", "type": "string", "horodatage": "ISO8601 string" }
  ],
  "page": "number",
  "has_more": "boolean"
}
```

### `GET /v1/spaces/{id}/requests`
**Query params** : `statut` (optionnel : `en_attente | acceptee | refusee`)
**Réponse 200**
```json
[
  {
    "id": "string",
    "type": "passage_niveau | ajout_contact | acces_application",
    "detail": { "...": "dépend du type" },
    "statut": "en_attente | acceptee | refusee",
    "cree_le": "ISO8601 string"
  }
]
```

### `POST /v1/spaces/{id}/requests/{rid}/answer`
**Body**
```json
{ "reponse": "acceptee | refusee", "motif": "string" }
```
**Réponse 200** — demande mise à jour, même forme qu'un item du GET.

---

## Enums partagés (identiques back/dashboard)

- **Périmètre de mandat** : liste ouverte de capacités, ex. `contacts.gerer`, `niveaux.proposer`, `journal.consulter` — jamais un booléen
- **Domaines d'autonomie** : `communication`, `demarches`, `medias`, `achats` — chacun noté 1 à 3
- **Niveau de confiance contact** : `connu`, `en_validation`, `inconnu`
- **Type de demande** : `passage_niveau`, `ajout_contact`, `acces_application`
- **Statut de demande** : `en_attente`, `acceptee`, `refusee`

---

## Ce que le dashboard NE reçoit jamais

Conformément au §1 du cahier des charges : aucun contenu de message/SMS/navigation, aucune donnée de diagnostic, aucune géolocalisation. Toute réponse contenant un de ces champs est une anomalie à signaler au backend, pas un format à consommer tel quel.

---

**Statut :** section Auth confirmée par le code de `backend-mdm` (KSOS-95, KSOS-38, KSOS-41, KSOS-100). Le reste est basé sur la section 5 du cahier des charges d'Elias — à reconfirmer avec lui quand ces routes seront implémentées côté backend.
