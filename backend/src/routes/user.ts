import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users/:email", (req, res) => userController.getByEmail(req, res));
userRouter.post("/users", (req, res) => userController.create(req, res));

export default userRouter;