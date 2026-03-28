const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Import all controller functions
const { 
  registerUser, 
  loginUser, 
  updateProgress, 
  getProgress 
} = require('../controllers/userController');

// ── 🔐 Auth Routes ─────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login', loginUser);

// ── 📈 Progress & Grading Routes ───────────────────────────────
// POST: Save a lesson completion and/or a quiz grade
router.post('/progress', updateProgress);

// GET: Fetch completed lesson IDs for a specific user
router.get('/progress/:userId', getProgress);

// ── 👥 Admin: Student Roster ───────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Access Denied." });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching roster." });
  }
});

// ── 🗑️ Admin: Delete User ──────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'admin') return res.status(403).json({ message: "Unauthorised" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;