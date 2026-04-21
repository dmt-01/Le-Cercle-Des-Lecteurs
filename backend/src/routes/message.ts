import { sendMessageSchema } from "../validators/messageValidators";
import MessageController from "../controllers/messageController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const messageRouter = Router();

messageRouter.get("/", requireAuth, (req, res) => {
  new MessageController(req, res).listConversations();
});

messageRouter.get("/:userId", requireAuth, (req, res) => {
  new MessageController(req, res).getConversation();
});

messageRouter.post("/:userId", requireAuth, validate(sendMessageSchema), (req, res) => {
  new MessageController(req, res).send();
});

export default messageRouter;
