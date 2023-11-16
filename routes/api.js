const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');

// -----------------------------Login---------------------------------------
router.get('/login', loginController.login);
// -----------------------------Register---------------------------------------
router.get('/register', registrationController.register);

module.exports = router;
