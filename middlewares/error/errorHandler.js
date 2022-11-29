const CustomError = require("../../helpers/error/CustomError");

const errorHandler = (err, req, res, next) =>
{
    var error = err;
    res.status(error.status||500).json({success:false, message:error.message});
}

module.exports = errorHandler;

