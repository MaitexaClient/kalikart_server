const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

// ===============================================================================
// ------------------------------Common API--------------------------------------------
// ===============================================================================

// -----------------------------Common Login--------------------------------------
router.post('/login', loginController.login);

// -----------------------------Products--------------------------------------
router.get('/view-products', userController.viewProducts);
router.get('/view-product/:id', userController.viewSingleProduct);
router.get('/filter-product_cat/:id', userController.filterProducts);
router.get(
  '/filter-product_sub_cat/:subcategory',
  userController.filterSubProducts
);
router.get(
  '/filter-product_cat_sub/:category',
  userController.filterCatSubProducts
);
router.get(
  '/filter-product_price/:start/:end',
  userController.filterPriceProducts
);
router.get('/search-product/:searchKey', userController.searchProducts);

module.exports = router;
