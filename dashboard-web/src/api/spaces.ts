import { apiRequest } from "./client";
import type { Mandate, SpaceSummary } from "./types";

export function getSpace(id: string): Promise<SpaceSummary> {
  return apiRequest<SpaceSummary>(`/v1/spaces/${id}`);
}

// Renvoie le mandat en vigueur de l'aidant connecté sur cet espace, avec une
// 404 s'il n'y en a aucun actuellement. Il n'y a pas encore de route de
// révocation côté backend, donc il n'y a rien d'autre à exposer ici pour l'instant.
export function getMandate(spaceId: string): Promise<Mandate> {
  return apiRequest<Mandate>(`/v1/spaces/${spaceId}/mandate`);
}
