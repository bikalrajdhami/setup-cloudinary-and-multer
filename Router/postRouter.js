const express= require("express");
const { getPost, createPost,  getPostById, deletePost, updatePost, likePost } = require("../Controller/postController");
const verifyUser = require("../middleware/auth");
const upload = require("../Utils/multer");

const route =express.Router();

route.get("/", getPost);
route.post("/",verifyUser, upload.single("image"), createPost);
route.get("/:id", getPostById);
route.delete("/:id", verifyUser, deletePost);
route.patch("/:id", verifyUser, upload.single("image"), updatePost);
route.post("/:id/like", verifyUser, likePost)




module.exports=route