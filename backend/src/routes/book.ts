import {
  listBooksSchema,
  searchBooksSchema,
  createBookSchema,
  updateBookSchema,
} from "../validators/bookValidators";
import BookController from "../controllers/bookController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import reviewRouter from "./review";
import { Router } from "express";

const bookRouter = Router();

/**
 * GET /books/search?q=
 * Déclarée AVANT /books/:id pour éviter qu'Express interprète "search" comme un UUID.
 * 1. validate(searchBooksSchema) — vérifie que le paramètre q est présent et non vide
 * 2. BookController.search() — recherche par titre ou nom d'auteur (insensible à la casse)
 */
bookRouter.get("/search", validate(searchBooksSchema, "query"), (req, res, next) => {
  new BookController(req, res, next).search();
});

/**
 * GET /books
 * 1. validate(listBooksSchema) — valide et coerce les query params (page, limit, genre, tag, author)
 * 2. BookController.list() — retourne la liste paginée avec filtres optionnels
 */
bookRouter.get("/", validate(listBooksSchema, "query"), (req, res, next) => {
  new BookController(req, res, next).list();
});

/**
 * GET /books/:id
 * BookController.getById() — retourne le détail complet d'un livre (auteurs, genres, tags, note moyenne)
 */
bookRouter.get("/:id", (req, res, next) => {
  new BookController(req, res, next).getById();
});

/**
 * POST /books
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(createBookSchema) — valide le corps de la requête
 * 3. BookController.create() — crée le livre avec ses relations
 */
bookRouter.post("/", requireAuth, validate(createBookSchema), (req, res, next) => {
  new BookController(req, res, next).create();
});

/**
 * PUT /books/:id
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(updateBookSchema) — valide les champs à modifier
 * 3. BookController.update() — applique la mise à jour partielle
 */
bookRouter.put("/:id", requireAuth, validate(updateBookSchema), (req, res, next) => {
  new BookController(req, res, next).update();
});

/**
 * DELETE /books/:id
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. BookController.remove() — supprime le livre
 */
bookRouter.delete("/:id", requireAuth, (req, res, next) => {
  new BookController(req, res, next).remove();
});

/**
 * POST /books/:id/read
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. BookController.toggleRead() — bascule l'état "lu" pour l'utilisateur connecté
 */
bookRouter.post("/:id/read", requireAuth, (req, res, next) => {
  new BookController(req, res, next).toggleRead();
});

/**
 * POST /books/:id/like
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. BookController.toggleLike() — bascule l'état "favori" pour l'utilisateur connecté
 */
bookRouter.post("/:id/like", requireAuth, (req, res, next) => {
  new BookController(req, res, next).toggleLike();
});

bookRouter.use("/:bookId/reviews", reviewRouter);

export default bookRouter;
