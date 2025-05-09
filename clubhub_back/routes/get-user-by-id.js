const express = require('express');
const router = express.Router();
const User = require('../models/user');
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.getUserById(userId); 
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;
  