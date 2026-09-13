const Comment = require("../model/commentSchema");
const Post = require("../model/postSchema");
const User = require("../model/userSchma");
const handleError = require("../Utils/handleError");
async function addCommentPost(req, res) {
     try {
          const { comment } = req.body;
          const { id } = req.params;
          const creator = req.user;
          if (!comment) {
               return res
                    .status(400)
                    .json({ success: false, message: "Please enter the comment" });
          }
          const findUser = await User.findById(creator);
          if (!findUser) {
               return res
                    .status(404)
                    .json({ success: false, message: "Users Not found" });
          }
          const findPost = await Post.findById(id);
          if (!findPost) {
               return res
                    .status(404)
                    .json({ success: false, message: "Post Not found" });
          }

          const newComment = await Comment.create({ comment, post: id, user: creator })
          await Post.findByIdAndUpdate(id, { $push: { comments: newComment._id } })
          return res.status(201).json({
               success: true,
               message: "Comment create successfully",

          });

     } catch (error) {
          return handleError(res, error)

     }
}
async function deleteCommentPost(req, res) {
     try {
          const { id } = req.params;
          const creator = req.user;
          const findUser = await User.findById(creator);
          if (!findUser) {
               return res
                    .status(404)
                    .json({ success: false, message: "Users Not found" });
          }
          const findComment = await Comment.findById(id);
          if (!findComment) {
               return res
                    .status(404)
                    .json({ success: false, message: "Comment Not found" });
          }
          if (creator !== findComment.user.toString() && creator !== findComment.post.creator.toString()) {
               return res.status(403).json({ success: false, message: "You can only delete your own account" });

          }
          await Post.findByIdAndUpdate(findComment.post._id, { $pull: { comments: id } })
          await Comment.deleteOne({ _id: id })
          return res.status(201).json({
               success: true,
               message: "Comment Delete successfully",

          });

     } catch (error) {
          return handleError(res, error)

     }
}
async function updateCommentPost(req, res) {
     try {
          const { id } = req.params;
          const { comment } = req.body;
          const creator = req.user;
          const findUser = await User.findById(creator);
          if (!findUser) {
               return res
                    .status(404)
                    .json({ success: false, message: "Users Not found" });
          }
          const findComment = await Comment.findById(id);
          if (!findComment) {
               return res
                    .status(404)
                    .json({ success: false, message: "Comment Not found" });
          }
          if (creator !== findComment.user.toString()) {
               return res.status(403).json({ success: false, message: "You can only delete your own account" });

          }
          await Comment.updateOne({ _id: id }, { comment })
          const updateComment = await Comment.findById(id)
          return res.status(200).json({
               success: true,
               message: "Post Update successfully",
               comments: updateComment
          });

     } catch (error) {
          return handleError(res, error)

     }
}
async function likeComment(req, res) {
     try {
          const { id } = req.params
          const creator = req.user
          const comment = await Comment.findById(id)
          if (!comment) {
               return res.status(404).json({ success: false, message: "Comment not found" });
          }
          if (!comment.likes.includes(creator)) {
               await Comment.findByIdAndUpdate(id, { $push: { likes: creator } });
               return res
                    .status(200)
                    .json({ success: true, message: "Comment Liked Successfully" });
          } else {
               await Comment.findByIdAndUpdate(id, { $pull: { likes: creator } });
               return res
                    .status(200)
                    .json({ success: true, message: "Comment Un-Liked Successfully" });
          }


     } catch (error) {
          return handleError(res, error)
     }
}
module.exports = { addCommentPost, deleteCommentPost,likeComment,updateCommentPost,}