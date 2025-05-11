const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const events = await Event.getAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// PUT request to update the event status
router.put('/:id/status', async (req, res) => {
  const eventId = req.params.id;  // Get the event ID from the route parameter
  const { status } = req.body;  // Get the status from the request body
  
  // Log the request for debugging purposes
  console.log(`Received PUT request to update event ${eventId} status to ${status}`);

  // Validate the status (optional)
  if (!['accepted', 'refused', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    // Attempt to update the status in the database (replace with your actual model logic)
    const updatedEvent = await Event.updateStatus(eventId, status);

    // If the event was not found, return a 404 error
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // If everything goes well, return a success message
    res.status(200).json({ message: 'Status updated successfully', event: updatedEvent });
  } catch (err) {
    // Log the error for debugging purposes
    console.error('Error updating status:', err);

    // If a specific error occurs, handle it accordingly
    if (err.message === 'Invalid status value.') {
      return res.status(400).json({ message: err.message });
    } else if (err.message === 'Event not found.') {
      return res.status(404).json({ message: err.message });
    }

    // If there is a server error, return a 500 status code
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// Get ACCEPTED events
router.get('/accepted', async (req, res) => {
  try {
    const events = await Event.getAcceptedEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching accepted events', error: err.message });
  }
});

// Get PENDING events
router.get('/pending', async (req, res) => {
  try {
    const events = await Event.getPendingEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending events', error: err.message });
  }
});

// Get REFUSED events
router.get('/refused', async (req, res) => {
  try {
    const events = await Event.getRefusedEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching refused events', error: err.message });
  }
});
  // CREATE event (POST)
  router.post('/', async (req, res) => {
    const { title, description, date, time, location, user_id } = req.body;

    if (!title || !date || !time || !user_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const newEvent = await Event.create({
        title,
        description,
        date,
        time,
        location,
        user_id
      });
      res.json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
      res.json({ message: 'Error creating event', error: err.message })     ;
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
