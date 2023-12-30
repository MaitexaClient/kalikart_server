const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');
const shopsController = require('../controllers/shopsController');

// ===========================image upload=====================================
const multer = require('multer');

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
  upload.array('image', 5),
  registrationController.shopRegister
);
// -----------------------------Shop Profile---------------------------------
router.get('/shop-profile/:id', shopsController.shopProfile);
// -----------------------------Update Shop Profile---------------------------------
router.put(
  '/shop-profile-update/:id',
  upload.array('image', 5),
  shopsController.updateShopProf
);

// -----------------------------Products--------------------------------------
router.post(
  '/add-product',
  upload.array('image', 5),
  shopsController.addProduct
);

router.put(
  '/update-product/:id',
  upload.array('image', 5),
  shopsController.updateProduct
);

router.delete('/delete-product/:id', shopsController.deleteProduct);

module.exports = router;
