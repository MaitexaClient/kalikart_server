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

module.exports = router;
