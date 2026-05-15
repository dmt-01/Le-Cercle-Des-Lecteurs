import {
  createGroupSchema,
  sendGroupMessageSchema,
} from "../validators/groupValidators";
import GroupController from "../controllers/groupController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const groupRouter = Router();

/**
 * GET /groups
 * GroupController.list() — retourne tous les cercles de lecture publics
 */
groupRouter.get("/", (req, res, next) => {
  new GroupController(req, res, next).list();
});

/**
 * GET /groups/:id
 * GroupController.getById() — retourne le détail d'un groupe avec membres et messages
 */
groupRouter.get("/:id", (req, res, next) => {
  new GroupController(req, res, next).getById();
});

/**
 * POST /groups
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(createGroupSchema) — valide name, description et accessClub
 * 3. GroupController.create() — crée le groupe, le créateur devient administrateur
 */
groupRouter.post("/", requireAuth, validate(createGroupSchema), (req, res, next) => {
  new GroupController(req, res, next).create();
});

/**
 * POST /groups/:id/join
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. GroupController.join() — ajoute l'utilisateur connecté comme membre du groupe
 */
groupRouter.post("/:id/join", requireAuth, (req, res, next) => {
  new GroupController(req, res, next).join();
});

/**
 * DELETE /groups/:id/leave
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. GroupController.leave() — retire l'utilisateur connecté des membres du groupe
 */
groupRouter.delete("/:id/leave", requireAuth, (req, res, next) => {
  new GroupController(req, res, next).leave();
});

/**
 * POST /groups/:id/messages
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(sendGroupMessageSchema) — valide le champ content
 * 3. GroupController.sendMessage() — envoie un message dans le fil du groupe
 */
groupRouter.post("/:id/messages", requireAuth, validate(sendGroupMessageSchema), (req, res, next) => {
  new GroupController(req, res, next).sendMessage();
});

export default groupRouter;
