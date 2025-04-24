const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST - Add comment to a blog post
router.post('/:blogId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;

  try {
    const comment = new Comment({
      content,
      blog: blogId,
      author: req.user._id,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error posting comment', error: err });
  }
});

// GET - Get comments for a blog post
router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err });
  }
});

module.exports = router;
