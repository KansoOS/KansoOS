import { apiRequest } from "./client";
import type { EventPage, RequestItem, RequestStatus } from "./types";

export function getEvents(spaceId: string, page: number, type?: string): Promise<EventPage> {
  const params = new URLSearchParams({ page: String(page) });
  if (type) params.set("type", type);
  return apiRequest<EventPage>(`/v1/spaces/${spaceId}/events?${params}`);
}

export function getRequests(spaceId: string, statut?: RequestStatus): Promise<RequestItem[]> {
  const params = new URLSearchParams();
  if (statut) params.set("statut", statut);
  const qs = params.toString();
  return apiRequest<RequestItem[]>(`/v1/spaces/${spaceId}/requests${qs ? `?${qs}` : ""}`);
}

export function answerRequest(
  spaceId: string,
  requestId: string,
  reponse: "acceptee" | "refusee",
  motif: string
): Promise<RequestItem> {
  return apiRequest<RequestItem>(`/v1/spaces/${spaceId}/requests/${requestId}/answer`, {
    method: "POST",
    body: { reponse, motif },
  });
}
