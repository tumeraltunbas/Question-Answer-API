const mongoose = require("mongoose");
const slugify = require("slugify")

const QuestionSchema = new mongoose.Schema({
    title: {type:String, required:[true, "You have to provide a title"], minlength:[10, "Title must be longer than 10 characters"], unique:true},
    content: {type:String, required:[true, "You have to provide a content"], minlength:[15, "Content must be longer than 10 charaters"]},
    createdAt: {type:Date, default:Date.now()},
    user: {type:mongoose.Schema.ObjectId, ref:"User", required:[true, "A question must asked by an user"]},
    answers : [{type:mongoose.Schema.ObjectId, ref:"Answer"}],
    likes : [{type:mongoose.Schema.ObjectId, ref:"User"}],
    slug:{type:String},
    likeCount : {type:Number, default:0},
    answerCount: {type:Number, default:0},
    isVisible:{type:Boolean, default:true}
});


QuestionSchema.pre("save", function(next)
{
    if(!this.isModified("title"))
    {
        next();
    }
    this.slug = slugify(this.title, {replacement:"-", lower:true, remove:true});
    next();
});


const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;