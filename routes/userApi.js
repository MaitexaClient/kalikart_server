const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

// ===============================================================================
// ------------------------------User---------------------------------------------
// ===============================================================================
// -----------------------------User Registration---------------------------------
router.post('/register', registrationController.register);

// -----------------------------User Profile---------------------------------
router.get('/user-profile/:id', userController.userProfile);
// -----------------------------Add to Cart---------------------------------

router.post('/add-cart/:user_id/:prod_id', userController.addToCart);
router.get('/view-cart/:user_id', userController.viewCart);
router.put('/increment-cart/:id', userController.incrementQuantity);
router.put('/decrement-cart/:id', userController.decrementQuantity);
router.post('/add-wishlist/:user_id/:prod_id', userController.addToWishlist);
router.get('/view-wishlist/:user_id', userController.viewWishlist);

module.exports = router;
