import { apiRequest } from "./client";
import type { AutonomyDomain, Policy } from "./types";

export function getPolicy(spaceId: string): Promise<Policy> {
  return apiRequest<Policy>(`/v1/spaces/${spaceId}/policy`);
}

export function updatePolicy(
  spaceId: string,
  profils: Record<AutonomyDomain, number>
): Promise<Policy> {
  return apiRequest<Policy>(`/v1/spaces/${spaceId}/policy`, {
    method: "PUT",
    body: { profils },
  });
}
