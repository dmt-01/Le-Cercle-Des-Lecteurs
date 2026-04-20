import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import type { CorsOptions } from "cors";
import router from "./src/routes";

/**
 * Point d'entrée du serveur Express.
 * Configure les middlewares globaux de sécurité et démarre l'écoute sur le port 3000.
 */

const app = express();
const PORT = 3000;

const env = process.env.NODE_ENV;
console.log(`Environnement : ${env}`);

/**
 * Configuration CORS — définit quelles origines peuvent appeler l'API.
 * L'origine autorisée est lue depuis la variable d'environnement CORS_ALLOWED.
 * credentials: true est nécessaire pour que les cookies soient transmis cross-origin.
 */
const CORS_OPTIONS: CorsOptions = {
  origin: [process.env.CORS_ALLOWED ?? ""],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// helmet() ajoute des en-têtes HTTP de sécurité (XSS, clickjacking, etc.)
app.use(helmet());

// Applique les règles CORS à toutes les requêtes
app.use(cors(CORS_OPTIONS));

// Permet de lire les cookies dans req.cookies
app.use(cookieParser());

// Permet de lire les corps de requête en application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Permet de lire les corps de requête en application/json
app.use(express.json());

// Monte toutes les routes de l'application (définies dans src/routes/index.ts)
app.use(router);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;
