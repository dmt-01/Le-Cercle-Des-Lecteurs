import { Router } from "express";

const testRouter = Router();

testRouter.get("/test", (req, res) => {
  res.json({ message: "Hello World" });
});

export default testRouter;