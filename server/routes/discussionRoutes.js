const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');


//GET ALL MESSAGES FOR A COURSE
router.get('/:courseId', protect, async (req, res) => {
    try {
        const messages = await Message.find({ courseId: req.params.courseId })
            .populate('sender', 'fullName role') // Show who sent it
            .sort({ createdAt: 1 }); // Oldest first (chronological)
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "The owl lost the messages." });
    }
});

//POST MESSAGE TO A COURSE DISCUSSION ROOM
router.post('/:courseId', protect, async (req, res) => {
    try {
        const newMessage = new Message({
            courseId: req.params.courseId,
            sender: req.user.id,
            content: req.body.content
        });
        const savedMessage = await newMessage.save();
        
        // Re-populate to send back the full sender info for the UI
        const fullMessage = await Message.findById(savedMessage._id).populate('sender', 'fullName role');
        res.status(201).json(fullMessage);
    } catch (err) {
        res.status(500).json({ message: "Message spell failed." });
    }
});

module.exports = router;