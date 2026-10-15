import { apiRequest } from "./client";
import type { Mandate, SpaceSummary } from "./types";

export function getSpace(id: string): Promise<SpaceSummary> {
  return apiRequest<SpaceSummary>(`/v1/spaces/${id}`);
}

export function getMandate(spaceId: string): Promise<Mandate> {
  return apiRequest<Mandate>(`/v1/spaces/${spaceId}/mandate`);
}

export function revokeMandate(spaceId: string): Promise<void> {
  return apiRequest<void>(`/v1/spaces/${spaceId}/mandate/revoke`, { method: "POST" });
}
