import express from "express";
import { userRouter } from "./userRouter.js";
import { journalRouter } from "./journalRouter.js";
import { AiChatRouter } from "./aiConvoRouter.js";
const router = express.Router();

router.use("/users", userRouter);
router.use("/journals", journalRouter);
router.use("/aiChats", AiChatRouter)

export default router;
