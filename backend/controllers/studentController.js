const User = require('../models/User');

const getAllStudents = async (req, res) => {
  try {
    const students = await User.getAllByRole('student');
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    await User.update(id, fullName, email);
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

module.exports = { getAllStudents, getStudentById, updateStudent, deleteStudent };
