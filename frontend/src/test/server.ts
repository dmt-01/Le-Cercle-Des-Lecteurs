// ─────────────────────────────────────────────────────────────────────────────
// test/server.ts
// Crée le serveur MSW à partir des handlers définis dans handlers.ts.
// Ce serveur est démarré/arrêté dans setup.ts autour de chaque suite de tests.
// ─────────────────────────────────────────────────────────────────────────────

import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
