const express = require('express');
const User = require('../models/user'); // Import User model

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password, role = 'Student' } = req.body;

  try {
    const userId = await User.create({ username, email, password, role });
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

module.exports = router;