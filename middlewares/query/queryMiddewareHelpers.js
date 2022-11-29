const searchHelper = (req,searchKey,query) =>
{
    if(req.query.search)
    {
        const regex = new RegExp(req.query.search, "i");
        let updatedQuery = query.where({searchKey:regex});
        return updatedQuery;
    }
    else
    {
        return query;
    }
}

const populateHelper = (query, population) =>
{
    return query.populate(population);
}

const questionSortHelper = (req, query)=>
{
    if(req.query.sortBy=="most-answered")
    {
        return query.sort("-answerCount");
    }
    if(req.query.sortBy=="most-liked")
    {
        return query.sort("-likeCount");
    }
    return query.sort("-createdAt");
}

module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper
}