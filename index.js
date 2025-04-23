const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
require('dotenv').config(); // loads .env file

require('./config/passport'); // Google login config (we’ll create this next)

const authRoutes = require('./routes/auth'); // Auth routes (login/logout)
const blogRoutes = require('./routes/blog'); // Blog routes (create/view blogs)
const commentRoutes = require('./routes/comment'); // Comment routes

const app = express();
const PORT = process.env.PORT || 5000;

// Allow frontend to make requests (from React running on localhost:3000)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json()); // allows Express to parse JSON in requests

// Store login session in a cookie
app.use(cookieSession({
  name: 'session',
  keys: ['secret'],
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));

// Initialize Passport (for Google login)
app.use(passport.initialize());
app.use(passport.session());

// Use the routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
