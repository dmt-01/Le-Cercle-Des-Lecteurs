import { Router } from "express";
import testRouter from "./test";

const router = Router();

router.use(testRouter);

export default router;