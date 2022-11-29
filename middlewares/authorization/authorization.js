const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const {isTokenIncluded,getToken} = require("../../helpers/authorization/tokenHelpers");
const jwt = require("jsonwebtoken");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const isUserExists = async(req, res, next) =>
{
    const {email} = req.body;
    const user = await  User.findOne({email:email});
    if(!user)
    {
        return next(new CustomError(400, "There is no account associated with that email"))
    }
    next();
}

const isUserLoggedIn = (req, res, next) =>
{
    if(!isTokenIncluded(req))
    {
        return next(new CustomError(400, "You have to provide a token"));
    }
    const {JWT_SECRET_KEY} = process.env;
    const token = getToken(req);
    jwt.verify(token, JWT_SECRET_KEY, function(err, decoded)
    {
        if(err) next(new CustomError(401, "You are not logged in"));
        req.user = {
            id:decoded.id,
            lastName:decoded.lastName
        };
        next();
    });
}

const getQuestionOwnerAccess = async(req, res, next) =>
{
    const {question_id} = req.params;
    const question = await Question.findById(question_id);
    if(question.user != req.user.id)
    {
        return next(new CustomError(401, "You are not owner of this question"));
    }
    next();
}

const getAdminAccess = async(req, res, next) =>
{
    const user = await User.findById(req.user.id);
    if(user.role != "admin")
    {
        return next(new CustomError(403, "You can not access to this route because you are not admin"));
    }
    next();
}
const getAnswerOwnerAccess = async(req, res, next) =>
{
    try
    {
        const {answer_id} = req.params;
        const answer = await Answer.findById(answer_id);
        if(answer.user != req.user.id)
        {
            console.log(answer.user);
            console.log(req.user.id);
            return next(new CustomError(400, "You are not owner of this answer"));
        }
        next();
    }
    catch(err)
    {
        next(err);
    }
}

module.exports = {
    isUserExists,
    isUserLoggedIn,
    getQuestionOwnerAccess,
    getAdminAccess,
    getAnswerOwnerAccess
}