const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');

// ===============================================================================
// ------------------------------User---------------------------------------------
// ===============================================================================
// -----------------------------User Registration---------------------------------
router.post('/register', registrationController.register);

module.exports = router;
