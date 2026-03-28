const BASE_URL = "https://mini-lms-course-progress-tracking-api.onrender.com";

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

// ══ PROGRESS TRACKING ════════════════════════════════════════════
export const fetchProgress = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/progress/${userId}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const markLessonComplete = async (userId, courseId, lessonId) => {
  try {
    await fetch(`${BASE_URL}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId, lessonId }),
    });
  } catch (err) {
    console.error("❌ Error updating progress:", err);
  }
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

// ✅ Add a Chapter
export const createChapter = async (courseId, chapterData) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(chapterData),
  });
  return res.json();
};

// ✅ Add a Lesson to a specific Chapter
export const createLesson = async (courseId, chapterId, lessonData) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/lessons`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(lessonData),
  });
  return res.json();
};

// ✅ Delete a Lesson
export const deleteLesson = async (courseId, chapterId, lessonId) => {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
  return res.json();
};