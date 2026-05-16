const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getQuestionsByExam, getQuestionById, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');

router.get('/exam/:examId', getQuestionsByExam);
router.get('/:id', getQuestionById);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
