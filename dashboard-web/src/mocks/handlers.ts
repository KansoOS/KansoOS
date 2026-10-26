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
  mockSpaces,
} from "./data";

let devices = [...mockDevices];
let contacts = [...mockContacts];
let requests = [...mockRequests];
const mandate = { ...mockMandate };
let policy = { ...mockPolicy, profils: { ...mockPolicy.profils } };

let nextId = 100;
const newId = (prefix: string) => `${prefix}-${nextId++}`;

// Miroir du comportement réel de backend-mdm/src/auth : connexion par
// email/mot de passe, MFA optionnelle (mfaToken -> code TOTP), access token
// en Authorization: Bearer (pas un cookie — voir src/api/client.ts).
const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_MFA_TOKEN = "mock-mfa-token";
const MOCK_TOTP_CODE = "123456";

const accounts: Record<string, { password: string; mfaEnabled: boolean }> = {
  "test@kanso.test": { password: "test1234", mfaEnabled: true },
  "nomfa@kanso.test": { password: "nomfa1234", mfaEnabled: false },
};

const bearerToken = (request: Request): string | null => {
  const [scheme, token] = (request.headers.get("authorization") ?? "").split(" ");
  return scheme === "Bearer" ? token : null;
};

export const handlers = [
  http.post("*/v1/auth/signup", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (email === "existing@kanso.test") {
      return new HttpResponse(null, { status: 409 });
    } else if (email === "error@kanso.test") {
      return new HttpResponse(null, { status: 500 });
    }
    accounts[email] = { password, mfaEnabled: false };
    return HttpResponse.json(
      { id: newId("helper"), email, createdAt: new Date().toISOString() },
      { status: 201 }
    );
  }),

  http.post("*/v1/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    const account = accounts[email];
    if (!account || account.password !== password) {
      return new HttpResponse(null, { status: 401 });
    }
    if (account.mfaEnabled) {
      return HttpResponse.json({ mfaRequired: true, mfaToken: MOCK_MFA_TOKEN });
    }
    return HttpResponse.json({ accessToken: MOCK_ACCESS_TOKEN });
  }),

  http.post("*/v1/auth/login/totp", async ({ request }) => {
    const { mfaToken, code } = (await request.json()) as { mfaToken: string; code: string };
    if (mfaToken !== MOCK_MFA_TOKEN) {
      return new HttpResponse(null, { status: 401 });
    }
    if (code !== MOCK_TOTP_CODE) {
      return new HttpResponse(null, { status: 400 });
    }
    return HttpResponse.json({ accessToken: MOCK_ACCESS_TOKEN });
  }),

  http.post("*/v1/auth/logout", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/v1/me", ({ request }) => {
    if (bearerToken(request) !== MOCK_ACCESS_TOKEN) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(mockMe);
  }),

  http.get("*/v1/spaces/:id", ({ params }) => {
    const space = mockSpaces.find((s) => s.id === params.id);
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
