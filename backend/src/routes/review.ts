import { upsertReviewSchema } from "../validators/reviewValidators";
import ReviewController from "../controllers/reviewController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

/**
 * mergeParams: true permet d'accéder à req.params.bookId
 * qui est défini dans le routeur parent (bookRouter).
 */
const reviewRouter = Router({ mergeParams: true });

/**
 * GET /books/:bookId/reviews
 * ReviewController.list() — retourne toutes les reviews du livre avec le username de l'auteur
 */
reviewRouter.get("/", (req, res, next) => {
  new ReviewController(req, res, next).list();
});

/**
 * POST /books/:bookId/reviews
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(upsertReviewSchema) — vérifie que content ou note est fourni
 * 3. ReviewController.upsert() — crée ou met à jour la review (une par user par livre)
 */
reviewRouter.post("/", requireAuth, validate(upsertReviewSchema), (req, res, next) => {
    new ReviewController(req, res, next).upsert();
  },
);

/**
 * DELETE /books/:bookId/reviews
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. ReviewController.remove() — supprime la review de l'utilisateur connecté
 */
reviewRouter.delete("/", requireAuth, (req, res, next) => {
  new ReviewController(req, res, next).remove();
});

export default reviewRouter;
