const User = require("../models/User");
const {saveJwtToCookie} = require("../helpers/authorization/tokenHelpers");
const {isInputProvided, comparePassword} = require("../helpers/authorization/inputHelpers");
const CustomError = require("../helpers/error/CustomError");
const sendEmail = require("../helpers/libraries/sendMail");

const register = async(req, res, next) =>
{
    try
    {
        const {firstName, lastName, email, password} = req.body;
        const user = await User.create({firstName:firstName, lastName:lastName, email:email, password:password});
        saveJwtToCookie(user, res);
    }
    catch(err)
    {
        next(err);
    }
}

const login = async(req, res, next) =>
{
    try
    {
        const {email, password} = req.body;
        if(!isInputProvided(email, password))
        {
            return next(new CustomError(400, "Please provide email and password"));
        }
        const user = await User.findOne({email:email}).select("+password");
        if(!comparePassword(password, user.password))
        {
            return next(new CustomError(400,"Password is wrong"));
        }
        saveJwtToCookie(user, res);
    }
    catch(err)
    {
        next(err);
    }

}

const logout = (req, res, next) =>
{
    try
    {
        //we need to delete token from the cookie
        const {NODE_ENV} = process.env;
        res.cookie("access_token", null, {httpOnly : true,
        expires : new Date(Date.now()),
        secure : NODE_ENV === "development" ? false : true})
        .status(200) 
        .json({success:true, message:"You successfully logged out"});
    }
    catch(err)
    {
        next(err);
    }

}

const forgotPassword = async(req,res, next) =>
{
    const {email} = req.body;
    const user = await User.findOne({email:email});
    try
    {
        const token = user.generateResetPasswordToken();
        await user.save();
        const resetUrl = `https://localhost:5002/api/user/resetpassword?resetpasswordtoken=${token}`;
        sendEmail({
            from:process.env.SMTP_USER,
            to:email,
            subject: "About Your Reset Password Request",
            html: `<p>Your password reset <a href='${resetUrl}'>link</a></p>`
        });
        res.status(200).json({success:true, message:`Password reset email has sent to ${email}`});
    }
    catch(err)
    {
        user.resetPasswordToken=null;
        user.resetPasswordTokenExpires=null;
        await user.save();
    }
}

const resetPassword = async(req, res, next) =>
{
    try
    {
        const {resetpasswordtoken} = req.query;
        const {password} = req.body;
        const user = await User.findOne({resetPasswordToken:resetpasswordtoken});
        if(!user)
        {
            return next(new CustomError(400, "There is no user associated with that token"));
        }
        user.password = password;
        user.resetPasswordToken=null;
        user.resetPasswordTokenExpires=null;
        await user.save();
        res.status(200).json({success:true, message:"Your password has been updated"});

    }
    catch(err)
    {
        next(err)
    }
}

const updateUser = async(req, res, next) =>
{
    try
    {
        const {about, website,location} = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {about:about, website:website, location:location}, {new:true, runValidators:true});
        res.status(200).json({success:true, data:user});
    }
    catch(err)
    {
        next(err);
    }
}

const uploadProfileImage = async(req, res, next) =>
{
    try
    {
        if(!req.file)
        {
            return next(new CustomError(400, "You did not send a file"));
        }
        const user = await User.findByIdAndUpdate(req.user.id, {"profileImage":req.filename}, {runValidators:true, new:true});
        res.status(200).json({success:true, message:"Photo uploading successfull", data:user});
    }
    catch(err)
    {
        return next(err);
    }
}

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
    uploadProfileImage
}
