const express= require("express");
const { getPost, createPost,  getPostById, deletePost, updatePost, likePost } = require("../Controller/postController");
const verifyUser = require("../middleware/auth");

const route =express.Router();

route.get("/", getPost);
route.post("/",verifyUser, createPost);
route.get("/:id", getPostById);
route.delete("/:id", verifyUser, deletePost);
route.patch("/:id", verifyUser, updatePost);
route.post("/:id/like", verifyUser, likePost)




module.exports=route