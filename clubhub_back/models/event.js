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

  create: async (eventData) => {
    const { title, description, date, time, location, organisator_id } = eventData;
    const [result] = await db.query(
      `INSERT INTO events (title, description, date, time, location, organisator_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, location, organisator_id]
    );
    return { id: result.insertId, ...eventData };
  },
  
  update: (id, { title, description, date, time, location, organisator_id }) => {
    const query = `UPDATE events
                   SET title = ?, description = ?, date = ?, time = ?, location = ?, organisator_id = ?
                   WHERE event_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [title, description, date, time, location, organisator_id, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  delete: (id) => {
    const query = 'DELETE FROM events WHERE event_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
  
};

module.exports = Event;
