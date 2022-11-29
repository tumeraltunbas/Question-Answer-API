const mongoose = require("mongoose");

const connectDb = () =>
{
    mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Database connection done.")).catch(err => console.log("Database Error"));
}

module.exports = connectDb;