const db = require('../db');

const Event = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM events', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: ({ title, description, date, time, location, organisator_id }) => {
    const query = `INSERT INTO events (title, description, date, time, location, organisator_id)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(query, [title, description, date, time, location, organisator_id], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }
};

module.exports = Event;
