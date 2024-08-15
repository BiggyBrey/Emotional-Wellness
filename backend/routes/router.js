const express = require("express");
const userRouter = require("./userRouter");
const journalRouter = require("./journalRouter");

const router = express.Router();

router.use("/users", userRouter);
router.use("/journals", journalRouter);

module.exports = router;
