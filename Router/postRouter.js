const express= require("express");
const { getPost, createPost,  getPostById, deletePost } = require("../Controller/postController");
const verifyUser = require("../middleware/auth");

const route =express.Router();

route.get("/", getPost);
route.post("/",verifyUser, createPost);
route.get("/:id", getPostById);
route.delete("/:id", verifyUser, deletePost);


module.exports=route