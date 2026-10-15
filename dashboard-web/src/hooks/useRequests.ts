import { getRequests } from "../api/events";
import type { RequestStatus } from "../api/types";
import { useAsync } from "./useAsync";

export function useRequests(spaceId: string, statut?: RequestStatus) {
  return useAsync(() => getRequests(spaceId, statut), [spaceId, statut]);
}
