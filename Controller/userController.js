const User = require("../Model/userSchema");
const { generateJWT, verifyJWT } = require("../Utils/generateToken");
const HandleError = require("../Utils/handleError");
const bcrypt = require("bcrypt");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../Utils/sendEmail");


async function getUser(req, res) {
try {
        const users = await User.find()
        return res.status(200).json({
            success:true,
            message:"User fetch successfully",
            users
        });
        
    } catch (error) {
       return HandleError(res,error)
    }
    
}


// createUser
async function createUser(req, res){
     try {
        const {name, email, password} = req.body

        if(!name || !password || !email){
            return res.status(400).json({
                success:false,
                message:"please fill all fields",
            });
        }
        
       const checkforexitUser = await User.findOne({email})
   
       if(checkforexitUser){
          if(checkforexitUser.verify){

        return res.status(400).json({
            success:false,
            message:"User already registered with this email"
        });
    }else{
          let token = await generateJWT({
    id: checkforexitUser._id,
    email:checkforexitUser.email,
})
await sendVerificationEmail(checkforexitUser.email, token)

       return res.status(200).json({
        success:true,
        message:"Please check your Email to verify your account",
       
       });
    }
}
let hashPassword = await bcrypt.hash(password, 10);

const newUser = await User.create({
  name,
  email,
  password: hashPassword
});
let token = await generateJWT({
    id: newUser._id,
    email:newUser.email,
})
await sendVerificationEmail(newUser.email, token)

       return res.status(200).json({
        success:true,
        message:"Please check your Email to verify your account",
        users: newUser
       });
        
    } catch (error) {
          return HandleError(res,error,"Failed to create user");
    }
}


// UserLogin
async function userlogin(req, res){
     try {
        const { email, password} = req.body

        if(!password || !email){
            return res.status(400).json({
                success:false,
                message:"please fill all fields",
            });
        }
        
       const checkforexitUser = await User.findOne({email})

       if(!checkforexitUser){
        return res.status(400).json({
            success:false,
            message:"Not Register"
        })
       }
       let token = await generateJWT({id: checkforexitUser._id,email:checkforexitUser.email})
       if(!checkforexitUser.verify){
           await sendVerificationEmail(checkforexitUser.email, token)
        return res.status(200).json({
            success:true,
            message:"Please check Your Email to verify your account"
        });
    }
        let hashPassword = await bcrypt.compare(password, checkforexitUser.password)
    if(!hashPassword){
        return res.status(400).json({
            success:false,
            message:"wrong candidate",

        });
    }
        // let token =await generateJWT({email:checkforexitUser.email, id:checkforexitUser._id})
       return res.status(200).json({
        success:true,
        message:"user login sucessfully",
        user:{
            id:checkforexitUser._id,
            email:checkforexitUser.email,
               name:checkforexitUser.name,
               posts:checkforexitUser.posts,
        },
        token
       });
        
    } catch (error) {
        return HandleError(res, error,"Failed to create user")
    }
}


// getUserby Id

async function getByUser(req, res) {
try {
       const {id}= req.params
       console.log(id)

        const user = await User.findById(id)
        return res.status(200).json({
            success:true,
            message:"User fetch successfully",
            users:user
        });
        
    } catch (error) {
       return HandleError(res,error)
    }
    
}

// delete user
async function deleteuser(req, res) {
try {
       const {id}= req.params
       const creator = req.user
       
       console.log(id)

        const user = await User.findById(id)
       
        if(!user){
          return res.status(404).json({success:false, message:"user not found"});
        }
            if(creator !==user._id.toString()){
            return res.status(403).json({success:false, message:"You can delete your own account"})
        }
        await User.deleteOne({_id: id})
        return res.status(200).json({
            success:true,
            message:"User deleted successfully",
          
        });
        
    } catch (error) {
       return HandleError(res,error)
    }
    
}


// updateuser
async function updateuser(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password} = req.body;
        const creator =req.user

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (creator !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can update only your own account"
            });
        }

        let hashPassword = user.password;

        if (password) {
            hashPassword = await bcrypt.hash(password, 10);
        }

        await User.updateOne(
            { _id: id },
            {
                name,
                email,
                password: hashPassword
            }
        );

        const updateUser = await User.findById(id);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updateUser
        });

    } catch (error) {
        return HandleError(res, error);
    }
}

async function verifyToken(req, res) {
    try {
        const { verificationToken } = req.params;
        const token= await verifyJWT(verificationToken)

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Invalid Token/ Email Expired"
            });
        }
        const {id}=token
        const user = await User.findById(id)
      if(!user){
       return res.status(404).json({success: false, message:"User not found"})
      }
      await User.updateOne({_id:id}, {verify:true})
      return res.status(200).json({
        success:true,
        message:"Email verified successfully!",
      });
      
    } catch (error) {
        return HandleError(res, error);
    }
}

async function forgotPassword(req, res) {
    try {
        const { email} = req.body;


        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email is required"
            });
        }
        const user = await User.findOne({email})
      if(!user){
       return res.status(404).json({success: false, message:"User not found"})
      }
     let token = await generateJWT({email: user.email, id: user._id})
     await sendResetPasswordEmail(user.email, token);
      return res.status(200).json({
        success:true,
        message:"Password reset link sent to your email",
      });
      
    } catch (error) {
        return HandleError(res, error);
    }
}
module.exports={getUser, createUser, getByUser, deleteuser, updateuser, userlogin, verifyToken,forgotPassword}