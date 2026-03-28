import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, deleteUser, fetchCourses } from '../api';

export default function StudentRoster({ user }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingStudent, setViewingStudent] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    else loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [userData, courseData] = await Promise.all([fetchAllUsers(), fetchCourses()]);
    setStudents(Array.isArray(userData) ? userData.filter(u => u.role !== 'admin') : []);
    setCourses(courseData);
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently remove ${name} from the system?`)) {
      await deleteUser(id);
      loadData();
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-black tracking-widest uppercase">Syncing Roster...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      {/* ── Sidebar (Same as AdminPanel) ── */}
      <aside className="w-72 bg-stone-900 border-r border-stone-800 flex flex-col py-10 px-6 flex-shrink-0 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/20"><span className="text-2xl">⚡</span></div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tighter italic">LMS PRO</p>
            <p className="text-stone-500 text-[10px] font-black mt-1 uppercase tracking-widest">Admin Control</p>
          </div>
        </div>
        <nav className="space-y-3 flex-1">
          <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-4 px-5 py-4 text-stone-500 hover:text-white hover:bg-stone-800/50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"><span>📚</span> Course Manager</button>
          <button className="w-full flex items-center gap-4 px-5 py-4 bg-amber-500 text-stone-950 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/10"><span>👥</span> Student Roster</button>
        </nav>
        <button onClick={() => navigate('/')} className="mt-auto flex items-center justify-center gap-3 px-5 py-4 border-2 border-stone-800 text-stone-500 hover:text-amber-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"><span>🏠</span> Exit to Website</button>
      </aside>

      {/* ── Main Area ── */}
      <main className="flex-1 bg-stone-950">
        <header className="px-10 py-10 flex justify-between items-center sticky top-0 bg-stone-950/90 backdrop-blur-xl z-10 border-b border-stone-900">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Learner Directory</h1>
            <p className="text-stone-500 text-sm font-bold mt-1">Review student progress and account status</p>
          </div>
          <input 
            type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-amber-500 transition-all text-white w-64"
          />
        </header>

        <div className="p-10">
          <div className="bg-stone-900 rounded-[2.5rem] border border-stone-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-800/50 border-b border-stone-700">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Student</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500">Registration</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredStudents.map(s => (
                  <tr key={s._id} className="hover:bg-stone-800/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-sm font-black text-amber-500 uppercase">{s.name.charAt(0)}</div>
                        <div>
                          <p className="font-black text-stone-200 uppercase tracking-tight">{s.name}</p>
                          <p className="text-[10px] font-bold text-stone-600">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-stone-500 font-bold">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right space-x-4">
                      <button onClick={() => setViewingStudent(s)} className="text-[9px] font-black uppercase tracking-widest text-sky-500 hover:text-white">View Progress</button>
                      <button onClick={() => handleDelete(s._id, s.name)} className="text-[9px] font-black uppercase tracking-widest text-red-900 hover:text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── PROGRESS MODAL ── */}
      {viewingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden text-stone-900">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">{viewingStudent.name}</h2>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Learning Journey Overview</p>
                </div>
                <button onClick={() => setViewingStudent(null)} className="text-stone-300 hover:text-stone-900 text-2xl">✕</button>
              </div>

              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4">
                {courses.map(course => {
                  const lessons = course.chapters.flatMap(ch => ch.lessons);
                  const completedCount = viewingStudent.completedLessons?.filter(id => lessons.some(l => l._id === id)).length || 0;
                  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

                  return (
                    <div key={course._id} className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-sm text-stone-800">{course.title}</p>
                        <p className="text-xs font-black text-amber-600">{pct}%</p>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2 transition-all duration-1000" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-stone-400 mt-2 font-bold uppercase tracking-widest">{completedCount} / {lessons.length} Lessons Finished</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-stone-50 p-6 text-center border-t border-stone-100">
               <button onClick={() => setViewingStudent(null)} className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900">Close Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}