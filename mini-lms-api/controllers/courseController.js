const Course = require('../models/Course');

// 1. GET ALL COURSES
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 2. GET ONE COURSE
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 3. CREATE COURSE (Basic details)
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
};

// 4. ADD CHAPTER TO COURSE (New logic)
const addChapter = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $push: { chapters: req.body } }, // req.body should be { title: "Chapter Name", order: 1 }
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: 'Error adding chapter', error: err.message });
  }
};

// 5. ADD LESSON TO CHAPTER (New logic)
const addLesson = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const course = await Course.findOneAndUpdate(
      { _id: courseId, "chapters._id": chapterId },
      { $push: { "chapters.$.lessons": req.body } }, // req.body is lesson data
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: 'Error adding lesson', error: err.message });
  }
};

// 6. DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Export all 6 functions
module.exports = { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  addChapter, 
  addLesson, 
  deleteCourse 
};