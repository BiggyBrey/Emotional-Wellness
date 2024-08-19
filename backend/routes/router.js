import express from "express";
import { userRouter } from "./userRouter.js";
import { journalRouter } from "./journalRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/journals", journalRouter);

export default router;
