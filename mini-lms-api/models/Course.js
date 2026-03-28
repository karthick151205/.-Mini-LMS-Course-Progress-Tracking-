const mongoose = require('mongoose');

// 1. Updated Lesson Schema to support Quizzes
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // 💡 Changed: required: false because quizzes might not have 'content' text
  content: { type: String, required: false }, 
  type: { 
    type: String, 
    enum: ['reading', 'quiz'], 
    default: 'reading' 
  },
  // 💡 Added: Quiz structure
  quiz: {
    question: { type: String },
    options: [String], // Array of choices (e.g. ["A", "B", "C", "D"])
    correct: { type: Number } // Index of the correct answer (0 to 3)
  },
  order: Number
});

// 2. Chapter Schema (Remains the same)
const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: Number,
  lessons: [lessonSchema] 
});

// 3. Main Course Schema (Remains the same)
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  level: { type: String, default: 'Beginner' },
  chapters: [chapterSchema]
});

module.exports = mongoose.model('Course', courseSchema);