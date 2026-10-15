import { getMe } from "../api/auth";
import { useAsync } from "./useAsync";

export function useMe() {
  return useAsync(getMe, []);
}
