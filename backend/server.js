const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users');
const schemeRoutes = require('./routes/schemes');
const applicationRoutes = require('./routes/applications');
const authMiddleware = require('./middleware/auth'); // Corrected path
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

dotenv.config(); // Load environment variables
const app = express();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api', usersRouter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);

// Protected route example
app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "You have accessed a protected route!" });
});

// Default route for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Port configuration
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
