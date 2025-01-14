// backend/models/scheme.js

const mongoose = require('mongoose');

// Define the schema for Scheme
const schemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    annualIncome: { type: Number, required: true },
});

// Create a model based on the schema
const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;
