const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Маршрути GET
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);

// Маршрути POST
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

module.exports = router;