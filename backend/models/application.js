// models/application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    status: { type: String, default: 'Pending' }, // you can use 'Pending', 'Approved', etc.
    appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
