const express = require('express');
const router = express.Router();
const { authMiddleware, requireTeacherOrAdmin } = require('../middleware/auth');
const { getQuestionsByExam, getQuestionById, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');

router.get('/exam/:examId', authMiddleware, getQuestionsByExam);
router.get('/:id', authMiddleware, getQuestionById);
router.post('/', authMiddleware, requireTeacherOrAdmin, createQuestion);
router.put('/:id', authMiddleware, requireTeacherOrAdmin, updateQuestion);
router.delete('/:id', authMiddleware, requireTeacherOrAdmin, deleteQuestion);

module.exports = router;
