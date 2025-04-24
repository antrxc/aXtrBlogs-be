const express = require('express');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST - Create a new blog (admin only)
router.post('/', authMiddleware, async (req, res) => {
  const user = req.user;

  // Only allow admin users (email ends with @axtr.in)
  if (!user.email.endsWith('@axtr.in')) {
    return res.status(403).json({ message: 'Access denied. Not an admin.' });
  }

  const { title, content, image, tags } = req.body;

  try {
    const blog = new Blog({
      title,
      content,
      image,
      tags,
      author: user._id,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog', error: err });
  }
});

// GET - All blogs (for everyone)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err });
  }
});

// GET - Single blog by ID (with virtual comments populated)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email' }
      });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err });
  }
});

module.exports = router;
