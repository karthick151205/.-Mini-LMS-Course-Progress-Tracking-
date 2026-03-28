const User = require('../models/User');

// ✅ Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = (email === "admin@gmail.com") ? "admin" : "student";
    const user = await User.create({ name, email, password, role });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── 🚀 NEW: Update Progress & Save Grades ──────────────────────
const updateProgress = async (req, res) => {
  try {
    const { userId, lessonId, courseId, gradeData } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Mark lesson as completed (if not already)
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
    }

    // 2. 📊 Record Quiz Grade (if data was sent)
    if (gradeData) {
      user.quizGrades.push({
        lessonId: gradeData.lessonId,
        courseId: gradeData.courseId,
        score: gradeData.score,
        totalQuestions: gradeData.totalQuestions,
        percentage: gradeData.percentage,
        completedAt: new Date()
      });
    }

    await user.save();
    res.status(200).json({ message: "Progress synchronized successfully", user });
  } catch (err) {
    console.error("Progress Sync Error:", err);
    res.status(500).json({ message: "Failed to sync progress" });
  }
};

// ── 📝 NEW: Get Progress ───────────────────────────────────────
const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.completedLessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress" });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  updateProgress, 
  getProgress 
};