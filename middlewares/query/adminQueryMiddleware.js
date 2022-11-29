const { searchHelper } = require("./queryMiddewareHelpers");

const adminQueryMiddleware = (model)=>
{
    return async function(req, res, next)
    {
        let query = model.find();
        //search
        query = searchHelper(req, "lastName", query);
        
        const users = await query;
        res.queryResult = {
            success:true,
            count: users.length,
            data: users
        };
        next();
    }
}

module.exports = adminQueryMiddleware;