const CustomError = require("../../helpers/error/CustomError");
const Question = require("../../models/Question");

const isQuestionExists = async(req, res, next) =>
{
    try
    {
        const {question_id} = req.params;
        const question = await Question.findById(question_id);
        if(!question)
        {
            return next(new CustomError(400, "There is no question associated with that id"));
        }
        next();
    }
    catch(err)
    {
        next(err);
    }
}

const isThereAnswerInQuestion = async(req, res, next) =>
{
    try
    {
        const {question_id, answer_id} = req.params;
        const question = await Question.findById(question_id);
        if(!question.answers.includes(answer_id))
        {
            return next(new CustomError(400, "There is no answer associated with that question"));
        }
        next();
    }
    catch(err)
    {
        next(err);
    }

} 

module.exports = {
    isQuestionExists,
    isThereAnswerInQuestion
}