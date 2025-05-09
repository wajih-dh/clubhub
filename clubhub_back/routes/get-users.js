const express = require('express');
const router = express.Router();
const User = require('../models/user'); 


router.get('/', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users); 
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
});

module.exports = router;
