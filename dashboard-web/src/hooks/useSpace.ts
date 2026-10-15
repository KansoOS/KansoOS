import { getMandate, getSpace } from "../api/spaces";
import { useAsync } from "./useAsync";

export function useSpace(spaceId: string) {
  return useAsync(() => getSpace(spaceId), [spaceId]);
}

export function useMandate(spaceId: string) {
  return useAsync(() => getMandate(spaceId), [spaceId]);
}
