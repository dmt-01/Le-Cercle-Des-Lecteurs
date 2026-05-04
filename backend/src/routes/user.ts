import {
  signupSchema,
  signinSchema,
  updateUserSchema,
} from "../validators/userValidators";
import UserController from "../controllers/userController";
import { requireAuth, optionalAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/signup", validate(signupSchema), (req, res) => {
  new UserController(req, res).signup();
});

userRouter.post("/signin", validate(signinSchema), (req, res) => {
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
