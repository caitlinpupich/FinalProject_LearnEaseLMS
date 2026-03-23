const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// REGISTER (Public)
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // 2. Create new user (The Mongoose 'pre-save' hook will hash the password automatically!)
        user = new User({ fullName, email, password, role });

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN (Public)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // 1. Create the Payload (the data inside the token)
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // 2. Sign the Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Make sure this is in your .env file!
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                
                // 3. Send the token PLUS the user data
                res.json({
                    token, // <-- This is the "missing" string!
                    message: "Login successful!",
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;