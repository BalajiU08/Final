const express = require('express');
const router = express.Router();
const Scheme = require('../models/scheme');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roles');

// Add a new scheme (restricted to Admin role)
router.post('/add', verifyToken, checkRole('Admin'), async (req, res) => {
    const { name, description, eligibility, deadline, annualIncome } = req.body;

    try {
        // Check if scheme with the same name already exists
        const existingScheme = await Scheme.findOne({ name });
        if (existingScheme) {
            return res.status(400).json({ message: 'Scheme with this name already exists' });
        }

        // Create a new scheme
        const newScheme = new Scheme({
            name,
            description,
            eligibility,
            deadline,
            annualIncome,
        });

        // Save the new scheme to the database
        await newScheme.save();
        res.status(201).json({ message: 'Scheme added successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error adding scheme', error: error.message });
    }
});

// Fetch all schemes with optional filters (accessible to all authenticated users)
router.get('/', verifyToken, async (req, res) => {
    const { eligibility, deadline, occupation, annualIncome } = req.query;

    try {
        let filter = {};

        if (eligibility) {
            filter.eligibility = new RegExp(eligibility, 'i'); // Case-insensitive search
        }

        if (deadline) {
            filter.deadline = { $lte: new Date(deadline) }; // Schemes with deadline on or before the specified date
        }

        if (occupation) {
            filter.occupation = new RegExp(occupation, 'i');  // Filter by occupation
        }

        if (annualIncome) {
            const incomeValue = parseFloat(annualIncome);
            if (!isNaN(incomeValue)) {
                filter.annualIncome = { $lte: incomeValue };
            } else {
                return res.status(400).json({ message: 'Invalid annualIncome value' });
            }
        }

        const schemes = await Scheme.find(filter);
        res.status(200).json(schemes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schemes', error: error.message });
    }
});

// Update scheme details (restricted to Admin role)
router.put('/update/:schemeId', verifyToken, checkRole('Admin'), async (req, res) => {
    const { schemeId } = req.params;
    const { name, description, eligibility, deadline, annualIncome } = req.body;

    // Validation: Check for empty fields
    if (!name && !description && !eligibility && !deadline && !annualIncome) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        // Find and update the scheme
        const updatedScheme = await Scheme.findByIdAndUpdate(
            schemeId,
            {
                ...(name && { name }),
                ...(description && { description }),
                ...(eligibility && { eligibility }),
                ...(deadline && { deadline }),
                ...(annualIncome && { annualIncome }),
            },
            { new: true }
        );

        if (!updatedScheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        res.status(200).json({ message: 'Scheme updated successfully', scheme: updatedScheme });
    } catch (error) {
        res.status(500).json({ message: 'Error updating scheme', error: error.message });
    }
});

// Delete a scheme (restricted to Admin role)
router.delete('/delete/:schemeId', verifyToken, checkRole('Admin'), async (req, res) => {
    const { schemeId } = req.params;

    try {
        const deletedScheme = await Scheme.findByIdAndDelete(schemeId);

        if (!deletedScheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        res.status(200).json({ message: 'Scheme deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting scheme', error: error.message });
    }
});

module.exports = router;
