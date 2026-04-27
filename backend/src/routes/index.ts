import wishlistRouter from "./wishlist";
import messageRouter from "./message";
import eventRouter from "./event";
import groupRouter from "./group";
import userRouter from "./user";
import blogRouter from "./blog";
import bookRouter from "./book";
import { Router } from "express";

const router = Router();

router.use("/users", userRouter);
router.use("/books", bookRouter);
router.use("/wishlist", wishlistRouter);
router.use("/groups", groupRouter);
router.use("/messages", messageRouter);
router.use("/events", eventRouter);
router.use("/blog", blogRouter);

export default router;
