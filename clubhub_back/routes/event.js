const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Event = require('../models/event');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all events (for Admin and Student roles)
router.get('/', authMiddleware, async (req, res) => {
  const { role } = req.user;
  if (role !== 'Admin' && role !== 'Student') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const event = await Event.getAll();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err.message });
  }
});

// Create a new event (only Organisator or Admin)
router.post('/', authMiddleware, async (req, res) => {
  const { role, userId } = req.user;
  if (role !== 'Organisator' && role !== 'Admin') {
    return res.status(403).json({ message: 'Only organisator or admin can create event' });
  }

  try {
    const eventId = await Event.create({ ...req.body, organisator_id: userId });
    res.status(201).json({ message: 'Event created', eventId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
});

module.exports = router;
