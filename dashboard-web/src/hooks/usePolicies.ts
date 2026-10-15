import { getPolicy } from "../api/policies";
import { useAsync } from "./useAsync";

export function usePolicy(spaceId: string) {
  return useAsync(() => getPolicy(spaceId), [spaceId]);
}
