import { useState } from 'react';

function useProgress() {

  // Load completed lesson IDs from localStorage on first render
  const [completedLessons, setCompletedLessons] = useState(() => {
    const stored = localStorage.getItem('completedLessons');
    return stored ? JSON.parse(stored) : [];
  });

  // Mark a lesson as complete
  const markComplete = (lessonId) => {
    if (completedLessons.includes(lessonId)) return; // already done
    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem('completedLessons', JSON.stringify(updated));
  };

  // Unmark a lesson (toggle)
  const markIncomplete = (lessonId) => {
    const updated = completedLessons.filter(id => id !== lessonId);
    setCompletedLessons(updated);
    localStorage.setItem('completedLessons', JSON.stringify(updated));
  };

  // Toggle complete/incomplete
  const toggleLesson = (lessonId) => {
    if (completedLessons.includes(lessonId)) {
      markIncomplete(lessonId);
    } else {
      markComplete(lessonId);
    }
  };

  // Calculate progress % for a list of lessons
  const getProgress = (lessons) => {
    if (lessons.length === 0) return 0;
    const done = lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((done / lessons.length) * 100);
  };

  return {
    completedLessons,
    markComplete,
    markIncomplete,
    toggleLesson,
    getProgress,
  };
}

export default useProgress;