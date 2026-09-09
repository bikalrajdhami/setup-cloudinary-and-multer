
const Post = require("../Model/postSchema");
const HandleError = require("../Utils/handleError");
const User = require("../Model/userSchema");
const fs =require("fs");
const { uploadImage, deleteImage } = require("../Utils/uploadImage");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });



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
        const image = req.file.path

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
        const { public_id, secure_url } = await uploadImage(image);
        fs.unlinkSync(image)
        const postId = title.lowercase().split(" ").join("-") +"-"+ randomUUID();
        // const postId = title.tolowerCase().replace(/[a^a-z,0-9\s]/9, "").trim().split(/\s+/).join("-")+"-"+randomUUID();
        const newPost = await Post.create({
            title,
            description,
            draft,
            creator,
            imageUrl: secure_url,
            imageId: public_id,
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
       const post = await Post.findOne({postId:id});
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
        await deleteImage(post.imageId);
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



async function updatePost(req,res){
    try {
        const {id} = req.params
        const creator =req.user
        const {title, description,draft} = req.body;
        const image=req.file.path;
        const post = await Post.findById(id)
        if(!post){
            return res.status(404).json({success:false, message:"Post not found"})

        }
        if(creator !== post.creator.toString()){
            return res.status(403).json({success:false, message:"You can only update your own account"})
        }
        const updateData ={
            title:title || post.title, description: description || post.description,
            draft:draft || post.draft,
        };
       if(image){
        await deleteImage(post.imageId);
        const {public_id, secure_url}= await uploadImage(image);
        updateData.imageUrl= secure_url;
        updateData.imageId = public_id;
       
        fs.unlinkSync(image)
       }

       await Post.updateOne({_id:id},{$set: updateData})
       const updatePost = await Post.findById(id)
       return res.status(200).json({
        success:true,
        message:"Post Update Successfully",
        posts: updatepost
       });
        
    } catch (error) {
        return HandleError(res,error);
    }

}

async function likePost(req,res){
  try {
    const {id} = req.params
    const creator =req.user
    const post = await Post.findById(id)
    if(!post){
        return res.status(404).json({success:false, message:"Post not found"});
    }
    if(!post.likes.includes(creator)){
        await Post.findByIdAndUpdate(id,{ $push:{likes:creator}});
        return res.status(200).json({success:true, message:"Post Liked Successfully"});

    }else{
        await Post.findByIdAndUpdate(id,{$pull:{likes:creator}});
        return res.status(200).json({success:true, message:"Post Un-Liked Succesfully"});
    }
    
  } catch (error) {
    return HandleError(res, error)
  }
}
module.exports ={getPost, createPost,getPostById,deletePost, updatePost, likePost }