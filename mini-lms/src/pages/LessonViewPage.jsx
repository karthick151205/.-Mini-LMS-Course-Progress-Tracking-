import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCourses } from '../api';
import QuizView from '../components/QuizView';
import useProgress from '../hooks/useProgress';
import Navbar from '../components/Navbar';

function LessonViewPage({ user, setUser }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // 🛡️ Admin Check
  const isAdmin = user?.role === 'admin';

  const progress = useProgress(user?._id);
  const completedLessons = progress?.completedLessons || [];
  const markComplete = progress?.markComplete;

  const [foundLesson, setFoundLesson] = useState(null);
  const [foundChapter, setFoundChapter] = useState(null);
  const [foundCourse, setFoundCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().then(courses => {
      let found = false;
      for (const course of courses || []) {
        for (const chapter of course.chapters || []) {
          const lesson = (chapter.lessons || []).find(l => l._id === lessonId);
          if (lesson) {
            setFoundLesson(lesson);
            setFoundChapter(chapter);
            setFoundCourse(course);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      setLoading(false);
    });
  }, [lessonId]);

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
    </div>
  );

  if (!foundLesson || !foundCourse) return <div className="p-20 text-center text-stone-500">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(foundLesson._id);
  const allLessons = (foundCourse.chapters || []).flatMap(ch => ch.lessons || []);
  const currentIndex = allLessons.findIndex(l => l._id === foundLesson._id);
  const prevLesson = allLessons[currentIndex - 1] || null;
  const nextLesson = allLessons[currentIndex + 1] || null;
  const isQuiz = foundLesson.type === 'quiz';

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} setUser={setUser} />

      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/course/${foundCourse._id}`)} className="text-sm text-stone-400 hover:text-amber-600 flex items-center gap-1.5 transition-all">
            ← Back to {foundCourse.title}
          </button>

          {/* 💡 Only show "Completed" badge for Students */}
          {!isAdmin && isCompleted && (
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 rounded-full">✓ Completed</span>
          )}

          {/* 🛠️ Admin Indicator */}
          {isAdmin && (
            <span className="text-[10px] font-black uppercase bg-stone-900 text-amber-500 px-3 py-1 rounded-full tracking-tighter">Admin Preview Mode</span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-xs text-stone-400 font-medium mb-3">{foundChapter.title}</p>
        <div className="flex items-start gap-3 mb-6">
          <h1 className="text-3xl font-black text-stone-800 tracking-tighter uppercase">{foundLesson.title}</h1>
          <span className={`mt-1 text-[10px] font-black px-3 py-1 rounded-full ring-1 ${isQuiz ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-sky-50 text-sky-700 ring-sky-200'}`}>
            {isQuiz ? 'QUIZ' : 'LESSON'}
          </span>
        </div>

        {/* --- READING CONTENT --- */}
        {!isQuiz && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <p className="text-stone-600 text-sm leading-7 whitespace-pre-line">{foundLesson.content}</p>

            {/* 💡 Completion Button - Only for Students */}
            {!isAdmin && (
              <div className="mt-6 pt-5 border-t border-stone-100">
                {isCompleted ? (
                  <div className="text-emerald-600 font-bold text-sm">✓ Lesson completed</div>
                ) : (
                  <button onClick={() => markComplete?.(foundLesson._id, foundCourse._id)} className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-6 py-3 rounded-xl transition-all active:scale-95">
                    MARK AS COMPLETE
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- QUIZ CONTENT --- */}
        {isQuiz && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
            <QuizView
              quiz={foundLesson.quiz}
              lessonId={foundLesson._id}
              courseId={foundCourse._id}
              isCompleted={isCompleted}
              markComplete={markComplete}
              isAdmin={isAdmin} // 💡 Pass isAdmin to hide submission logic
            />
          </div>
        )}

        {/* --- NAVIGATION --- */}
        <div className="mt-8 flex justify-between gap-4">
          {prevLesson && (
            <button onClick={() => navigate(`/lesson/${prevLesson._id}`)} className="text-xs font-bold text-stone-400 hover:text-amber-500 transition-all">← {prevLesson.title}</button>
          )}
          {nextLesson && (
            <button onClick={() => navigate(`/lesson/${nextLesson._id}`)} className="ml-auto text-xs font-bold text-stone-400 hover:text-amber-500 transition-all">{nextLesson.title} →</button>
          )}
        </div>
      </main>
    </div>
  );
}

export default LessonViewPage;