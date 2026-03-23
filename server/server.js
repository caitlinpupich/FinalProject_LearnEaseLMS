const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads your .env file


const app = express();

const Course = require('./models/Course'); // Import Course schema
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

// --- MIDDLEWARE ---
app.use(cors()); // Allows React app to talk to this server
app.use(express.json()); // Allows the server to understand JSON data sent from React
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/discussion', discussionRoutes);



// --- DATABASE CONNECTION ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("✅ MongoDB Connection Established Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});