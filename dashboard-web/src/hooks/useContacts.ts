import { getContacts } from "../api/contacts";
import { useAsync } from "./useAsync";

export function useContacts(spaceId: string) {
  return useAsync(() => getContacts(spaceId), [spaceId]);
}
