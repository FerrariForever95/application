const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.loginUser);
router.post('/resend-otp', authController.resendOTP);

// Protected routes
router.get('/me', protect, authController.getMe);

module.exports = router;