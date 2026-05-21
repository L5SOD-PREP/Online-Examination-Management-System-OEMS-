const express = require('express');
const router = express.Router();
const { authMiddleware, requireTeacherOrAdmin, requireAdmin } = require('../middleware/auth');
const { getAllStudents, getAllTeachers, getStudentById, createUser, updateStudent, deleteUser } = require('../controllers/studentController');

router.get('/', authMiddleware, requireTeacherOrAdmin, getAllStudents);
router.get('/teachers', authMiddleware, requireAdmin, getAllTeachers);
router.get('/:id', authMiddleware, requireTeacherOrAdmin, getStudentById);
router.post('/', authMiddleware, requireTeacherOrAdmin, createUser);
router.put('/:id', authMiddleware, requireTeacherOrAdmin, updateStudent);
router.delete('/:id', authMiddleware, requireTeacherOrAdmin, deleteUser);

module.exports = router;
