const db = require('../config/db');

class Student {
  static async create(fullName, email, password) {
    const [result] = await db.execute(
      'INSERT INTO students (full_name, email, password) VALUES (?, ?, ?)',
      [fullName, email, password]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(studentId) {
    const [rows] = await db.execute(
      'SELECT * FROM students WHERE student_id = ?',
      [studentId]
    );
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT student_id, full_name, email, created_at FROM students');
    return rows;
  }

  static async update(studentId, fullName, email) {
    await db.execute(
      'UPDATE students SET full_name = ?, email = ? WHERE student_id = ?',
      [fullName, email, studentId]
    );
  }

  static async delete(studentId) {
    await db.execute('DELETE FROM students WHERE student_id = ?', [studentId]);
  }
}

module.exports = Student;
