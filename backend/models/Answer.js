const db = require('../config/db');

class Answer {
  static async create(attemptId, questionId, selectedAnswer, isCorrect) {
    const [result] = await db.execute(
      'INSERT INTO answers (attempt_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)',
      [attemptId, questionId, selectedAnswer, isCorrect]
    );
    return result.insertId;
  }

  static async getByAttemptId(attemptId) {
    const [rows] = await db.execute(
      'SELECT * FROM answers WHERE attempt_id = ?',
      [attemptId]
    );
    return rows;
  }

  static async update(attemptId, questionId, selectedAnswer, isCorrect) {
    await db.execute(
      'UPDATE answers SET selected_answer = ?, is_correct = ? WHERE attempt_id = ? AND question_id = ?',
      [selectedAnswer, isCorrect, attemptId, questionId]
    );
  }

  static async deleteByAttemptId(attemptId) {
    await db.execute('DELETE FROM answers WHERE attempt_id = ?', [attemptId]);
  }
}

module.exports = Answer;
