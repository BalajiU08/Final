// middleware/roles.js

const verifyRole = (requiredRole) => {
    return (req, res, next) => {
      try {
        if (!req.user || req.user.role !== requiredRole) {
          return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
      } catch (err) {
        res.status(500).json({ message: 'Error verifying role', error: err.message });
      }
    };
  };
  
  module.exports = verifyRole;
  