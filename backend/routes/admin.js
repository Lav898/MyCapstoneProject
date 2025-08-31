const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const User = require('../models/User');

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;