const express = require('express');
const router = express.Router();
const Grievance = require('../models/grievance');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roles');

// Submit a grievance (User)
router.post('/submit', verifyToken, async (req, res) => {
    const { aadharNumber, description } = req.body;

    // Validate Aadhaar number
    if (!/^\d{12}$/.test(aadharNumber)) {
        return res.status(400).json({ message: 'Invalid Aadhaar number. It must be 12 digits.' });
    }

    try {
        const grievance = new Grievance({
            user: req.user._id,
            aadharNumber,
            description,
        });

        await grievance.save();
        res.status(201).json({ message: 'Grievance submitted successfully', grievance });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting grievance', error: error.message });
    }
});

// View all grievances (Admin)
router.get('/all', verifyToken, checkRole('Admin'), async (req, res) => {
    try {
        const grievances = await Grievance.find().populate('user', 'name email');
        res.status(200).json(grievances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grievances', error: error.message });
    }
});

// Update grievance status (Admin)
router.put('/update/:id', verifyToken, checkRole('Admin'), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const grievance = await Grievance.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        res.status(200).json({ message: 'Grievance status updated successfully', grievance });
    } catch (error) {
        res.status(500).json({ message: 'Error updating grievance status', error: error.message });
    }
});

// View user's grievances (User)
router.get('/my-grievances', verifyToken, async (req, res) => {
    try {
        const grievances = await Grievance.find({ user: req.user._id });
        res.status(200).json(grievances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grievances', error: error.message });
    }
});

module.exports = router;
