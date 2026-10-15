import type {
  Contact,
  Device,
  EventItem,
  Mandate,
  Me,
  Policy,
  RequestItem,
} from "../api/types";

export const mockMe: Me = {
  id: "user-1",
  identifiant: "aidant.demo",
  espaces: [{ id: "space-1", nom_affichage: "Espace de Léo" }],
};

export const mockMandate: Mandate = {
  id: "mandate-1",
  perimetre: ["contacts.gerer", "niveaux.proposer", "journal.consulter"],
  date_debut: "2026-01-01T00:00:00.000Z",
  date_fin: "2027-01-01T00:00:00.000Z",
  revoque_le: null,
  revoque_par: null,
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
