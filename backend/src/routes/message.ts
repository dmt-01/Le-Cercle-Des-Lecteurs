import { sendMessageSchema } from "../validators/messageValidators";
import MessageController from "../controllers/messageController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const messageRouter = Router();

/**
 * GET /messages
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. MessageController.listConversations() — retourne toutes les conversations de l'utilisateur
 */
messageRouter.get("/", requireAuth, (req, res, next) => {
  new MessageController(req, res, next).listConversations();
});

/**
 * GET /messages/:userId
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. MessageController.getConversation() — retourne les messages échangés avec un utilisateur
 */
messageRouter.get("/:userId", requireAuth, (req, res, next) => {
  new MessageController(req, res, next).getConversation();
});

/**
 * POST /messages/:userId
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(sendMessageSchema) — valide le champ content
 * 3. MessageController.send() — envoie un message privé à l'utilisateur ciblé
 */
messageRouter.post("/:userId", requireAuth, validate(sendMessageSchema), (req, res, next) => {
  new MessageController(req, res, next).send();
});

export default messageRouter;
