 const { default: mongoose } = require('mongoose');
const postSchema =new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true         // whitesapce remove
    },
     description:{
        type: String,
        unique:true,
        required: true
    },
     draft:{
        type: Boolean,
        required: false
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})


const post =mongoose.model("post", postSchema)
module.exports =  post