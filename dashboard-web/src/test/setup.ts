import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { clearAccessToken } from "../api/client";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  // L'access token est gardé en mémoire (pas seulement en localStorage, cf.
  // src/api/client.ts) : sans ça, un login réussi dans un test fuiterait
  // vers le test suivant dans le même fichier.
  clearAccessToken();
});

afterAll(() => server.close());
