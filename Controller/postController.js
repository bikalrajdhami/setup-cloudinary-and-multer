
const Post = require("../Model/postSchema");
const HandleError = require("../Utils/handleError");
const User = require("../Model/userSchema");



async function getPost(req, res) {
try {
        const users = await Post.find()
        return res.status(200).json({
            success:true,
            message:"User fetch successfully",
            users
        });
        
    } catch (error) {
       return HandleError(res,error)
    }
    
}


async function createPost(req, res) {
    try {
        const { title, description, draft } = req.body;
        const creator = req.user;

        if (!title || !description ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Check if user exists
        const findUser = await User.findById(creator);

        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            });
        }

        // Create post
        const newPost = await Post.create({
            title,
            description,
            draft,
            creator
        });

        // Add post ID to user's posts array
        await User.findByIdAndUpdate(
            creator,
            { $push: { posts: newPost._id } }
        );

        return res.status(200).json({
            success: true,
            message: "Post Created Successfully",
            post: newPost
        });

    } catch (error) {
        return HandleError(res, error);
    }
}

// getpost by Id
async function getPostById(req, res) {
    try {
        const {id}=req.params;
       const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({success:false, message:"Post not found"})
        }

        return res.status(200).json({
            success: true,
            message: "Post fetch Successfully",
            posts: post
        });

    } catch (error) {
        return HandleError(res, error);
    }
}

//Delete Post

async function deletePost(req, res) {
    try {
       const {id}= req.params
       const creator = req.user
       
       console.log(id)

        const post = await Post.findById(id)
       
        if(!post){
          return res.status(404).json({success:false, message:"Post not found"});
        }
            if(creator !== post.creator.toString()){
            return res.status(403).json({success:false, message:"You can delete your own account"})
        }
        await post.deleteOne({_id: id})
         await User.findByIdAndUpdate(
            creator,
            { $pull: { posts: post._id } }
        );
        return res.status(200).json({
            success:true,
            message:"Post deleted successfully",
          
        });
        
    } catch (error) {
       return HandleError(res,error)
    }
}
 


module.exports ={getPost, createPost,getPostById,deletePost }