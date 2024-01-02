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
// -----------------------------User add address---------------------------------

router.post('/user-address/:id', userController.addAddress);
// -----------------------------User set primary address---------------------------------

router.put('/user-address/:id/:count', userController.setPrimaryAddress);
// -----------------------------User get all address---------------------------------

router.get('/user-all-address/:id', userController.getUserAddress);

// -----------------------------User get primary address---------------------------------
router.get('/user-primary-address/:id', userController.getUserPrimaryAddress);

// -----------------------------User update address---------------------------------
router.put('/user-address-update/:id', userController.updateUserAddress);

// -----------------------------User delete address---------------------------------
router.delete('/user-del-address/:id', userController.deleteUserAddress);

// -----------------------------Add to Cart---------------------------------

router.post('/add-cart/:user_id/:prod_id', userController.addToCart);
router.get('/view-cart/:user_id', userController.viewCart);
router.put('/increment-cart/:user_id/:id', userController.incrementQuantity);
router.put('/decrement-cart/:user_id/:id', userController.decrementQuantity);
router.delete('/delete-cart/:user_id/:id', userController.deleteFromCart);
router.post('/add-wishlist/:user_id/:prod_id', userController.addToWishlist);
router.get('/view-wishlist/:user_id', userController.viewWishlist);
router.delete(
  '/delete-wishlist/:user_id/:id',
  userController.deleteFromWishlist
);
router.post('/add-orders/:user_id', userController.checkOut);
router.get('/use-wallet/:price/:walletamount', userController.checkOutWallet);
router.post(
  '/update-orders-status/:user_id/:address_id/:status',
  userController.updateOrderStatus
);
router.get('/view-checkout/:user_id', userController.viewCheckout);
router.get('/clear-checkout/:user_id', userController.clearCheckout);
router.get('/view-orders/:user_id', userController.viewOrders);
router.get('/completed-orders/:user_id', userController.filterOrdersCompleted);
router.get('/cancelled-orders/:user_id', userController.filterOrdersCancelled);
router.get('/user-credit-details/:user_id', userController.userCreditDetails);
// router.get('/testClear', userController.testClear);

module.exports = router;
