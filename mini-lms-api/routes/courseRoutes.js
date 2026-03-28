const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware'); 

// Import all 9 functions from your updated controller
const {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  addChapter,
  addLesson,
  updateLesson,  // 🚀 Added
  deleteLesson,  // 🚀 Added
  deleteChapter  // 🚀 Added
} = require('../controllers/courseController');

// ─── Public Routes (Students & Admins) ──────────────────────
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// ─── Protected Routes (Only Admins) ─────────────────────────

// 1. Course Operations
router.post('/', verifyAdmin, createCourse); 
router.delete('/:id', verifyAdmin, deleteCourse);

// 2. Chapter Operations
router.post('/:id/chapters', verifyAdmin, addChapter);
router.delete('/:id/chapters/:chapterId', verifyAdmin, deleteChapter); // 🚀 Added

// 3. Lesson Operations (Covers both Reading and Quizzes)
router.post('/:courseId/chapters/:chapterId/lessons', verifyAdmin, addLesson);

// 💡 Update/Edit a Lesson or Quiz
router.put('/:courseId/chapters/:chapterId/lessons/:lessonId', verifyAdmin, updateLesson); // 🚀 Added

// 💡 Delete a specific Lesson or Quiz
router.delete('/:courseId/chapters/:chapterId/lessons/:lessonId', verifyAdmin, deleteLesson); // 🚀 Added

module.exports = router;