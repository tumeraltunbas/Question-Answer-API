const router = require("express").Router();
const questionRouter = require("../routers/question");
const userRouter = require("./user");
const adminRouter = require("./admin");


router.use("/questions", questionRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;