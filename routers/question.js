const router = require("express").Router();
const {getAllQuestions,askQuestion,deleteQuestion,editQuestion,getQuestionById,likeQuestion,unlikeQuestion} = require("../controllers/question");
const {isUserLoggedIn,getQuestionOwnerAccess} = require("../middlewares/authorization/authorization");
const {isQuestionExists} = require("../middlewares/database/queryHelpers");
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const Question = require("../models/Question");
const answerRouter = require("../routers/answer");

router.get("/",questionQueryMiddleware(Question, {populate:{path:"user", select:"firstName, profileImage"}}),getAllQuestions);
router.get("/:question_id", isQuestionExists, getQuestionById);
router.post("/ask", isUserLoggedIn, askQuestion);
router.put("/edit/:question_id",[isUserLoggedIn, isQuestionExists, getQuestionOwnerAccess], editQuestion);
router.delete("/delete/:question_id", [isUserLoggedIn, isQuestionExists, getQuestionOwnerAccess] , deleteQuestion);
router.get("/like/:question_id", [isUserLoggedIn, isQuestionExists], likeQuestion);
router.get("/unlike/:question_id",[isUserLoggedIn, isQuestionExists], unlikeQuestion);

router.use("/:question_id/answers",answerRouter);
module.exports = router;