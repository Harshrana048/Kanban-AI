const jwt = require('jsonwebtoken');
const User = require('../Model/User.model');

const protect = async (req, res, next) => {
  try {
    // Read token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalid or expired',
    });
  }
};

module.exports = { protect };