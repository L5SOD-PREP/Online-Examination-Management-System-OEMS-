const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { startAttempt, submitAnswer, submitExam, getStudentAttempts, getAttemptById } = require('../controllers/attemptController');

router.post('/start', authMiddleware, startAttempt);
router.post('/answer', authMiddleware, submitAnswer);
router.post('/submit', authMiddleware, submitExam);
router.get('/', authMiddleware, getStudentAttempts);
router.get('/:id', authMiddleware, getAttemptById);

module.exports = router;
