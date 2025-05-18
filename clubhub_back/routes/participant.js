const express = require('express');
const router = express.Router();
const Participant = require('../models/participant');

router.post('/', async (req, res) => {
  const { event_id, name, email } = req.body;

  try {
    const result = await Participant.add({ event_id, name, email });
    res.status(201).json({ message: 'Successfully registered for event!', result });
  } catch (err) {
    console.error('❌ Error adding participant:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
