const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorizeFaculty } = require('../middleware/auth');


//Get current user profile (with enrolled courses)
router.get('/profile', protect, async (req, res) => {
    try {
        // 1. Find the user by ID (from the token)
        // 2. .populate('enrolledCourses') swaps IDs for full Course data
        const user = await User.findById(req.user.id)
            .select('-password') // Hide the hashed password
            .populate({
                path: 'enrolledCourses',
                populate: { path: 'instructor', select: 'fullName' } // Also get the Professor's name!
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("❌ Profile Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all students
router.get('/students', protect, authorizeFaculty, async (req, res) => {
    try {
        // Find users where role is 'learner'
        // We still hide the password for security!
        const students = await User.find({ role: 'learner' }).select('-password');
        
        res.json(students);
    } catch (err) {
        console.error("❌ Error fetching students:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;

