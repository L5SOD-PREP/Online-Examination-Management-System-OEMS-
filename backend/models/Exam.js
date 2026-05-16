const db = require('../config/db');

class Exam {
  static async create(examTitle, duration, totalMarks, passingMarks) {
    const [result] = await db.execute(
      'INSERT INTO exams (exam_title, duration, total_marks, passing_marks) VALUES (?, ?, ?, ?)',
      [examTitle, duration, totalMarks, passingMarks]
    );
    return result.insertId;
  }

  static async findById(examId) {
    const [rows] = await db.execute(
      'SELECT * FROM exams WHERE exam_id = ?',
      [examId]
    );
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM exams ORDER BY created_at DESC');
    return rows;
  }

  static async update(examId, examTitle, duration, totalMarks, passingMarks) {
    await db.execute(
      'UPDATE exams SET exam_title = ?, duration = ?, total_marks = ?, passing_marks = ? WHERE exam_id = ?',
      [examTitle, duration, totalMarks, passingMarks, examId]
    );
  }

  static async delete(examId) {
    await db.execute('DELETE FROM exams WHERE exam_id = ?', [examId]);
  }

  static async getQuestionsCount(examId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM questions WHERE exam_id = ?',
      [examId]
    );
    return rows[0].count;
  }
}

module.exports = Exam;
