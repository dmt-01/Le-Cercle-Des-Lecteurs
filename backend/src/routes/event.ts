import { createEventSchema } from "../validators/eventValidators";
import EventController from "../controllers/eventController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const eventRouter = Router();

/**
 * GET /events
 * EventController.list() — retourne tous les événements à venir
 */
eventRouter.get("/", (req, res, next) => {
  new EventController(req, res, next).list();
});

/**
 * GET /events/:id
 * EventController.getById() — retourne le détail d'un événement avec le livre associé
 */
eventRouter.get("/:id", (req, res, next) => {
  new EventController(req, res, next).getById();
});

/**
 * POST /events
 * 1. requireAuth — vérifie le cookie JWT et injecte userId dans req
 * 2. validate(createEventSchema) — valide title, description, eventDate, groupId
 * 3. EventController.create() — crée un événement rattaché à un groupe
 */
eventRouter.post("/", requireAuth, validate(createEventSchema), (req, res, next) => {
  new EventController(req, res, next).create();
});

export default eventRouter;
