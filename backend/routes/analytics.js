const express = require('express');
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');  // Assuming you have a Scheme model
const User = require('../models/user');    // Assuming you have a User model
const router = express.Router();

// Route to get analytics data
router.get('/analytics', async (req, res) => {
  try {
    // Count the number of schemes
    const totalSchemes = await Scheme.countDocuments();
    // Count the number of users
    const totalUsers = await User.countDocuments();

    // Create a data object with the analytics info
    const analyticsData = {
      totalSchemes,
      totalUsers,
    };

    // Send back the response with the data
    res.status(200).json(analyticsData);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: 'Error retrieving analytics data', error: err });
  }
});

module.exports = router;
