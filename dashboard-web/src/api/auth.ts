import { apiRequest } from "./client";
import type { LoginChallenge, Me, SignupResult } from "./types";

export function signup(
  identifiant: string,
  mot_de_passe: string,
  confirmation_mot_de_passe: string
): Promise<SignupResult> {
  return apiRequest<SignupResult>("/v1/auth/signup", {
    method: "POST",
    body: { identifiant, mot_de_passe, confirmation_mot_de_passe },
  });
}

export function login(identifiant: string, mot_de_passe: string): Promise<LoginChallenge> {
  return apiRequest<LoginChallenge>("/v1/auth/login", {
    method: "POST",
    body: { identifiant, mot_de_passe },
  });
}

export function verifyTotp(totp_challenge: string, code: string): Promise<void> {
  return apiRequest<void>("/v1/auth/totp", {
    method: "POST",
    body: { totp_challenge, code },
  });
}

export function logout(): Promise<void> {
  return apiRequest<void>("/v1/auth/logout", { method: "POST" });
}

export function getMe(): Promise<Me> {
  return apiRequest<Me>("/v1/me");
}
