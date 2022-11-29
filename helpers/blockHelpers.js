const Answer = require("../models/Answer");
const Question = require("../models/Question");

const changeVisiblityOfQuestions = async (user) => {
  try {
    const questions = await Question.find({ user: user });
    for (var question of questions) {
      question.isVisible = !question.isVisible;
      await question.save();
    }
  } catch (err) {
    next(err);
  }
};

const changeVisiblityOfAnswers = async (user) => {
  try {
    const answers = await Answer.find({ user: user });
    for (var answer of answers) {
      answer.isVisible = !answer.isVisible;
      await answer.save();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  changeVisiblityOfQuestions,
  changeVisiblityOfAnswers,
};
