const express = require('express');
const router = express.Router();
const multer = require('multer');
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');

// ===========================image upload=====================================
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Kalicart',
  },
});
const upload = multer({ storage: storage });

// ------------------------------Shops--------------------------------------------
// ===============================================================================
// -----------------------------Shop Registration---------------------------------

router.post(
  '/register-shop',
  upload.single('image'),
  registrationController.shopRegister
);



module.exports = router;
