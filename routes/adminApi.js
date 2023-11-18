const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');

// ===============================================================================
// ------------------------------Admin--------------------------------------------
// ===============================================================================
//----------------------------Add city--------------------------------------------
router.post('/add-city', adminController.addCity);
router.get('/view-city', adminController.viewCity);
router.get('/view-city/:id', adminController.viewSingleCity);

//----------------------------Add category--------------------------------------------

router.post('/add-category', adminController.addCategory);
router.get('/view-category', adminController.viewCategory);
router.get('/view-category/:id', adminController.viewSingleCategory);












// -----------------------------------------------------------------------------------
module.exports = router;
