const db = require('../config/db');

class Question {
  static async create(examId, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks = 1) {
    const [result] = await db.execute(
      'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [examId, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks]
    );
    return result.insertId;
  }

  static async findById(questionId) {
    const [rows] = await db.execute(
      'SELECT * FROM questions WHERE question_id = ?',
      [questionId]
    );
    return rows[0];
  }

  static async getByExamId(examId) {
    const [rows] = await db.execute(
      'SELECT * FROM questions WHERE exam_id = ? ORDER BY question_id',
      [examId]
    );
    return rows;
  }

  static async update(questionId, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks) {
    await db.execute(
      'UPDATE questions SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, marks = ? WHERE question_id = ?',
      [questionText, optionA, optionB, optionC, optionD, correctAnswer, marks, questionId]
    );
  }

  static async delete(questionId) {
    await db.execute('DELETE FROM questions WHERE question_id = ?', [questionId]);
  }
}

module.exports = Question;
