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

userRouter.post("/signup", authLimiter, validate(signupSchema), (req, res) => {
  new UserController(req, res).signup();
});

userRouter.post("/signin", authLimiter, validate(signinSchema), (req, res) => {
  new UserController(req, res).signin();
});

userRouter.post("/refresh", requireAuth, (req, res) => {
  new UserController(req, res).refresh();
});

userRouter.post("/logout", requireAuth, (req, res) => {
  new UserController(req, res).logout();
});

userRouter.get("/me", requireAuth, (req, res) => {
  new UserController(req, res).getMe();
});

userRouter.put("/me", requireAuth, validate(updateUserSchema), (req, res) => {
  new UserController(req, res).updateMe();
});

userRouter.get("/:id", optionalAuth, (req, res) => {
  new UserController(req, res).getPublicProfile();
});

userRouter.post("/:id/follow", requireAuth, (req, res) => {
  new UserController(req, res).follow();
});

userRouter.delete("/:id/follow", requireAuth, (req, res) => {
  new UserController(req, res).unfollow();
});

export default userRouter;
