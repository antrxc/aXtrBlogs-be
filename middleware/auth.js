module.exports = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: 'You must be logged in.' });
    }
  
    next();
  };
  