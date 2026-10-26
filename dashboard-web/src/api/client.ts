const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

// Le backend renvoie l'access token (JWT) dans le corps de la réponse de
// login, pas dans un cookie (seul le cookie de session, HttpOnly, l'est —
// il sert uniquement à /auth/logout). C'est donc à nous de le garder et de
// le renvoyer en Authorization: Bearer sur chaque requête. Persisté en
// localStorage pour survivre à un rafraîchissement de page.
const ACCESS_TOKEN_STORAGE_KEY = "kanso.accessToken";

function readStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // localStorage indisponible (navigation privée, SSR...) : pas de session persistée.
    return null;
  }
}

let accessToken: string | null = readStoredAccessToken();

export function setAccessToken(token: string): void {
  accessToken = token;
  try {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // Pas grave : le token reste actif en mémoire pour la session en cours.
  }
}

export function clearAccessToken(): void {
  accessToken = null;
  try {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    // Token expiré/invalide : pas la peine de le garder pour la prochaine requête.
    if (res.status === 401) clearAccessToken();
    throw new ApiError(res.status, data);
  }

  return data as T;
}
