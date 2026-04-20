import { Router } from "express";
import UserController from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/requireAuth";
import { signupSchema, signinSchema } from "../validators/userValidators";

const userRouter = Router();

/**
 * POST /signup
 * 1. validate(signupSchema) — vérifie les données avec Zod avant d'entrer dans le contrôleur
 * 2. UserController.signup() — crée l'utilisateur et pose le cookie JWT
 */
userRouter.post("/signup", validate(signupSchema), (req, res) => {
  const controller = new UserController(req, res);
  controller.signup();
});

/**
 * POST /signin
 * 1. validate(signinSchema) — vérifie les données avec Zod avant d'entrer dans le contrôleur
 * 2. UserController.signin() — vérifie les credentials et pose le cookie JWT
 */
userRouter.post("/signin", validate(signinSchema), (req, res) => {
  const controller = new UserController(req, res);
  controller.signin();
});

/**
 * POST /refresh
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. UserController.refresh() — génère un nouveau token, rotation en base, met à jour le cookie
 */
userRouter.post("/refresh", requireAuth, (req, res) => {
  const controller = new UserController(req, res);
  controller.refresh();
});

/**
 * POST /logout
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. UserController.logout() — supprime le token en base et efface le cookie
 */
userRouter.post("/logout", requireAuth, (req, res) => {
  const controller = new UserController(req, res);
  controller.logout();
});

export default userRouter;
