const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Question = require("./Question");
const crypto = require("crypto");
const {
  changeVisiblityOfAnswers,
  changeVisiblityOfQuestions,
} = require("../helpers/blockHelpers");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "You have to provide a name"],
    minlength: [3, "The name must be longer than 2 characters"],
  },
  lastName: {
    type: String,
    required: [true, "You have to provide a last name"],
    minlength: [2, "The last name must be longer than 1 characters"],
  },
  email: {
    type: String,
    required: [true, "You need to provide an email"],
    unique: true,
    match: [
      /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    requred: [true, "You need to provide a password"],
    minlength: [8, "The password must be longer than 8 characters"],
    select: false,
  },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  createdAt: { type: Date, default: Date.now() },
  about: { type: String },
  website: {
    type: String,
    match: [
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
      "Please provide a valid website",
    ],
  },
  location: { type: String },
  profileImage: { type: String, default: "default.png" },
  blocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpires: { type: Date },
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(this.password, salt);
  this.password = hashed;
  next();
});

//Make answers & questions invisible when a user blocked;
UserSchema.pre("save", async function (next) {
  if (!this.isModified("blocked")) {
    next();
  }
  changeVisiblityOfQuestions(this._id);
  changeVisiblityOfAnswers(this._id);
  next();
});

UserSchema.methods.generateJwt = function () {

  /* To create jwt we need to follow some steps
    1 - Create Payload
    2 - Generate Secret Key
    3 - Generate Token Expires Time
    */

  const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;
  const payload = {
    id: this._id,
    lastName: this.lastName,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES });
  return token;
};

UserSchema.methods.generateResetPasswordToken = function () {
  const { RESET_PASSWORD_TOKEN_EXPIRES } = process.env;
  const randomString = crypto.randomBytes(15).toString("hex");
  const hash = crypto.createHash("SHA256").update(randomString).digest("hex");
  this.resetPasswordToken = hash;
  this.resetPasswordTokenExpires = new Date(
    Date.now() + parseInt(RESET_PASSWORD_TOKEN_EXPIRES) * 1000 * 60
  );
  return hash;
};

UserSchema.post("remove", async function (next) {
  await Question.deleteMany({ user: this._id });
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
