const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await User.deleteById(userId); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router;
