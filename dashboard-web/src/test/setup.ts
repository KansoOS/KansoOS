import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { clearAccessToken } from "../api/client";
import { server } from "./server";

// jsdom n'implémente ni matchMedia (détection de prefers-reduced-motion) ni
// scrollIntoView, utilisés pour amener le focus sur le formulaire de connexion
// une fois affiché.
beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  Element.prototype.scrollIntoView ??= () => {};
});

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
