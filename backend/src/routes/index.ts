import { Router } from "express";
import userRouter     from "./user";
import bookRouter     from "./book";
import wishlistRouter from "./wishlist";
import groupRouter    from "./group";
import messageRouter  from "./message";
import eventRouter    from "./event";
import blogRouter     from "./blog";

const router = Router();

router.use("/users",     userRouter);
router.use("/books",     bookRouter);
router.use("/wishlist",  wishlistRouter);
router.use("/groups",    groupRouter);
router.use("/messages",  messageRouter);
router.use("/events",    eventRouter);
router.use("/blog",      blogRouter);

export default router;