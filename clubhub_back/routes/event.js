const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.getAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// CREATE event (POST)
router.post('/', async (req, res) => {
  const { title, description, date, time, location, organisator_id } = req.body;

  if (!title || !date || !time || !organisator_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      organisator_id
    });
    res.json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.json({ message: 'Error creating event', error: err.message });
  }
});

// UPDATE event
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Event.update(id, req.body);
    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Event.delete(id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
});

module.exports = router;
