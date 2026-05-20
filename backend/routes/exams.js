const express = require('express');
const router = express.Router();
const { authMiddleware, requireTeacherOrAdmin } = require('../middleware/auth');
const { getAllExams, getExamById, createExam, updateExam, deleteExam } = require('../controllers/examController');

router.get('/', authMiddleware, getAllExams);
router.get('/:id', authMiddleware, getExamById);
router.post('/', authMiddleware, requireTeacherOrAdmin, createExam);
router.put('/:id', authMiddleware, requireTeacherOrAdmin, updateExam);
router.delete('/:id', authMiddleware, requireTeacherOrAdmin, deleteExam);

module.exports = router;
