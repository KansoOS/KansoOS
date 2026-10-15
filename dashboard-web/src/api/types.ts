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
  nom_affichage: string;
}

export interface Me {
  id: string;
  identifiant: string;
  espaces: SpaceSummary[];
}

export interface SignupResult {
  id: string;
  identifiant: string;
}

export interface LoginChallenge {
  totp_challenge: string;
}

export interface Mandate {
  id: string;
  perimetre: MandatePermission[];
  date_debut: string;
  date_fin: string;
  revoque_le: string | null;
  revoque_par: string | null;
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
