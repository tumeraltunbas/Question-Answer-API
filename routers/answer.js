const { isQuestionExists,isThereAnswerInQuestion } = require("../middlewares/database/queryHelpers");
const {getAnswers,createAnswer, deleteAnswer,getAnswerById,updateAnswer,likeAnswer,unlikeAnswer} = require("../controllers/answer");
const { isUserLoggedIn ,getAnswerOwnerAccess} = require("../middlewares/authorization/authorization");
const router = require("express").Router({mergeParams:true});

router.post("/",[isUserLoggedIn,isQuestionExists], createAnswer);
router.get("/", isQuestionExists, getAnswers);
router.get("/:answer_id", [isQuestionExists, isThereAnswerInQuestion], getAnswerById);
router.delete("/:answer_id", [isUserLoggedIn, isQuestionExists, isThereAnswerInQuestion, getAnswerOwnerAccess], deleteAnswer);
router.put("/:answer_id", [isUserLoggedIn, isQuestionExists, isThereAnswerInQuestion, getAnswerOwnerAccess], updateAnswer);
router.get("/:answer_id/like", [isUserLoggedIn, isQuestionExists, isThereAnswerInQuestion], likeAnswer);
router.get("/:answer_id/unlike", [isUserLoggedIn, isQuestionExists, isThereAnswerInQuestion], unlikeAnswer);

module.exports = router;