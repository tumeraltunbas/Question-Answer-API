const mongoose = require("mongoose");
const Question = require("./Question");

const AnswerSchema = new mongoose.Schema({
    content: {type:String, required:[true, "You have to provide a content"], minlength:[8, "The content must be larger than 8 characters"]},
    user: {type:mongoose.Schema.ObjectId, required:true, ref:"User"},
    question: {type:mongoose.Schema.ObjectId, required:true, ref:"Question"},
    createdAt: {type:Date, default:Date.now()},
    likes: [{type:mongoose.Schema.ObjectId, ref:"User"}],
    likeCount : {type:Number, default:0},
    isVisible:{type:Boolean, default:true}
});

AnswerSchema.pre("save", async function(next)
{
    if(!this.isModified("user"))
    {
        next();
    }
    try
    {
        const question = await Question.findById(this.question);
        question.answers.push(this.id);
        question.answerCount +=1;
        await question.save();
        next();
    }
    catch(err)
    {
        next(err);
    }

});

AnswerSchema.post("remove", async function(next)
{
    try
    {
        const question = await Question.findById(this.question);
        question.answers.splice(question.answers.indexOf(this.id), 1);
        question.answerCount -=1;
        await question.save();
    }
    catch(err)
    {
        next(err);
    }
});

const Answer = mongoose.model("Answer", AnswerSchema); 

module.exports = Answer;