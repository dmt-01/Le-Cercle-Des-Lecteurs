import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import type { CorsOptions } from "cors";
import router from "./src/routes";

const app = express();
const PORT = 3000;

const env = process.env.NODE_ENV;
console.log(`Environnement : ${env}`);

const CORS_OPTIONS: CorsOptions = {
  origin: [process.env.CORS_ALLOWED ?? ""],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(helmet());
app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;