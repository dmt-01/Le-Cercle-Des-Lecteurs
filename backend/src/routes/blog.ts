import { createBlogSchema } from "../validators/blogValidators";
import BlogController from "../controllers/blogController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const blogRouter = Router();

/**
 * GET /blog
 * BlogController.list() — retourne la liste de tous les articles triés par date
 */
blogRouter.get("/", (req, res, next) => {
  new BlogController(req, res, next).list();
});

/**
 * GET /blog/:id
 * BlogController.getById() — retourne le détail d'un article
 */
blogRouter.get("/:id", (req, res, next) => {
  new BlogController(req, res, next).getById();
});

/**
 * POST /blog
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(createBlogSchema) — valide title, content et category
 * 3. BlogController.create() — publie un nouvel article
 */
blogRouter.post("/", requireAuth, validate(createBlogSchema), (req, res, next) => {
  new BlogController(req, res, next).create();
});

export default blogRouter;
