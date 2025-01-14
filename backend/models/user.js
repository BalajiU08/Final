const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    occupation: { type: String, required: true },
    annualIncome: { type: Number, required: true }, // Required field
    aadharNumber: { type: String, required: true, unique: true }, // Required and unique
    role: { type: String, default: 'User' }
});

module.exports = mongoose.model('User', userSchema);
