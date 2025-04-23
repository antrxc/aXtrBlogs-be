const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Redirects user to Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handles Google callback and redirects to frontend
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT token for session (optional, useful for APIs)
    const token = jwt.sign({
      id: req.user._id,
      role: req.user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send user to frontend with token in URL (or set cookie here)
    res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
  }
);

// Route to get current user info
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;
