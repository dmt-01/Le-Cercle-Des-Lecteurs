import { createBlogSchema } from "../validators/blogValidators";
import BlogController from "../controllers/blogController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const blogRouter = Router();

blogRouter.get("/", (req, res) => {
  new BlogController(req, res).list();
});

blogRouter.get("/:id", (req, res) => {
  new BlogController(req, res).getById();
});

blogRouter.post("/", requireAuth, validate(createBlogSchema), (req, res) => {
  new BlogController(req, res).create();
});

export default blogRouter;
