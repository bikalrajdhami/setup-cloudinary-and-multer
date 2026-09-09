const cloudinary = require("cloudinary").v2;

async function uploadImage(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath);

        return result;
    } catch (error) {
        console.log("Error uploadImage", error);
        throw error;
    }
}

// delete image
async function deleteImage(imageId) {
    try {
        const result = await cloudinary.uploader.destroy(imageId);

        return result;
    } catch (error) {
        console.log("Error deleteImage", error);
        throw error;
    }
}

module.exports = {
    uploadImage,
    deleteImage
};