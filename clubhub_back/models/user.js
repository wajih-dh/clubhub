const db = require('../db');
const bcrypt = require('bcryptjs');

const User = {
  create: async ({ username, email, password, role = 'User' }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [username, email, hashedPassword, role], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  findByEmail: (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE user_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // Return first user found
      });
    });
  },
};

module.exports = User;