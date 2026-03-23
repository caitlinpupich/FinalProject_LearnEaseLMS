const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, admin } = require('../middleware/auth');



//----------------------------------------------------------------
//--ADMIN COURSE MANAGEMENT ROUTES--
//--------------------------------------------------------------

// 1. CREATE A COURSE (Requirement: Admin adds courses)
router.post('/courses/add', protect, admin, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        instructor: req.body.instructor,
        contentUrl: req.body.contentUrl,
        contentType: req.body.contentType
    });

    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
        console.log("Course created:", newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.log("Error in POST:", err.message);
    }
});

//2. DELETE A COURSE (Requirement: Admin deletes courses)
router.delete('/courses/:id', protect, admin, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        console.log("✅ Course deleted successfully:", course.title);
        res.json({ message: "Course deleted successfully" });

    } catch (err) {
        console.log("❌ Error in DELETE:", err.message);
        res.status(500).json({ message: err.message });
    }
});


//----------------------------------------------------------------
//--ADMIN USER MANAGEMENT ROUTES--
//--------------------------------------------------------------

// 1. UPDATE USER ROLE OR NAME (Admin action)
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const { fullName, role } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. DELETE USER 
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Get ALL users in the database (Admin only) 
router.get('/users', protect, admin, async (req, res) => {
    try {
        // 1. Find every user in the Collection
        // 2. .select('-password') excludes the password field from the result
        const users = await User.find().select('-password');
        
        // 3. Send the list back to Postman/React
        res.json(users);
    } catch (err) {
        console.error("Error fetching all users:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;