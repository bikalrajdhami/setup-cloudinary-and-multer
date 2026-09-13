const express= require("express");
const { getPost, createPost,  getPostById, deletePost, updatePost, likePost } = require("../Controller/postController");
const verifyUser = require("../middleware/auth");
const { addCommentPost, deleteCommentPost, updateCommentPost, likeComment } = require("../Controller/commentController");
const upload = require("../Utils/multer");

const route =express.Router();

route.get("/", getPost);
route.post("/",verifyUser, upload.single("image"), createPost);
route.get("/:id", getPostById);
route.delete("/:id", verifyUser, deletePost);
route.patch("/:id", verifyUser, upload.single("image"), updatePost);
route.post("/:id/like", verifyUser, likePost)
route.post("/:id/comment", verifyUser, addCommentPost)
route.delete("/:id/comment", verifyUser, deleteCommentPost)
route.patch("/:id/comment", verifyUser, updateCommentPost)
route.post("/:id/comment-like", verifyUser, likeComment)




module.exports=route