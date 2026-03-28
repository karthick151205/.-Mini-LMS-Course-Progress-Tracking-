const mongoose = require('mongoose');

// 1. Define what a SINGLE LESSON looks like
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['reading', 'quiz'], default: 'reading' },
  order: Number
});

// 2. Define what a SINGLE CHAPTER looks like (it contains an array of lessons)
const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: Number,
  lessons: [lessonSchema] // <--- This nests the lessons inside the chapter
});

// 3. Define the MAIN COURSE (it contains an array of chapters)
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  level: { type: String, default: 'Beginner' },
  chapters: [chapterSchema] // <--- This nests the chapters inside the course
});

module.exports = mongoose.model('Course', courseSchema);