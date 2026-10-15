import { apiRequest } from "./client";
import type { Contact, ContactTrustLevel } from "./types";

export function getContacts(spaceId: string): Promise<Contact[]> {
  return apiRequest<Contact[]>(`/v1/spaces/${spaceId}/contacts`);
}

export function addContact(spaceId: string, libelle: string, numero: string): Promise<Contact> {
  return apiRequest<Contact>(`/v1/spaces/${spaceId}/contacts`, {
    method: "POST",
    body: { libelle, numero },
  });
}

export function updateContactTrust(
  spaceId: string,
  contactId: string,
  niveau_confiance: ContactTrustLevel
): Promise<Contact> {
  return apiRequest<Contact>(`/v1/spaces/${spaceId}/contacts/${contactId}`, {
    method: "PATCH",
    body: { niveau_confiance },
  });
}

export function deleteContact(spaceId: string, contactId: string): Promise<void> {
  return apiRequest<void>(`/v1/spaces/${spaceId}/contacts/${contactId}`, { method: "DELETE" });
}
