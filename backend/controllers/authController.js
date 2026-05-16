const bcrypt = require('bcrypt');
const Student = require('../models/Student');

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingStudent = await Student.findByEmail(email);
    if (existingStudent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const studentId = await Student.create(fullName, email, hashedPassword);

    res.status(201).json({ message: 'Student registered successfully', studentId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const student = await Student.findByEmail(email);
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.studentId = student.student_id;
    req.session.studentName = student.full_name;

    res.json({
      message: 'Login successful',
      student: {
        studentId: student.student_id,
        fullName: student.full_name,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

const getCurrentUser = (req, res) => {
  if (!req.session.studentId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  res.json({
    studentId: req.session.studentId,
    fullName: req.session.studentName
  });
};

module.exports = { register, login, logout, getCurrentUser };
