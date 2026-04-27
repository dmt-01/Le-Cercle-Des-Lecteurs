import { addWishlistSchema } from "../validators/wishlistValidators";
import WishlistController from "../controllers/wishlistController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const wishlistRouter = Router();

wishlistRouter.get("/", requireAuth, (req, res) => {
  new WishlistController(req, res).list();
});

wishlistRouter.post(
  "/",
  requireAuth,
  validate(addWishlistSchema),
  (req, res) => {
    new WishlistController(req, res).add();
  },
);

wishlistRouter.delete("/:bookId", requireAuth, (req, res) => {
  new WishlistController(req, res).remove();
});

export default wishlistRouter;
