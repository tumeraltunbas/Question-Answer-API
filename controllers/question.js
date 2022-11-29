const CustomError = require("../helpers/error/CustomError");
const Question = require("../models/Question");

const getAllQuestions = async(req, res, next) =>
{
    try
    {
        res.status(200).json(res.queryResults);
    }
    catch(err)
    {
        next(err);
    }

}

const askQuestion = async(req, res, next) =>
{
    try{
        const {title, content} = req.body;
        const question = await Question.create({title:title, content:content, user:req.user.id});
        res.status(200).json({success:true, data:question});
    }
    catch (err)
    {
        next(err);
    }
}
const deleteQuestion = async(req,res,next) =>
{
    try 
    {
        const {question_id} = req.params;
        await Question.findByIdAndRemove(question_id);
        res.status(200).json({success:true, message:"Question has been deleted"});
    }
    catch(err)
    {
        next(err);
    }
}

const editQuestion = async(req, res, next) =>
{
    try
    {
        const {question_id} = req.params;
        const {title, content} = req.body;
        const question = await Question.findById(question_id);
        // const question = await Question.findByIdAndUpdate(question_id,{title:title, content:content}, {new:true, runValidators:true});
        //Using findByIdAndUpdate is not working well, because save method is not working when updating process. Therefore slug is not refreshing.
        question.title = title;
        question.content = content;
        await question.save();
        res.status(200).json({success:true, data:question});

    }
    catch(err)
    {
        next(err);
    }
}

const getQuestionById = async(req, res, next)=>
{
    try
    {
        const {question_id} = req.params;
        const question = await Question.findById(question_id);
        res.status(200).json({success:true, data:question});
    }
    catch(err)
    {
        next(err)
    }
}

const likeQuestion = async(req,res,next) =>
{
    try
    {
        const {question_id} = req.params;
        const question = await Question.findById(question_id);
        //if user already liked this question
        if(question.likes.includes(req.user.id))
        {
           return next(new CustomError(400, "You already liked this question"));
        }
        question.likes.push(req.user.id);
        question.likeCount +=1;
        await question.save();
        res.status(200).json({success:true, data:question});
    }
    catch(err)
    {
        next(err);
    }
}

const unlikeQuestion = async(req,res,next) =>
{
    try
    {
        const {question_id} = req.params;
        const question = await Question.findById(question_id);
        //if user doesnt like the question
        if(!question.likes.includes(req.user.id))
        {
            return next(new CustomError(400, "You already did not liked this question"));
        }
        question.likes.splice(question.likes.indexOf(req.user.id),1);
        question.likeCount -=1;
        await question.save();
        res.status(200).json({success:true, data:question});
    }
    catch(err)
    {
        next(err);
    }
}

module.exports = {
    getAllQuestions,
    askQuestion,
    deleteQuestion,
    editQuestion,
    getQuestionById,
    likeQuestion,
    unlikeQuestion
}