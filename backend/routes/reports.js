const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getStudentPerformanceReport, getPassFailReport, getExamResultReport } = require('../controllers/reportController');

router.get('/student/:studentId', authMiddleware, getStudentPerformanceReport);
router.get('/passfail/:examId', authMiddleware, getPassFailReport);
router.get('/exam/:examId', authMiddleware, getExamResultReport);

module.exports = router;
