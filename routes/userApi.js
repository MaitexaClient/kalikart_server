const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

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

// ===============================================================================
// ------------------------------User---------------------------------------------
// ===============================================================================
// -----------------------------User Registration---------------------------------
router.post('/register', registrationController.register);

// -----------------------------User Profile---------------------------------
router.get('/user-profile/:id', userController.userProfile);
// -----------------------------Update User Profile---------------------------------
router.put(
  '/user-profile-update/:id',
  upload.array('image', 5),
  userController.updateUserProf
);

// -----------------------------Add to Cart---------------------------------

router.post('/add-cart/:user_id/:prod_id', userController.addToCart);
router.get('/view-cart/:user_id', userController.viewCart);
router.put('/increment-cart/:id', userController.incrementQuantity);
router.put('/decrement-cart/:id', userController.decrementQuantity);
router.delete('/delete-cart/:id', userController.deleteFromCart);
router.post('/add-wishlist/:user_id/:prod_id', userController.addToWishlist);
router.get('/view-wishlist/:user_id', userController.viewWishlist);
router.delete('/delete-wishlist/:id', userController.deleteFromWishlist);

module.exports = router;
