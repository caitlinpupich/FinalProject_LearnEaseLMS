const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('x-auth-token');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with a real secret later
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

//Ensure that only admin users can access certain routes.
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // They are an admin! Let them through.
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};

// 3. Check if the user is Faculty OR Admin
const authorizeFaculty = (req, res, next) => {
    // If the role is faculty OR the role is admin, let them in
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Faculty or Admin permissions required" });
    }
};

module.exports = { protect, admin, authorizeFaculty };

