import { getDevices } from "../api/devices";
import { useAsync } from "./useAsync";

export function useDevices(spaceId: string) {
  return useAsync(() => getDevices(spaceId), [spaceId]);
}
