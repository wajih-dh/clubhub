const db = require('../db');

const Participant = {
  add: ({ event_id, name, email }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO participants (event_id, name, email) VALUES (?, ?, ?)',
        [event_id, name, email],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, event_id, name, email });
        }
      );
    });
  }
};

module.exports = Participant;
