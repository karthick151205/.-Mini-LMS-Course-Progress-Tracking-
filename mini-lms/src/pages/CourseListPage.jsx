import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { fetchCourses } from '../api';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import useProgress from '../hooks/useProgress';

function CourseListPage({ user, setUser }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Identify Admin status
  const isAdmin = user?.role === 'admin';

  const progress = useProgress(user?._id);
  const completedLessons = progress?.completedLessons || [];
  const getProgress = progress?.getProgress || (() => 0);

  useEffect(() => {
    fetchCourses()
      .then(data => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const allLessons = courses.flatMap(c =>
    (c.chapters || []).flatMap(ch => ch.lessons || [])
  );
  const totalLessons = allLessons.length;
  const totalCompleted = completedLessons.filter(id =>
    allLessons.some(l => l._id === id)
  ).length;
  const overallPct =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  
  const completedCourses = courses.filter(course => {
    const lessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
    return getProgress(lessons) === 100;
  }).length;

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
    </div>
  );

  const stats = [
    { value: courses.length, label: 'Total Courses', icon: '📚', color: 'text-stone-700', bg: 'bg-stone-50', border: 'border-stone-200' },
    { value: completedCourses, label: 'Completed', icon: '🏆', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { value: `${totalCompleted}/${totalLessons}`, label: 'Lessons Done', icon: '🎬', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
    { value: `${overallPct}%`, label: 'Overall Progress', icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', progress: overallPct },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} setUser={setUser} />

      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-stone-800 tracking-tighter uppercase">
            {isAdmin ? 'Course Library' : 'My Learning'}
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {isAdmin ? 'Preview and manage your educational content' : 'Keep learning — you\'re doing great!'}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── 💡 Stats Grid (HIDDEN FOR ADMIN) ────────────────────── */}
        {!isAdmin && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon, color, bg, border, progress: prog }) => (
              <div key={label} className={`${bg} border ${border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all`}>
                <span className="text-xl mb-2 block">{icon}</span>
                <p className={`text-2xl font-bold ${color} leading-none`}>{value}</p>
                <p className="text-xs text-stone-400 font-medium mt-1 uppercase tracking-wider">{label}</p>
                {prog !== undefined && (
                  <div className="mt-3 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${prog}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 🛠️ Admin Quick Link ────────────────────────────────── */}
        {isAdmin && (
          <div className="bg-stone-900 rounded-3xl p-8 border border-stone-800 flex justify-between items-center shadow-xl">
            <div>
              <p className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-1">Management</p>
              <h2 className="text-white text-xl font-bold">You are in Admin Preview Mode</h2>
            </div>
            <button 
              onClick={() => navigate('/admin')}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded-xl font-black text-xs transition-all active:scale-95"
            >
              OPEN ADMIN HUB
            </button>
          </div>
        )}

        {/* ── Course Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              progress={{ completedLessons, getProgress }}
              isAdmin={isAdmin} // 💡 Pass isAdmin here to hide progress inside cards
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CourseListPage;