import {
  createGroupSchema,
  sendGroupMessageSchema,
} from "../validators/groupValidators";
import GroupController from "../controllers/groupController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const groupRouter = Router();

groupRouter.get("/", (req, res) => {
  new GroupController(req, res).list();
});

groupRouter.get("/:id", (req, res) => {
  new GroupController(req, res).getById();
});

groupRouter.post("/", requireAuth, validate(createGroupSchema), (req, res) => {
  new GroupController(req, res).create();
});

groupRouter.post("/:id/join", requireAuth, (req, res) => {
  new GroupController(req, res).join();
});

groupRouter.delete("/:id/leave", requireAuth, (req, res) => {
  new GroupController(req, res).leave();
});

groupRouter.post(
  "/:id/messages",
  requireAuth,
  validate(sendGroupMessageSchema),
  (req, res) => {
    new GroupController(req, res).sendMessage();
  },
);

export default groupRouter;
