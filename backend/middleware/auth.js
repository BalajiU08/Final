const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust if needed

const verifyToken = async (req, res, next) => {
    // Extract the token from the "Authorization" header (Bearer token)
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) return res.status(401).send({ message: 'Access Denied. No token provided.' });

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists using the verified userId from the token
        const user = await User.findById(verified.userId); // Make sure 'userId' is used instead of 'id'
        if (!user) return res.status(400).send({ message: 'Invalid Token. User not found.' });

        // Attach the user object to the request
        req.user = user; // Attach user to request
        next();
    } catch (err) {
        res.status(400).send({ message: 'Invalid Token', error: err.message });
    }
};

// Authorization Middleware
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access forbidden: Insufficient role' });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };  // Corrected export
module.exports = verifyToken;