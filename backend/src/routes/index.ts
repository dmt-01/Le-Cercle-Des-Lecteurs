import { Router } from "express";
import userRouter from "./user";
import bookRouter from "./book";

/**
 * Routeur principal de l'application.
 *
 * Agrège tous les sous-routeurs ici.
 * Ce routeur est monté dans index.ts via app.use(router).
 */
const router = Router();

// Routes d'authentification : /users/signup, /users/signin, /users/refresh, /users/logout
router.use("/users", userRouter);

// Routes des livres : /books, /books/:id, /books/search
router.use("/books", bookRouter);

export default router;