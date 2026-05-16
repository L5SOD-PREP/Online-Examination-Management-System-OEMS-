const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getStudentResults, getResultByAttemptId, getAllResults } = require('../controllers/resultController');

router.get('/', authMiddleware, getStudentResults);
router.get('/attempt/:attemptId', authMiddleware, getResultByAttemptId);
router.get('/all', getAllResults);

module.exports = router;
