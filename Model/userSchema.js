 const { default: mongoose } = require('mongoose');
const userSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
     email:{
        type: String,
        unique:true,
        required: true
    },
     password:{
        type: String,
        required: true
    },
      posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"post",
            
        }],
        verify:{
            type:Boolean,
            default:false,
        }
},{timestamps:true})


const User =mongoose.model("user", userSchema)
module.exports =  User