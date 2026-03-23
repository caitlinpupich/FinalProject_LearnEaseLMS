const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose to look in the Users collection
        required: true
    },
    // Requirement: Support diverse content types
    contentUrl: {
        type: String, // Link to video recording or PDF
        required: true
    },
    contentType: {
        type: String,
        enum: ['video', 'pdf', 'live-link'],
        default: 'video'
    },
    // Requirement: Ratings and Feedback
    ratings: [
        {
            userId: String,
            score: { type: Number, min: 1, max: 5 },
            comment: String
        }
    ],
    // Requirement: Enrollment tracking
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', CourseSchema);