const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');

// ===============================================================================
// ------------------------------Common API--------------------------------------------
// ===============================================================================

// -----------------------------Common Login--------------------------------------
router.post('/login', loginController.login);

module.exports = router;
