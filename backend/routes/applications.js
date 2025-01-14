const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const Scheme = require('../models/scheme');
const User = require('../models/user');
const verifyToken = require('../middleware/auth'); // Correct the path to use 'auth.js'

// Apply for a scheme
router.post('/apply/:schemeId', verifyToken, async (req, res) => {
    try {
      console.log('User:', req.user); // Debugging line to see if user info is set
      
      const userId = req.user.id; // This should now be available
      const schemeId = req.params.schemeId;
  
      // Check if the scheme exists
      const scheme = await Scheme.findById(schemeId);
      if (!scheme) {
        return res.status(400).send({ message: 'Scheme not found' });
      }
  
      // Check if the user has already applied for this scheme
      const existingApplication = await Application.findOne({ user: userId, scheme: schemeId });
      if (existingApplication) {
        return res.status(400).send({ message: 'You have already applied for this scheme' });
      }
  
      const newApplication = new Application({
        user: userId,
        scheme: schemeId
      });
  
      await newApplication.save();
      res.status(201).send({ message: 'Application submitted successfully', application: newApplication });
    } catch (err) {
      res.status(400).send({ message: 'Error applying for scheme', error: err.message });
    }
  });
 

// Get user applications
router.get('/my-applications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId }).populate('scheme');
    res.status(200).send({ message: 'Applications fetched successfully', applications });
  } catch (err) {
    res.status(400).send({ message: 'Error fetching applications', error: err.message });
  }
});

module.exports = router;
