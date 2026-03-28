//const BASE_URL = "https://mini-lms-course-progress-tracking-api.onrender.com";
const BASE_URL = "http://localhost:5000";

// ── Helpers ──────────────────────────────────────────────────────
const getStoredUser = () => JSON.parse(localStorage.getItem("user"));

const getAdminHeaders = () => {
  const user = getStoredUser();
  return {
    "Content-Type": "application/json",
    "x-user-role": user?.role || "student", 
  };
};

// ══ AUTHENTICATION ═══════════════════════════════════════════════
export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ══ COURSES (STUDENT & ADMIN) ════════════════════════════════════
export const fetchCourses = async () => {
  const res = await fetch(`${BASE_URL}/api/courses`);
  return res.json();
};

export const fetchCourseById = async (courseId) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}`);
  return res.json();
};

// ══ PROGRESS & GRADING TRACKING ═══════════════════════════════════

// ✅ Fetch progress for a specific user
export const fetchProgress = async (userId) => {
  try {
    // Note: Updated path to /api/users/progress to match your new routes
    const res = await fetch(`${BASE_URL}/api/users/progress/${userId}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// ✅ Updated: Mark lesson complete + Send Grade Data 🚀
export const markLessonComplete = async (userId, courseId, lessonId, gradeData = null) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId, 
        courseId, 
        lessonId, 
        gradeData // 🎯 This passes the score to the backend for the dashboard
      }),
    });
    return res.json();
  } catch (err) {
    console.error("❌ Error updating progress/grades:", err);
  }
};

// ══ ADMIN: USER & ROSTER MANAGEMENT ═══════════════════════════════

export const fetchAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    headers: getAdminHeaders(), 
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const user = getStoredUser();
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: { 
        'Content-Type': 'application/json',
        'x-user-role': user?.role 
    }
  });
  return res.json();
};

// ══ ADMIN: COURSE MANAGEMENT ═════════════════════════════════════
export const createCourse = async (courseData) => {
  const res = await fetch(`${BASE_URL}/api/courses`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(courseData),
  });
  return res.json();
};

export const deleteCourse = async (courseId) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
  return res.json();
};

// ══ ADMIN: CHAPTER & LESSON MANAGEMENT ═══════════════════════════

export const createChapter = async (courseId, chapterData) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(chapterData),
  });
  return res.json();
};

export const deleteChapter = async (courseId, chapterId) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters/${chapterId}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
  return res.json();
};

export const createLesson = async (courseId, chapterId, lessonData) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/lessons`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(lessonData),
  });
  return res.json();
};

export const updateLesson = async (courseId, chapterId, lessonId, lessonData) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify(lessonData),
  });
  return res.json();
};

export const deleteLesson = async (courseId, chapterId, lessonId) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
  return res.json();
};