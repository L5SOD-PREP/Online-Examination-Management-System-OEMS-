const db = require('../config/db');

class Result {
  static async create(attemptId, score, totalMarks, percentage, status) {
    const [result] = await db.execute(
      'INSERT INTO results (attempt_id, score, total_marks, percentage, status) VALUES (?, ?, ?, ?, ?)',
      [attemptId, score, totalMarks, percentage, status]
    );
    return result.insertId;
  }

  static async findByAttemptId(attemptId) {
    const [rows] = await db.execute(
      'SELECT * FROM results WHERE attempt_id = ?',
      [attemptId]
    );
    return rows[0];
  }

  static async getByStudentId(studentId) {
    const [rows] = await db.execute(
      'SELECT r.*, a.exam_id, e.exam_title FROM results r JOIN attempts a ON r.attempt_id = a.attempt_id JOIN exams e ON a.exam_id = e.exam_id WHERE a.student_id = ? ORDER BY r.created_at DESC',
      [studentId]
    );
    return rows;
  }

  static async getByExamId(examId) {
    const [rows] = await db.execute(
      'SELECT r.*, a.student_id, s.full_name, s.email FROM results r JOIN attempts a ON r.attempt_id = a.attempt_id JOIN students s ON a.student_id = s.student_id WHERE a.exam_id = ? ORDER BY r.created_at DESC',
      [examId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await db.execute(
      'SELECT r.*, a.student_id, s.full_name, a.exam_id, e.exam_title FROM results r JOIN attempts a ON r.attempt_id = a.attempt_id JOIN students s ON a.student_id = s.student_id JOIN exams e ON a.exam_id = e.exam_id ORDER BY r.created_at DESC'
    );
    return rows;
  }
}

module.exports = Result;
