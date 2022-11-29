const saveJwtToCookie = (user, res) =>
{
    const {NODE_ENV, COOKIE_EXPIRES} = process.env;
    const token = user.generateJwt();
    res
    .cookie("access_token", token, {httponly:true, secure:NODE_ENV == "production" ? false : true, expires:new Date(Date.now() + parseInt(COOKIE_EXPIRES) * 1000 * 60)})
    .status(200)
    .json({success:true, data:user, token:token});
}

const isTokenIncluded = (req) =>
{
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer");
}

const getToken = (req) =>
{
    const access_token = req.headers.authorization;
    return access_token.split(" ")[1];
}


module.exports = {
    saveJwtToCookie,
    isTokenIncluded,
    getToken
}
