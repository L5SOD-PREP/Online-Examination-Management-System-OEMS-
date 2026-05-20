const db = require('../config/db');

class User {
  static async create(fullName, email, password, role = 'student') {
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, password, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async getAllByRole(role) {
    const [rows] = await db.execute('SELECT user_id, full_name, email, role, created_at FROM users WHERE role = ?', [role]);
    return rows;
  }

  static async update(userId, fullName, email) {
    await db.execute(
      'UPDATE users SET full_name = ?, email = ? WHERE user_id = ?',
      [fullName, email, userId]
    );
  }

  static async delete(userId) {
    await db.execute('DELETE FROM users WHERE user_id = ?', [userId]);
  }
}

module.exports = User;
