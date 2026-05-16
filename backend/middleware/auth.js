const Student = require('../models/Student');

const authMiddleware = async (req, res, next) => {
  if (!req.session || !req.session.studentId) {
    return res.status(401).json({ error: 'Unauthorized - Please login' });
  }

  try {
    const student = await Student.findById(req.session.studentId);
    if (!student) {
      req.session.destroy();
      return res.status(401).json({ error: 'Student not found' });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
