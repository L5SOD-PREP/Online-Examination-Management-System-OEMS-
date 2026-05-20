const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
