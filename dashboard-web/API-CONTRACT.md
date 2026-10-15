# KansoOS — Contrat d'API v2 (dashboard), basé sur le cahier des charges backend d'Elias

⚠️ Remplace intégralement le contrat v1 (obsolète, modèle parent/enfant). Ce contrat suit le vocabulaire du cahier des charges : espace d'accompagnement, mandat, aidant, personne accompagnée.

Convention : JSON partout. Auth via cookie de session (HttpOnly/Secure) après connexion, sauf `/auth/*`. Toutes les routes préfixées `/v1`. Dates en ISO 8601.

---

## Auth

### `POST /v1/auth/signup`
**Body**
```json
{ "identifiant": "string", "mot_de_passe": "string", "confirmation_mot_de_passe": "string" }
```
**Réponse 201**
```json
{ "id": "string", "identifiant": "string" }
```
**Erreurs** : 409 si identifiant déjà utilisé, 400 si confirmation ne correspond pas.

### `POST /v1/auth/login`
**Body**
```json
{ "identifiant": "string", "mot_de_passe": "string" }
```
**Réponse 200**
```json
{ "totp_challenge": "string" }
```

### `POST /v1/auth/totp`
**Body**
```json
{ "totp_challenge": "string", "code": "string" }
```
**Réponse 200** — crée le cookie de session, pas de body métier.

### `POST /v1/auth/logout`
**Réponse 204**

### `GET /v1/me`
**Réponse 200**
```json
{
  "id": "string",
  "identifiant": "string",
  "espaces": [
    { "id": "string", "nom_affichage": "string" }
  ]
}
```

---

## Espace et mandat

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

**Statut :** basé sur la section 5 du cahier des charges d'Elias + le ticket signup (KSOS-95). À reconfirmer avec lui si des noms de champs diffèrent une fois le code écrit.
