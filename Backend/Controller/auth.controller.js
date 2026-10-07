// external Module 
const jwt = require('jsonwebtoken');


// local Module
const User = require('../Model/User.model')
const {sendTokenResponse} = require('../utils/generateTokens');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        user.lastLogin = new Date();

      await user.save();

        // This already generates JWT and sends response
        return sendTokenResponse(user, 201, res,'Registration successful. Please verify your email.'
);

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};

exports.getlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Must use .select('+password') since select: false on schema
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return sendTokenResponse(user, 200, res,"User Login Successfully");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};