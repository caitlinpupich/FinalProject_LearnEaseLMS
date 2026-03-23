const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); 
const User = require('../models/User'); 
const { protect, authorizeFaculty } = require('../middleware/auth');

// GET ALL COURSES
router.get('/', protect, async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'fullName email') // Get Professor info
            .populate({
                path: 'ratings.userId', // Go into ratings array
                select: 'fullName'      // Only get the student's name
            });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UNENROLL FROM A COURSE
router.put('/drop/:id', protect, async (req, res) => {
    try {
        // 1. Remove the Course ID from the Student's enrolledCourses array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { enrolledCourses: req.params.id }
        });

        // 2. Remove the Student's ID from the Course's enrolledStudents array
        await Course.findByIdAndUpdate(req.params.id, {
            $pull: { enrolledStudents: req.user.id }
        });

        console.log(`❌ User ${req.user.id} dropped course ${req.params.id}`);
        res.json({ message: "Course successfully removed from your curriculum." });
    } catch (err) {
        console.error("Drop Error:", err.message);
        res.status(500).json({ message: "The cancellation spell failed. Server error." });
    }
});

// GET A SINGLE COURSE BY ID
router.get('/:id', protect, async (req, res) => {
    try {
        // req.params.id matches the ":id" in the URL
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found in the Restricted Section' });
        }

        res.json(course);
    } catch (err) {
        console.error(err.message);

        // If the ID is formatted wrong (not a valid MongoDB ObjectId)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(500).send('Server Error');
    }
});

// UPDATE A COURSE 
router.put('/:id', protect, authorizeFaculty, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Options: return the new version & check rules
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        console.log("✅ Course updated:", updatedCourse.title);
        res.json(updatedCourse);
    } catch (err) {
        console.log("❌ Error in UPDATE:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// ENROLL IN A COURSE
router.put('/enroll/:id', protect, async (req, res) => {
    try {
        // 1. Find the Course
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 2. Find the Student (using the ID from 'protect' middleware)
        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: "Student record not found" });
        }

        // 3. Check for double enrollment (Security check on both sides)
        const alreadyInCourse = course.enrolledStudents.includes(req.user.id);
        const alreadyHasCourse = student.enrolledCourses.includes(req.params.id);

        if (alreadyInCourse || alreadyHasCourse) {
            return res.status(400).json({ message: "You are already enrolled in this path." });
        }

        // 4. Update the Course Model
        course.enrolledStudents.push(req.user.id);
        await course.save();

        // 5. Update the User Model
        student.enrolledCourses.push(req.params.id);
        await student.save();

        console.log(`✅ ${student.fullName} successfully enrolled in ${course.title}`);

        res.json({
            message: "Successfully enrolled!",
            courseTitle: course.title
        });

    } catch (err) {
        console.error("❌ Enrollment Error:", err.message);
        res.status(500).json({ message: "Server error during enrollment." });
    }
});


// SUBMIT FEEDBACK AND RATING FOR A COURSE
router.post('/:id/rate', protect, async (req, res) => {
    const { score, comment } = req.body;

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 1. Verify Enrollment: Only students in the class can rate it
        const isEnrolled = course.enrolledStudents.includes(req.user.id);
        if (!isEnrolled) {
            return res.status(403).json({ message: "You must be enrolled to provide feedback." });
        }

        // 2. Prevent Double Feedback: Check if this user already left a rating
        const alreadyRated = course.ratings.find(
            (r) => r.userId.toString() === req.user.id.toString()
        );

        if (alreadyRated) {
            return res.status(400).json({ message: "You have already provided feedback for this course." });
        }

        // 3. Add the feedback to the array (Matching your schema fields)
        const newFeedback = {
            userId: req.user.id,
            score: Number(score),
            comment: comment
        };

        course.ratings.push(newFeedback);
        await course.save();

        res.status(201).json({ message: "Feedback submitted. The Professors thank you!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error: Could not save feedback." });
    }
});

module.exports = router;