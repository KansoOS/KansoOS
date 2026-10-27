// Types générés à partir du contrat d'API v2 (basé sur le cahier des charges backend d'Elias).
// Voir API-CONTRACT.md à la racine du repo.

export type AutonomyDomain = "communication" | "demarches" | "medias" | "achats";
export type ContactTrustLevel = "connu" | "en_validation" | "inconnu";
export type RequestType = "passage_niveau" | "ajout_contact" | "acces_application";
export type RequestStatus = "en_attente" | "acceptee" | "refusee";

/** Périmètre de mandat : liste ouverte de capacités, ex. "contacts.gerer" — jamais un booléen. */
export type MandatePermission = string;

export interface SpaceSummary {
  id: string;
  pseudonym: string;
  createdAt: string;
}

// Le backend-mdm (voir ../../backend-mdm/src/auth) ne gère pour l'instant que
// l'identité de l'aidant : pas encore d'espaces/mandat sur /me.
export interface Me {
  id: string;
  email: string;
  createdAt: string;
}

export interface SignupResult {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * Réponse de /v1/auth/login et /v1/auth/login/totp : soit le MFA est requis
 * (compte avec TOTP activé) et il faut rejouer le code sur /login/totp, soit
 * la connexion est immédiate et un access token (JWT, à poser en
 * Authorization: Bearer) est renvoyé.
 */
export type LoginResult = { mfaRequired: true; mfaToken: string } | { accessToken: string };

// GET /v1/spaces/:spaceId/mandate ne renvoie que le mandat en vigueur,
// c'est-à-dire celui dont revokedAt est null et dont la période startDate à
// endDate couvre maintenant, donc il n'y a pas d'historique des mandats
// révoqués ou expirés pour l'instant côté backend.
export interface Mandate {
  id: string;
  spaceId: string;
  helperId: string;
  scope: MandatePermission[];
  startDate: string;
  endDate: string;
  revokedAt: string | null;
  revokedById: string | null;
  createdAt: string;
}

export interface Device {
  id: string;
  etat: string;
  derniere_synchronisation: string;
}

export interface PairingCode {
  code: string;
  expires_at: string;
}

export interface Policy {
  version: number;
  profils: Record<AutonomyDomain, number>;
}

export interface Contact {
  id: string;
  libelle: string;
  niveau_confiance: ContactTrustLevel;
}

export interface EventItem {
  id: string;
  type: string;
  horodatage: string;
}

export interface EventPage {
  items: EventItem[];
  page: number;
  has_more: boolean;
}

export interface RequestItem {
  id: string;
  type: RequestType;
  detail: Record<string, unknown>;
  statut: RequestStatus;
  cree_le: string;
}
