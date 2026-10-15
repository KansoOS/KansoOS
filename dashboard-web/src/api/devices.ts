import { apiRequest } from "./client";
import type { Device, PairingCode } from "./types";

export function getDevices(spaceId: string): Promise<Device[]> {
  return apiRequest<Device[]>(`/v1/spaces/${spaceId}/devices`);
}

export function createPairingCode(spaceId: string): Promise<PairingCode> {
  return apiRequest<PairingCode>(`/v1/spaces/${spaceId}/devices/pairing-code`, {
    method: "POST",
  });
}

export function revokeDevice(id: string): Promise<void> {
  return apiRequest<void>(`/v1/devices/${id}/revoke`, { method: "POST" });
}
