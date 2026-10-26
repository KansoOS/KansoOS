import { apiRequest, clearAccessToken, setAccessToken } from "./client";
import type { LoginResult, Me, SignupResult } from "./types";

export function signup(email: string, password: string): Promise<SignupResult> {
  return apiRequest<SignupResult>("/v1/auth/signup", {
    method: "POST",
    body: { email, password },
  });
}

async function applyLoginResult(result: LoginResult): Promise<LoginResult> {
  if (!("mfaRequired" in result)) {
    setAccessToken(result.accessToken);
  }
  return result;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const result = await apiRequest<LoginResult>("/v1/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return applyLoginResult(result);
}

export async function verifyTotp(mfaToken: string, code: string): Promise<LoginResult> {
  const result = await apiRequest<LoginResult>("/v1/auth/login/totp", {
    method: "POST",
    body: { mfaToken, code },
  });
  return applyLoginResult(result);
}

export function logout(): Promise<void> {
  return apiRequest<void>("/v1/auth/logout", { method: "POST" }).finally(() => {
    clearAccessToken();
  });
}

export function getMe(): Promise<Me> {
  return apiRequest<Me>("/v1/me");
}
