const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware'); 

// Import all 6 functions from your updated controller
const {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  addChapter, // 👈 Added
  addLesson   // 👈 Added
} = require('../controllers/courseController');

// ─── Public Routes (Students & Admins) ──────────────────────
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// ─── Protected Routes (Only Admins) ─────────────────────────
// 1. Basic Course Operations
router.post('/', verifyAdmin, createCourse); 
router.delete('/:id', verifyAdmin, deleteCourse);

// 2. Chapter Operations
// URL looks like: /api/courses/67890/chapters
router.post('/:id/chapters', verifyAdmin, addChapter);

// 3. Lesson Operations
// URL looks like: /api/courses/67890/chapters/12345/lessons
router.post('/:courseId/chapters/:chapterId/lessons', verifyAdmin, addLesson);

module.exports = router;