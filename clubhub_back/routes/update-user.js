const express = require('express');
const router = express.Router();
const User = require('../models/user');
router.put('/:id', async (req, res) => {
  const { username, email, role } = req.body;
  const userId = req.params.id;

  if (!username || !email || !role) {
    return res.status(400).json({ error: 'Username, email, and role are required' });
  }

  try {
    const updatedUser = await User.updateById({
      id: userId,
      username,
      email,
      role,
      // Don't send password if you don't want to update it
    });

    if (updatedUser.affectedRows === 0) {  // If no rows were affected, the user doesn't exist
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
