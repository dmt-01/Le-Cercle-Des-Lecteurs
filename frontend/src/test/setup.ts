// ─────────────────────────────────────────────────────────────────────────────
// test/setup.ts
// Fichier de configuration global exécuté avant chaque fichier de test.
// • Démarre le serveur MSW avant la suite (beforeAll)
// • Remet les handlers à leur état initial entre chaque test (afterEach)
// • Arrête le serveur après la suite (afterAll)
// • Nettoie le DOM React entre chaque test (cleanup)
// ─────────────────────────────────────────────────────────────────────────────

import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
