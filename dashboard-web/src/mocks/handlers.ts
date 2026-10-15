import { http, HttpResponse } from "msw";
import type {
  AutonomyDomain,
  Contact,
  ContactTrustLevel,
  RequestStatus,
} from "../api/types";
import {
  mockContacts,
  mockDevices,
  mockEvents,
  mockMandate,
  mockMe,
  mockPolicy,
  mockRequests,
} from "./data";

let devices = [...mockDevices];
let contacts = [...mockContacts];
let requests = [...mockRequests];
const mandate = { ...mockMandate };
let policy = { ...mockPolicy, profils: { ...mockPolicy.profils } };

let nextId = 100;
const newId = (prefix: string) => `${prefix}-${nextId++}`;

const isAuthenticated = () => document.cookie.includes("session=mock-session");

export const handlers = [
  http.post("*/v1/auth/signup", async ({ request }) => {
    const { identifiant, mot_de_passe, confirmation_mot_de_passe } = (await request.json()) as {
      identifiant: string;
      mot_de_passe: string;
      confirmation_mot_de_passe: string;
    };
    if (identifiant === "existing_user") {
      return new HttpResponse(null, { status: 409 });
    } else if (identifiant === "error_user") {
      return new HttpResponse(null, { status: 500 });
    } else if (mot_de_passe !== confirmation_mot_de_passe) {
      return new HttpResponse(null, { status: 400 });
    }
    return HttpResponse.json({ id: newId("user"), identifiant }, { status: 201 });
  }),

  http.post("*/v1/auth/login", async ({ request }) => {
    const { identifiant, mot_de_passe } = (await request.json()) as { identifiant: string; mot_de_passe: string };
    if (identifiant === "test" && mot_de_passe === "test") {
      return HttpResponse.json({ totp_challenge: "mock-totp-challenge" });
    } else {
      return new HttpResponse(null, { status: 401 });
    }
  }),

  http.post("*/v1/auth/totp", async ({ request }) => {
    const { code } = (await request.json()) as { totp_challenge: string; code: string };
    if (code !== "123456") {
      return new HttpResponse(null, { status: 400 });
    }
    document.cookie = "session=mock-session; path=/";
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("*/v1/auth/logout", () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/v1/me", () => {
    if (!isAuthenticated()) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(mockMe);
  }),

  http.get("*/v1/spaces/:id", ({ params }) => {
    const space = mockMe.espaces.find((s) => s.id === params.id);
    if (!space) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(space);
  }),

  http.get("*/v1/spaces/:id/mandate", () => {
    return HttpResponse.json(mandate);
  }),

  http.post("*/v1/spaces/:id/mandate/revoke", () => {
    mandate.revoque_le = new Date().toISOString();
    mandate.revoque_par = mockMe.id;
    return new HttpResponse(null, { status: 204 });
  }),

  http.post("*/v1/spaces/:id/devices/pairing-code", () => {
    return HttpResponse.json(
      { code: `${Math.floor(100000 + Math.random() * 900000)}`, expires_at: new Date(Date.now() + 10 * 60_000).toISOString() },
      { status: 201 }
    );
  }),

  http.get("*/v1/spaces/:id/devices", () => {
    return HttpResponse.json(devices);
  }),

  http.post("*/v1/devices/:id/revoke", ({ params }) => {
    devices = devices.filter((d) => d.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/v1/spaces/:id/policy", () => {
    return HttpResponse.json(policy);
  }),

  http.put("*/v1/spaces/:id/policy", async ({ request }) => {
    const body = (await request.json()) as { profils: Record<AutonomyDomain, number> };
    policy = { version: policy.version + 1, profils: body.profils };
    return HttpResponse.json(policy);
  }),

  http.get("*/v1/spaces/:id/contacts", () => {
    return HttpResponse.json(contacts);
  }),

  http.post("*/v1/spaces/:id/contacts", async ({ request }) => {
    const { libelle } = (await request.json()) as { libelle: string; numero: string };
    const contact: Contact = { id: newId("contact"), libelle, niveau_confiance: "en_validation" };
    contacts.push(contact);
    return HttpResponse.json(contact, { status: 201 });
  }),

  http.patch("*/v1/spaces/:id/contacts/:cid", async ({ params, request }) => {
    const { niveau_confiance } = (await request.json()) as { niveau_confiance: ContactTrustLevel };
    const contact = contacts.find((c) => c.id === params.cid);
    if (!contact) return new HttpResponse(null, { status: 404 });
    contact.niveau_confiance = niveau_confiance;
    return HttpResponse.json(contact);
  }),

  http.delete("*/v1/spaces/:id/contacts/:cid", ({ params }) => {
    contacts = contacts.filter((c) => c.id !== params.cid);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/v1/spaces/:id/events", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    return HttpResponse.json({ items: mockEvents, page, has_more: false });
  }),

  http.get("*/v1/spaces/:id/requests", ({ request }) => {
    const url = new URL(request.url);
    const statut = url.searchParams.get("statut") as RequestStatus | null;
    const items = statut ? requests.filter((r) => r.statut === statut) : requests;
    return HttpResponse.json(items);
  }),

  http.post("*/v1/spaces/:id/requests/:rid/answer", async ({ params, request }) => {
    const { reponse } = (await request.json()) as { reponse: "acceptee" | "refusee"; motif: string };
    const found = requests.find((r) => r.id === params.rid);
    if (!found) return new HttpResponse(null, { status: 404 });
    found.statut = reponse;
    return HttpResponse.json(found);
  }),
];
