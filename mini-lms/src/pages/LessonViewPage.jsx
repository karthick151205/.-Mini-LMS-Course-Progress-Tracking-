import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';
import QuizView from '../components/QuizView';

function LessonViewPage({ progress }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completedLessons, markComplete } = progress;

  // Find lesson, chapter and course from data
  let foundLesson = null;
  let foundChapter = null;
  let foundCourse = null;

  for (const course of courses) {
    for (const chapter of course.chapters) {
      const lesson = chapter.lessons.find(l => l.id === parseInt(lessonId));
      if (lesson) {
        foundLesson = lesson;
        foundChapter = chapter;
        foundCourse = course;
        break;
      }
    }
  }

  // Handle invalid lesson
  if (!foundLesson) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Lesson not found.</p>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(foundLesson.id);

  // Find prev and next lessons for navigation
  const allLessons = foundCourse.chapters.flatMap(ch => ch.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === foundLesson.id);
  const prevLesson = allLessons[currentIndex - 1] || null;
  const nextLesson = allLessons[currentIndex + 1] || null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(`/course/${foundCourse.id}`)}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Back to {foundCourse.title}
        </button>
        {isCompleted && (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-8">

        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-2">
          {foundCourse.title} → {foundChapter.title}
        </p>

        {/* Lesson Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {foundLesson.title}
        </h1>

        {/* Type Badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full
          ${foundLesson.type === 'quiz'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-blue-100 text-blue-700'}`}>
          {foundLesson.type}
        </span>

        {/* Lesson Content */}
        {foundLesson.type !== 'quiz' && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">
              {foundLesson.content}
            </p>

            {/* Mark Complete Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              {isCompleted ? (
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                  <span>✓</span>
                  <span>Lesson completed</span>
                </div>
              ) : (
                <button
                  onClick={() => markComplete(foundLesson.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Content */}
        {foundLesson.type === 'quiz' && (
          <div className="mt-6">
            <QuizView
              quiz={foundLesson.quiz}
              lessonId={foundLesson.id}
              isCompleted={isCompleted}
              markComplete={markComplete}
            />
          </div>
        )}

        {/* Prev / Next Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/lesson/${prevLesson.id}`)}
              className="text-sm text-blue-500 hover:underline"
            >
              ← {prevLesson.title}
            </button>
          ) : <div />}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="text-sm text-blue-500 hover:underline"
            >
              {nextLesson.title} →
            </button>
          ) : <div />}
        </div>

      </div>
    </div>
  );
}

export default LessonViewPage;