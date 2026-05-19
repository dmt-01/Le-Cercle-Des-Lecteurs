import {
  signupSchema,
  signinSchema,
  updateUserSchema,
} from "../validators/userValidators";
import UserController from "../controllers/userController";
import { requireAuth, optionalAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import rateLimit from "express-rate-limit";
import { Router } from "express";

const userRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Trop de tentatives, veuillez réessayer dans une minute." },
});

/**
 * POST /users/signup
 * 1. authLimiter — bloque après 10 tentatives par minute par IP
 * 2. validate(signupSchema) — valide username, email, password (min 12 cars)
 * 3. UserController.signup() — crée l'utilisateur, signe le JWT et pose le cookie
 */
userRouter.post("/signup", authLimiter, validate(signupSchema), (req, res, next) => {
  new UserController(req, res, next).signup();
});

/**
 * POST /users/signin
 * 1. authLimiter — bloque après 10 tentatives par minute par IP
 * 2. validate(signinSchema) — valide email et password
 * 3. UserController.signin() — vérifie les identifiants, signe le JWT et pose le cookie
 */
userRouter.post("/signin", authLimiter, validate(signinSchema), (req, res, next) => {
  new UserController(req, res, next).signin();
});

/**
 * POST /users/refresh
 * 1. UserController.refresh() — vérifie le cookie refresh token, effectue la rotation,
 *    et retourne un nouvel access token dans le body
 */
userRouter.post("/refresh", (req, res, next) => {
  new UserController(req, res, next).refresh();
});

/**
 * POST /users/logout
 * 1. requireAuth — vérifie l'access token (Authorization: Bearer) et injecte userId dans req
 * 2. UserController.logout() — supprime le token en base et efface le cookie
 */
userRouter.post("/logout", requireAuth, (req, res, next) => {
  new UserController(req, res, next).logout();
});

/**
 * GET /users/me
 * 1. requireAuth — vérifie l'access token (Authorization: Bearer) et injecte userId dans req
 * 2. UserController.getMe() — retourne le profil de l'utilisateur connecté
 */
userRouter.get("/me", requireAuth, (req, res, next) => {
  new UserController(req, res, next).getMe();
});

/**
 * PUT /users/me
 * 1. requireAuth — vérifie l'access token (Authorization: Bearer) et injecte userId dans req
 * 2. validate(updateUserSchema) — valide les champs modifiables (username, bio, profileImage)
 * 3. UserController.updateMe() — met à jour le profil
 */
userRouter.put("/me", requireAuth, validate(updateUserSchema), (req, res, next) => {
  new UserController(req, res, next).updateMe();
});

/**
 * GET /users/:id
 * 1. optionalAuth — injecte userId si connecté, undefined sinon (adapte les données renvoyées)
 * 2. UserController.getPublicProfile() — retourne le profil public de l'utilisateur
 */
userRouter.get("/:id", optionalAuth, (req, res, next) => {
  new UserController(req, res, next).getPublicProfile();
});

/**
 * POST /users/:id/follow
 * 1. requireAuth — vérifie l'access token (Authorization: Bearer) et injecte userId dans req
 * 2. UserController.follow() — abonne l'utilisateur connecté à l'utilisateur ciblé
 */
userRouter.post("/:id/follow", requireAuth, (req, res, next) => {
  new UserController(req, res, next).follow();
});

/**
 * DELETE /users/:id/follow
 * 1. requireAuth — vérifie l'access token (Authorization: Bearer) et injecte userId dans req
 * 2. UserController.unfollow() — désabonne l'utilisateur connecté de l'utilisateur ciblé
 */
userRouter.delete("/:id/follow", requireAuth, (req, res, next) => {
  new UserController(req, res, next).unfollow();
});

export default userRouter;
