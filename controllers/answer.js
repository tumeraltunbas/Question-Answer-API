const CustomError = require("../helpers/error/CustomError");
const Answer = require("../models/Answer");

const getAnswers =async(req,res, next) =>
{
    try
    {
        const {question_id} = req.params;
        const answers = await Answer.find({question:question_id, isVisible:true})
        .populate({path:"user", select:"firstName lastName"})
        .populate({path:"question", select:"title content"});
        res.status(200).json({success:true, data:answers});
    }
    catch(err)
    {
        next(err);
    }
}

const createAnswer = async(req,res,next)=>
{
    try
    {
        const {content} = req.body;
        const {question_id} = req.params;
        const answer = await Answer.create({content:content, user:req.user.id, question:question_id});
        
        res.status(200).json({success:true, data:answer});
    }
    catch(err)
    {
        next(err);
    }
}

const deleteAnswer = async(req,res, next) =>
{
    try
    {
        const {answer_id} = req.params;
        const answer = await Answer.findById(answer_id);
        await answer.remove();
        res.status(200).json({success:true, message:"Answer has been deleted"});
    }
    catch(err)
    {
        next(err)
    }
}

const getAnswerById = async (req, res, next) =>
{
    try
    {
        const {answer_id} = req.params;
        const answer = await Answer.findOne({_id:answer_id, isVisible:true})
        .populate({path:'user', select:'firstName lastName'})
        .populate({path:'question', select:'title content'});
        res.status(200).json({success:true, data:answer});
    }
    catch(err)
    {
        next(err);
    }
}

const updateAnswer = async(req, res, next) =>
{
    try
    {
        const {answer_id} = req.params;
        const {content} = req.body;
        const answer = await Answer.findByIdAndUpdate(answer_id, {content:content}, {new:true, runValidators:true});
        res.status(200).json({success:true, data:answer});
    }
    catch(err)
    {
        next(err);
    }
};

const likeAnswer = async(req, res, next) =>
{
    try
    {
        const {answer_id} = req.params;
        const answer = await Answer.findOne({_id:answer_id, isVisible:true});
        if(answer.likes.includes(req.user.id))
        {
            //already liked this answer
            return next(new CustomError(400, "You have already liked this answer"));
        }
        answer.likes.push(req.user.id);
        answer.likeCount +=1;
        await answer.save();
        res.status(200).json({success:true, data:answer});
    }
    catch(err)
    {
        next(err);
    }
};

const unlikeAnswer = async(req, res, next) =>
{
    try
    {
        const {answer_id} = req.params;
        const answer = await Answer.findOne({_id:answer_id, isVisible:true});
        if(!answer.likes.includes(req.user.id))
        {
            //already unliked this answer
            return next(new CustomError(400, "You have already unliked this answer"));
        }
        answer.likes.splice(answer.likes.indexOf(req.user.id),1);
        answer.likeCount -=1;
        await answer.save();
        res.status(200).json({success:true, data:answer});
    }
    catch(err)
    {
        next(err);
    }
};

module.exports = {
    getAnswers,
    createAnswer,
    deleteAnswer,
    getAnswerById,
    updateAnswer,
    likeAnswer,
    unlikeAnswer
}