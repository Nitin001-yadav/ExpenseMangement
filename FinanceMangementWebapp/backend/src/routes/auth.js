const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'username exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash });
    await user.save();
    req.session.userId = user._id;
    return res.status(201).json({ message: 'user created', userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    req.session.userId = user._id;
    return res.json({ message: 'logged in' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'logout failed' });
    res.clearCookie('connect.sid');
    return res.json({ message: 'logged out' });
  });
});

// Current user
router.get('/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'unauthorized' });
  const user = await User.findById(req.session.userId).select('-passwordHash');
  return res.json({ user });
});

module.exports = router;
