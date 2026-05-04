import { createEventSchema } from "../validators/eventValidators";
import EventController from "../controllers/eventController";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { Router } from "express";

const eventRouter = Router();

eventRouter.get("/", (req, res) => {
  new EventController(req, res).list();
});

eventRouter.get("/:id", (req, res) => {
  new EventController(req, res).getById();
});

eventRouter.post("/", requireAuth, validate(createEventSchema), (req, res) => {
  new EventController(req, res).create();
});

export default eventRouter;
