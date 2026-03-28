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

// 3. CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message });
  }
};

// 4. ADD CHAPTER
const addChapter = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $push: { chapters: req.body } },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: 'Error adding chapter', error: err.message });
  }
};

// 5. ADD LESSON (OR QUIZ)
const addLesson = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const course = await Course.findOneAndUpdate(
      { _id: courseId, "chapters._id": chapterId },
      { $push: { "chapters.$.lessons": req.body } },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: 'Error adding lesson', error: err.message });
  }
};

// 6. UPDATE LESSON (OR QUIZ) - NEW! 🚀
const updateLesson = async (req, res) => {
  try {
    const { courseId, chapterId, lessonId } = req.params;
    const course = await Course.findOneAndUpdate(
      { _id: courseId, "chapters._id": chapterId, "chapters.lessons._id": lessonId },
      { $set: { "chapters.$[chap].lessons.$[less]": req.body } },
      { 
        arrayFilters: [{ "chap._id": chapterId }, { "less._id": lessonId }],
        new: true 
      }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// 7. DELETE LESSON - NEW! 🚀
const deleteLesson = async (req, res) => {
  try {
    const { courseId, chapterId, lessonId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { "chapters.$[chap].lessons": { _id: lessonId } } },
      { arrayFilters: [{ "chap._id": chapterId }], new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
};

// 8. DELETE CHAPTER - NEW! 🚀
const deleteChapter = async (req, res) => {
  try {
    const { id, chapterId } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      { $pull: { chapters: { _id: chapterId } } },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
};

// 9. DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Export all functions
module.exports = { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  addChapter, 
  addLesson, 
  updateLesson, 
  deleteLesson, 
  deleteChapter, 
  deleteCourse 
};