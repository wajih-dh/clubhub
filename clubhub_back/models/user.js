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
  updateById: async ({ id, username, email, role, password }) => {
    let query = 'UPDATE users SET username = ?, email = ?, role = ? WHERE user_id = ?';
    const values = [username, email, role, id];
  
    // Only update the password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE user_id = ?';
      values.splice(2, 0, hashedPassword); // Insert hashedPassword at the correct position
    }
  
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  
  

  deleteById: (id) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  getAllUsers: () => {
    const query = 'SELECT * FROM users';
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results); 
      });
    });
  },
};

module.exports = User;