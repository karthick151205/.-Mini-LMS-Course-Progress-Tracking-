import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, fetchCourses } from '../api';

export default function GradingDashboard({ user }) {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    else loadGrades();
  }, [user]);

  const loadGrades = async () => {
    setLoading(true);
    const [userData, courseData] = await Promise.all([fetchAllUsers(), fetchCourses()]);
    
    // Flatten all quiz grades from all students into one master list
    const allGrades = userData.flatMap(student => 
      (student.quizGrades || []).map(grade => {
        const course = courseData.find(c => c._id === grade.courseId);
        return {
          ...grade,
          studentName: student.name,
          courseTitle: course?.title || 'Unknown Course'
        };
      })
    ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    setGrades(allGrades);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-black uppercase tracking-widest">Compiling Grades...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      {/* ── Shared Sidebar ── */}
      <aside className="w-72 bg-stone-900 border-r border-stone-800 flex flex-col py-10 px-6 flex-shrink-0 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/20"><span className="text-2xl">⚡</span></div>
          <p className="text-white font-black text-lg italic">LMS PRO</p>
        </div>
        <nav className="space-y-3 flex-1">
          <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-4 px-5 py-4 text-stone-500 hover:text-white hover:bg-stone-800/50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"><span>📚</span> Course Manager</button>
          <button onClick={() => navigate('/admin/roster')} className="w-full flex items-center gap-4 px-5 py-4 text-stone-500 hover:text-white hover:bg-stone-800/50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"><span>👥</span> Student Roster</button>
          <button className="w-full flex items-center gap-4 px-5 py-4 bg-amber-500 text-stone-950 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/10"><span>📊</span> Grading Dashboard</button>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Quiz Performance</h1>
          <p className="text-stone-500 text-sm font-bold mt-1">Real-time breakdown of all student quiz submissions</p>
        </header>

        <div className="grid gap-4">
          <div className="bg-stone-900 rounded-[2.5rem] border border-stone-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-800/50 border-b border-stone-700">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Course</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Score</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {grades.map((g, i) => (
                  <tr key={i} className="hover:bg-stone-800/30 transition-all">
                    <td className="px-8 py-6 font-bold text-stone-200 uppercase text-xs">{g.studentName}</td>
                    <td className="px-8 py-6 text-xs text-stone-500 font-bold">{g.courseTitle}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-black ${g.percentage >= 80 ? 'text-emerald-500' : g.percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {g.percentage}%
                        </span>
                        <div className="w-24 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all ${g.percentage >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${g.percentage}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-stone-600 font-black">{new Date(g.completedAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                       <span className={`text-[9px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${g.percentage >= 50 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                         {g.percentage >= 50 ? 'Passed' : 'Failed'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {grades.length === 0 && (
              <div className="py-32 text-center text-stone-700 font-black uppercase tracking-widest">No submissions recorded yet</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}