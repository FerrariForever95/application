const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTP, validateIndianPhoneNumber } = require('../utils/helpers');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { phoneNumber, name } = req.body;

    // Validate phone number
    if (!validateIndianPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Indian phone number'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create new user
    user = await User.create({
      phoneNumber,
      name,
      verificationCode: otp,
      verificationCodeExpires: new Date(expires),
      isVerified: false
    });

    // Send OTP
    await sendOTP(phoneNumber, otp);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. OTP sent to your phone number.',
      data: {
        userId: user._id,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify OTP and login user
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or OTP'
      });
    }

    // Check if OTP matches and is not expired
    if (user.verificationCode !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user (alternative method - direct login if already verified)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!validateIndianPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Indian phone number'
      });
    }

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your OTP first'
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -verificationCode -verificationCodeExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!validateIndianPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Indian phone number'
      });
    }

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found with this phone number'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with new OTP
    user.verificationCode = otp;
    user.verificationCodeExpires = new Date(expires);
    await user.save();

    // Send OTP
    await sendOTP(phoneNumber, otp);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        userId: user._id,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resending OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};