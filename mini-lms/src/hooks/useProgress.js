import { useState, useEffect } from 'react';
import { fetchProgress, markLessonComplete } from '../api';

function useProgress(userId) {
  const [completedLessons, setCompletedLessons] = useState([]);

  // ✅ Load progress safely
  useEffect(() => {
    if (!userId) return;
    fetchProgress(userId).then(data => {
      setCompletedLessons(Array.isArray(data) ? data : []);
    });
  }, [userId]);

  // ✅ Updated: Mark lesson complete (Now accepts optional gradeData)
  const markComplete = async (lessonId, courseId, gradeData = null) => {
    if (completedLessons.includes(lessonId)) return;

    // Optimistic Update: Update UI immediately
    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);

    try {
      // 🎯 Now passing gradeData to the API call
      await markLessonComplete(userId, courseId, lessonId, gradeData);
    } catch (err) {
      console.error("❌ markComplete error:", err);
      // Rollback UI if the server fails
      setCompletedLessons(prev => prev.filter(id => id !== lessonId));
    }
  };

  // ✅ Toggle lesson
  const toggleLesson = async (lessonId, courseId) => {
    try {
      if (completedLessons.includes(lessonId)) {
        const updated = completedLessons.filter(id => id !== lessonId);
        setCompletedLessons(updated);
        // If un-toggling, we don't usually send grades, just sync the completion
        await markLessonComplete(userId, courseId, lessonId);
      } else {
        // Default to no gradeData for simple reading lessons
        await markComplete(lessonId, courseId);
      }
    } catch (err) {
      console.error("❌ toggleLesson error:", err);
    }
  };

  // ✅ Calculate progress safely
  const getProgress = (lessons) => {
    if (!Array.isArray(lessons) || lessons.length === 0) return 0;

    const done = lessons.filter(l =>
      completedLessons.includes(l._id)
    ).length;

    return Math.round((done / lessons.length) * 100);
  };

  return {
    completedLessons,
    markComplete,
    toggleLesson,
    getProgress,
  };
}

export default useProgress;