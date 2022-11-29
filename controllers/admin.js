const User = require("../models/User");

const blockUser = async(req,res,next) =>
{
    try
    {
        const {user_id} = req.params;
        const user = await User.findById(user_id);
        user.blocked = !user.blocked;
        await user.save();
        res.status(200).json({success:true, message:`block: ${user.blocked} successfull`});
    }
    catch(err)
    {
        next(err);
    }
}

const deleteUser = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.params;
        const user = await User.findById(user_id);
        await user.remove();
        res.status(200).json({success:true, message:"User has been deleted"});
    }
    catch(err)
    {
        next(err);
    }

}

const getAllUsers = async(req, res, next) =>
{
    try
    {
        res.status(200).json(res.queryResult);
    }
    catch(err)
    {
        next(err);
    }
}

const getUserById = async(req, res, next) =>
{
    try
    {
        const {user_id} = req.params;
        const user = await User.findById(user_id);
        res.status(200).json({success:true, data:user});
    }
    catch(err)
    {
        next(err);
    }
}

module.exports = {
    blockUser,
    deleteUser,
    getAllUsers,
    getUserById
}