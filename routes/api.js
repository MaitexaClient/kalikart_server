const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');

// -----------------------------Login---------------------------------------
router.post('/login', loginController.login);
// -----------------------------Register---------------------------------------
router.post('/register', registrationController.register);

module.exports = router;
