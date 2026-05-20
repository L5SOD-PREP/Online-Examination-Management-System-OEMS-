const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - Please login' });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
};

const requireTeacherOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden - Teacher or Admin access required' });
  }
};

module.exports = { authMiddleware, requireAdmin, requireTeacherOrAdmin };
