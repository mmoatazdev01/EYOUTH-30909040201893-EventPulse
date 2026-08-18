const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    let user = await User.findById(decoded.userId);
    if (user && typeof user.select === 'function') {
      user = user.select('-password');
    }

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = {
      id: user._id ? user._id.toString() : user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Access denied. Insufficient permission.', 403));
  }
  next();
};

module.exports = { requireAuth, requireRole };
