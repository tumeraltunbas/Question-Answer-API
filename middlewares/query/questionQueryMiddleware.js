const { searchHelper, populateHelper, questionSortHelper } = require("./queryMiddewareHelpers")

const questionQueryMiddleware = function(model, options)
{
    return async function(req, res, next)
    {
        let query = model.find();
        //search
        query = searchHelper(req,"title",query);
        //populate
        if(options && options.populate)
        {
            query = populateHelper(query, options.populate);
        }
        //sort
        query = questionSortHelper(req, query);
        
        //Just bring isVisible=true questions in filtered questions
        query = query.where({isVisible:true});

        const queryResults = await query;
        res.queryResults = {
            success:true,
            count: queryResults.length,
            data:queryResults
        }
        next();
    }
}


module.exports = questionQueryMiddleware;