import { addWishlistSchema } from "../validators/wishlistValidators";
import WishlistController from "../controllers/wishlistController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const wishlistRouter = Router();

/**
 * GET /wishlist
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. WishlistController.list() — retourne les livres de la wishlist de l'utilisateur connecté
 */
wishlistRouter.get("/", requireAuth, (req, res, next) => {
  new WishlistController(req, res, next).list();
});

/**
 * POST /wishlist
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(addWishlistSchema) — valide bookId et status
 * 3. WishlistController.add() — ajoute ou met à jour un livre dans la wishlist
 */
wishlistRouter.post("/", requireAuth, validate(addWishlistSchema), (req, res, next) => {
    new WishlistController(req, res, next).add();
  },
);

/**
 * DELETE /wishlist/:bookId
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. WishlistController.remove() — retire le livre de la wishlist
 */
wishlistRouter.delete("/:bookId", requireAuth, (req, res, next) => {
  new WishlistController(req, res, next).remove();
});

export default wishlistRouter;
