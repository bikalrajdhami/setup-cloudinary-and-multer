const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
     comment: {
          type: String,
          required: true,
     },
     post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "post",
     },
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
     },
     likes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
     }],
});
const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;