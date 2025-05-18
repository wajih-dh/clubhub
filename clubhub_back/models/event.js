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
  getAcceptedEvents: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM events where status = 'accepted'", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  getPendingEvents: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM events where status = 'pending'", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  getRefusedEvents: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM events where status = 'refused'", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  create: async (eventData) => {
    const { title, description, date, time, location, user_id } = eventData;
    const [result] = await db.query(
      `INSERT INTO events (title, description, date, time, location, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [title, description, date, time, location, user_id]
    );    
    return { id: result.insertId, ...eventData };
  },
  
  update: (id, { title, description, date, time, location, user_id }) => {
    const query = `UPDATE events
                   SET title = ?, description = ?, date = ?, time = ?, location = ?, user_id = ?
                   WHERE event_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [title, description, date, time, location, user_id, id], (err, result) => {
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
  },
  updateStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      const validStatuses = ['pending', 'accepted', 'refused'];
      if (!validStatuses.includes(status)) {
        return reject(new Error('Invalid status value.'));
      }
  
      const query = 'UPDATE events SET status = ? WHERE event_id = ?';
      db.query(query, [status, id], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) {
          return reject(new Error('Event not found.'));
        }
        resolve(result);
      });
    });
  },
  getAcceptedEventsByOrganizerWithParticipants: (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // First, get accepted events by organizer
      const [events] = await db.promise().query(
        'SELECT * FROM events WHERE user_id = ? AND status = "accepted"',
        [userId]
      );

      // For each event, get its participants
      for (const event of events) {
        const [participants] = await db.promise().query(
          'SELECT name, email FROM participants WHERE event_id = ?',
          [event.event_id]
        );
        event.participants = participants;
      }

      resolve(events);
    } catch (err) {
      reject(err);
    }
  });
}

};

module.exports = Event;
