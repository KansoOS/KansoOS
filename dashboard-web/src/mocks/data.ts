import type {
  Contact,
  Device,
  EventItem,
  Mandate,
  Me,
  Policy,
  RequestItem,
  SpaceSummary,
} from "../api/types";

export const mockMe: Me = {
  id: "helper-1",
  email: "aidant.demo@kanso.test",
  createdAt: "2026-01-01T00:00:00.000Z",
};

// Ce n'est pas encore porté par /v1/me côté backend-mdm, seule l'identité de
// l'aidant y est exposée pour l'instant et aucune route ne liste les espaces
// d'un aidant, donc c'est gardé à part pour les routes espaces et mandat.
export const mockSpaces: SpaceSummary[] = [
  { id: "space-1", pseudonym: "Espace de Léo", createdAt: "2026-01-01T00:00:00.000Z" },
  // Espace sans mandat en vigueur, pour tester cet état dans le dashboard.
  { id: "space-2", pseudonym: "Espace sans mandat", createdAt: "2026-02-01T00:00:00.000Z" },
];

export const mockMandate: Mandate = {
  id: "mandate-1",
  spaceId: "space-1",
  helperId: "helper-1",
  scope: ["contacts.gerer", "niveaux.proposer", "journal.consulter"],
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2027-01-01T00:00:00.000Z",
  revokedAt: null,
  revokedById: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const mockDevices: Device[] = [
  {
    id: "device-1",
    etat: "actif",
    derniere_synchronisation: "2026-09-06T08:12:00.000Z",
  },
  {
    id: "device-2",
    etat: "inactif",
    derniere_synchronisation: "2026-09-05T20:45:00.000Z",
  },
];

export const mockPolicy: Policy = {
  version: 1,
  profils: {
    communication: 2,
    demarches: 1,
    medias: 2,
    achats: 1,
  },
};

export const mockContacts: Contact[] = [
  { id: "contact-1", libelle: "Maman", niveau_confiance: "connu" },
  { id: "contact-2", libelle: "Numéro inconnu", niveau_confiance: "en_validation" },
];

export const mockEvents: EventItem[] = [
  { id: "event-1", type: "connexion", horodatage: "2026-09-06T08:12:00.000Z" },
  { id: "event-2", type: "demande_niveau", horodatage: "2026-09-05T18:30:00.000Z" },
];

export const mockRequests: RequestItem[] = [
  {
    id: "request-1",
    type: "passage_niveau",
    detail: { domaine: "medias", niveau_demande: 3 },
    statut: "en_attente",
    cree_le: "2026-09-06T09:00:00.000Z",
  },
];
