// routes/protected.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Adjust path if needed

// Protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "You have accessed a protected route!" });
});

module.exports = router;
