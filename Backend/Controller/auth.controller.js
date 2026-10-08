// external Module 
const jwt = require('jsonwebtoken');


// local Module
const User = require('../Model/User.model')
const { sendTokenResponse } = require('../utils/generateTokens');
const { generateVerificationToken, VerifyEmailToken, DeleteToken } = require('../utils/verificationToken');
const { sendEmail } = require('../utils/sendemail');



//  @POST /api/auth/register
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

    const token = await generateVerificationToken(user._id);

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const EmailResult = await sendEmail({
      to: user.email,
      subject: 'FlowMind — Verify your email',
      html: verificationEmailTemplate(user.name, verifyUrl),
    });

    if (!EmailResult.success) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//  @GET /api/auth/verify-email/:token

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = await VerifyEmailToken(token);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired. Please request a new one.',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. Please login.',
      });
    }

    user.isEmailVerified = true;
    user.lastLogin = new Date();
    await user.save();
    await DeleteToken(userId, token);
    sendTokenResponse(user, 200, res, 'Email verified successfully. You are now logged in.')

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
}

//  @POST /api/auth/resend-verification

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    // Prevent email enumeration — same response whether user exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a verification link has been sent.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified. Please login.',
      });
    }

    // Generate new token — old one auto-deleted in generateVerificationToken
    const token = await generateVerificationToken(user._id);
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendEmail({
      to: user.email,
      subject: 'FlowMind — Verify your email (resent)',
      html: verificationEmailTemplate(user.name, verifyUrl),
    });

    res.status(200).json({
      success: true,
      message: 'Verification email resent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
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

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        isVerified: false, 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return sendTokenResponse(user, 200, res, "User Login Successfully");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

//  @GET /api/auth/me

exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toSafeObject(),
  });
};

// @POST /api/auth/logout

exports.logout = (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
};