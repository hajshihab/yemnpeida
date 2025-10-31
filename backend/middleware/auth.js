const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'الرجاء تسجيل الدخول للمتابعة'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'الرجاء تسجيل الدخول مجدداً'
    });
  }
};

// Check if user is editor or admin
exports.isEditor = (req, res, next) => {
  if (req.user.role === 'editor' || req.user.role === 'admin' || req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'ليس لديك صلاحية للتحرير'
    });
  }
};

// Check if user is admin or super_admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'ليس لديك صلاحية المدير'
    });
  }
};

// Check if user is super_admin only
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'ليس لديك صلاحية المدير الرئيسي'
    });
  }
};

// Optional authentication (user can be authenticated or not)
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
