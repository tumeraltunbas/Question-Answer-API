const express = require("express"); //import express
const app = express(); //creating an express app from express's constructor
require("dotenv").config({path:"./config/env/config.env"}); //it loads content of config to process.env property
const connectDb = require("./helpers/database/connectDb"); //import connect db helper function
const errorHandler = require("./middlewares/error/errorHandler");
const router = require("./routers/index"); //import all routers

connectDb(); //using connect db helper function
app.use(express.json()); //it parses the incoming request
app.use("/api", router); //using routers
app.use(express.static("public")); //specifying where is our static directory.
app.use(errorHandler); //using error handler

app.listen(process.env.PORT, () => console.log(`Server started at ${process.env.PORT}`));