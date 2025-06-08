const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'instaFood', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'],
    resource_type: 'auto',
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures", 
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

module.exports = { cloudinary, storage, profileStorage }; 


