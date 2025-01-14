const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const Scheme = require('../models/scheme');
const verifyToken = require('../middleware/auth');
const Application = require('../models/application');
const Grievance = require('../models/grievance');
const checkRole = require('../middleware/roles'); 
// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, age, occupation, annualIncome, aadharNumber, role } = req.body;

  // Validate Aadhaar number
  if (!/^\d{12}$/.test(aadharNumber)) {
    return res.status(400).json({ message: 'Invalid Aadhaar number. It must be 12 digits.' });
    }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Check if Aadhaar number is already registered
    const existingAadhar = await User.findOne({ aadharNumber });
    if (existingAadhar) {
        return res.status(400).json({ message: 'Aadhaar number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        age,
        occupation,
        annualIncome,
        aadharNumber,
        role: role === 'Admin' ? 'Admin' : 'User'
    });
    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password, aadharNumber } = req.body;
    
    // Validate Aadhaar number
    if (!/^\d{12}$/.test(aadharNumber)) {
        return res.status(400).json({ message: 'Invalid Aadhaar number. It must be 12 digits.' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify Aadhaar number
        if (user.aadharNumber !== aadharNumber) {
            return res.status(400).json({ message: 'Aadhaar number does not match' });
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

// Fetch user profile with applied schemes
router.get('/profile', verifyToken, async (req, res) => {
    const userId = req.user._id; // Use the user from req.user after token verification

    try {
        const user = await User.findById(userId).populate('appliedSchemes'); // Populate applied schemes

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            age: user.age,
            occupation: user.occupation,
            email: user.email,
            appliedSchemes: user.appliedSchemes // This will show detailed scheme data
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

// POST route to apply for a scheme
router.post('/applications/apply/:schemeId', verifyToken, async (req, res) => {
    try {
        const schemeId = req.params.schemeId;
        const userId = req.user._id; // User ID from the token

        // Fetch the user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the scheme details
        const scheme = await Scheme.findById(schemeId);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        // Check eligibility
        const isEligibleByOccupation = scheme.eligibility.includes(user.occupation);
        const isEligibleByIncome = user.annualIncome <= scheme.annualIncome;

        if (!isEligibleByOccupation && !isEligibleByIncome) {
            return res.status(403).json({
                message: 'You are not eligible for this scheme based on your occupation or annual income',
            });
        }

        // Check if the user has already applied for the scheme
        const existingApplication = await Application.findOne({ user: userId, scheme: schemeId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this scheme' });
        }

        // Create a new application
        const application = new Application({
            user: userId,
            scheme: schemeId,
        });

        await application.save();
        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error applying for the scheme', error: error.message });
    }
});

// Update User Route (PUT)
router.put('/update/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params; // Get userId from the URL parameter
    const { name, email, age, occupation } = req.body; // Fields to be updated

    // Ensure the userId in the token matches the one in the URL (user can only update their own profile)
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ message: 'You can only update your own profile' });
    }

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate fields (e.g., email format and age)
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (age && isNaN(age)) {
            return res.status(400).json({ message: 'Age must be a number' });
        }

        // Update the user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.age = age || user.age;
        user.occupation = occupation || user.occupation;

        // Save the updated user to the database
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete a user route
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Grievance Form Submission
router.post('/grievance', verifyToken, async (req, res) => {
    const { aadharNumber, description } = req.body;

    try {
        // Verify the user's Aadhaar number
        const user = await User.findOne({ _id: req.user._id, aadharNumber });

        if (!user) {
            return res.status(404).json({ message: 'User with this Aadhaar not found' });
        }

        // Save grievance to the database
        const newGrievance = new Grievance({
            user: req.user._id,
            aadharNumber,
            description,
        });

        await newGrievance.save();
        res.status(201).json({ message: 'Grievance submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting grievance', error });
    }
});

// Fetch user by Aadhaar number (admin only)
router.get('/users/aadhaar/:aadharNumber', verifyToken, checkRole('Admin'), async (req, res) => {
    const { aadharNumber } = req.params;

    try {
        console.log('Received Aadhaar Number:', aadharNumber);  // Log the received Aadhaar number

        const user = await User.findOne({ aadharNumber: String(aadharNumber.trim()) });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this Aadhaar number' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by Aadhaar:', error);  // Log the error for better insights
        res.status(500).json({ message: 'Error fetching user by Aadhaar', error: error.message });
    }
});


// Get all registered users (Admin Only)
router.get('/users', verifyToken, checkRole('Admin'), async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;
