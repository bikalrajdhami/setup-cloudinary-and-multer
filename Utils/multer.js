const multer  = require('multer')
const path  = require('path')
const upload = multer({ 
    storage: multer.diskStorage({
        destination:"uploads/",
        filename:(req,file,next)=>{
            next(null,Date.now() + path.extname(file.originalname))
        }
    }),
    limits:{
        fileSize: 5* 1024 *1024
    }
 })
 module.exports =upload;