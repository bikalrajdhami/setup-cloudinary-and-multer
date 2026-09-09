require('dotenv').config()
const express= require("express");
const { default: mongoose } = require('mongoose');
const connectDb = require('./Config/dbConnect');
const userRouter = require("./Router/userRouter")
const postRouter = require("./Router/postRouter");
const cloudinaryConfig = require('./Config/cloudinary');
const app= express();
app.use(express.json());
const PORT = process.env.PORT

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter )



app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`)
    connectDb()
   cloudinaryConfig()
})