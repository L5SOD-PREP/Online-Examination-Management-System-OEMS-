const db = require('../config/db');

class Attempt {
  static async create(studentId, examId) {
    const [result] = await db.execute(
      'INSERT INTO attempts (student_id, exam_id, start_time) VALUES (?, ?, NOW())',
      [studentId, examId]
    );
    return result.insertId;
  }

  static async findById(attemptId) {
    const [rows] = await db.execute(
      'SELECT * FROM attempts WHERE attempt_id = ?',
      [attemptId]
    );
    return rows[0];
  }

  static async getByStudentId(studentId) {
    const [rows] = await db.execute(
      'SELECT a.*, e.exam_title FROM attempts a JOIN exams e ON a.exam_id = e.exam_id WHERE a.student_id = ? ORDER BY a.created_at DESC',
      [studentId]
    );
    return rows;
  }

  static async getByExamId(examId) {
    const [rows] = await db.execute(
      'SELECT * FROM attempts WHERE exam_id = ?',
      [examId]
    );
    return rows;
  }

  static async updateStatus(attemptId, status) {
    await db.execute(
      'UPDATE attempts SET status = ?, end_time = NOW() WHERE attempt_id = ?',
      [status, attemptId]
    );
  }

  static async getInProgressAttempt(studentId, examId) {
    const [rows] = await db.execute(
      'SELECT * FROM attempts WHERE student_id = ? AND exam_id = ? AND status = "in_progress"',
      [studentId, examId]
    );
    return rows[0];
  }
}

module.exports = Attempt;
