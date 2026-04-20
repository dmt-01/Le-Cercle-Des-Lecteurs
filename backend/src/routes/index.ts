import { Router } from "express";
import userRouter from "./user";

/**
 * Routeur principal de l'application.
 *
 * Agrège tous les sous-routeurs ici.
 * Ce routeur est monté dans index.ts via app.use(router).
 *
 * Pour ajouter une nouvelle ressource (ex: livres) :
 *   import bookRouter from "./book";
 *   router.use("/books", bookRouter);
 */
const router = Router();

// Routes d'authentification : /signup, /signin
router.use(userRouter);

export default router;