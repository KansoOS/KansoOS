import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.clear();
});

afterAll(() => server.close());
