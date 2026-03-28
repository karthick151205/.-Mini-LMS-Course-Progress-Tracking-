import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCourses,
  createCourse,
  deleteCourse,
  createChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../api';

// ── Components ──────────────────────────────────────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder, textarea }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">{label}</label>
    {textarea ? (
      <textarea 
        rows={3} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full bg-stone-100 border-b-2 border-stone-200 text-stone-900 text-sm p-2 outline-none focus:border-amber-500 transition-all placeholder:text-stone-400" 
      />
    ) : (
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full bg-stone-100 border-b-2 border-stone-200 text-stone-900 text-sm p-2 outline-none focus:border-amber-500 transition-all placeholder:text-stone-400" 
      />
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-stone-900/80 backdrop-blur-sm">
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
      <div className="h-1.5 bg-amber-500" />
      <div className="p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// ── Main Admin Panel ─────────────────────────────────────────────
export default function AdminPanel({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  
  const [modal, setModal] = useState(null); 
  const [modalTarget, setModalTarget] = useState(null); 
  const [saving, setSaving] = useState(false);

  const [courseForm, setCourseForm] = useState({ title: '', description: '', level: 'Beginner' });
  const [chapterForm, setChapterForm] = useState({ title: '' });
  const [lessonForm, setLessonForm] = useState({ 
    title: '', type: 'reading', content: '',
    quiz: { question: '', options: ['', '', '', ''], correct: 0 } 
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
    else loadCourses();
  }, [user]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal(null);
    setModalTarget(null);
    setSaving(false);
    setCourseForm({ title: '', description: '', level: 'Beginner' });
    setChapterForm({ title: '' });
    setLessonForm({ title: '', type: 'reading', content: '', quiz: { question: '', options: ['', '', '', ''], correct: 0 } });
  };

  // ── Action Handlers ──────────────────────────────────────────
  const handleAddCourse = async () => {
    if (!courseForm.title.trim()) return;
    setSaving(true);
    await createCourse(courseForm);
    await loadCourses();
    closeModal();
  };

  const handleAddChapter = async () => {
    if (!chapterForm.title.trim()) return;
    setSaving(true);
    await createChapter(modalTarget, chapterForm);
    await loadCourses();
    closeModal();
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title.trim()) return;
    setSaving(true);
    try {
        if (modal === 'editLesson') {
          const { courseId, chapterId, lessonId } = modalTarget;
          await updateLesson(courseId, chapterId, lessonId, lessonForm);
        } else {
          const { courseId, chapterId } = modalTarget;
          await createLesson(courseId, chapterId, lessonForm);
        }
        await loadCourses();
        closeModal();
    } catch (err) {
        console.error("Save failed:", err);
        setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      
      {/* ── SIDEBAR (Admin Focus) ── */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col py-8 px-5 flex-shrink-0 hidden lg:flex sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-xl">🛠️</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none tracking-tighter">ADMIN HUB</p>
            <p className="text-stone-500 text-[10px] font-bold mt-1 uppercase">Control Center</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/10 text-amber-500 rounded-xl text-sm font-bold transition-all">
            <span>📚</span> Course Manager
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-stone-300 hover:bg-stone-800/50 rounded-xl text-sm font-bold transition-all">
            <span>👥</span> User Records
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-stone-300 hover:bg-stone-800/50 rounded-xl text-sm font-bold transition-all">
            <span>📈</span> Analytics
          </button>
        </nav>

        <div className="mt-auto border-t border-stone-800 pt-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-amber-500 transition-colors w-full text-sm font-bold"
          >
            <span>🏠</span> Exit to Website
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 overflow-auto bg-stone-950">
        <header className="px-8 py-8 flex justify-between items-center sticky top-0 bg-stone-950/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Management</h1>
            <p className="text-stone-500 text-sm font-medium">Create and refine your educational content</p>
          </div>
          <button 
            onClick={() => setModal('addCourse')}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-amber-500/10 transition-all active:scale-95"
          >
            + NEW COURSE
          </button>
        </header>

        <div className="px-8 pb-12 space-y-8">
          
          {/* ── ADMIN STATS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl">
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest">Active Courses</p>
              <p className="text-3xl font-black text-white mt-1">{courses.length}</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl">
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest">Total Chapters</p>
              <p className="text-3xl font-black text-white mt-1">
                {courses.reduce((acc, curr) => acc + (curr.chapters?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl">
              <p className="text-stone-500 text-xs font-black uppercase tracking-widest">Global Lessons</p>
              <p className="text-3xl font-black text-white mt-1">
                {courses.reduce((acc, curr) => 
                  acc + (curr.chapters?.reduce((subAcc, ch) => subAcc + (ch.lessons?.length || 0), 0) || 0), 0
                )}
              </p>
            </div>
          </div>

          {/* ── COURSE LIST ── */}
          <div className="grid gap-4">
            {courses.length === 0 ? (
                <div className="text-center py-20 bg-stone-900/50 rounded-2xl border border-dashed border-stone-800 text-stone-600">No courses created yet.</div>
            ) : courses.map(course => (
              <div key={course._id} className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden transition-all hover:border-stone-700">
                <div className="p-6 flex items-center justify-between">
                  <div onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)} className="cursor-pointer flex-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{course.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-black bg-stone-800 text-stone-400 px-2 py-1 rounded uppercase tracking-widest">{course.level}</span>
                      <span className="text-[10px] font-black bg-stone-800 text-amber-500/80 px-2 py-1 rounded uppercase tracking-widest">{course.chapters?.length || 0} Chapters</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setModalTarget(course._id); setModal('addChapter'); }} className="text-xs font-bold text-amber-500 hover:text-amber-400">+ CHAPTER</button>
                    <button onClick={async () => { if(window.confirm("Delete course?")) { await deleteCourse(course._id); loadCourses(); }}} className="text-stone-600 hover:text-red-500">🗑️</button>
                  </div>
                </div>

                {expandedCourse === course._id && (
                  <div className="bg-stone-950/50 p-6 pt-0 space-y-4">
                    {(course.chapters || []).map(chapter => (
                      <div key={chapter._id} className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-stone-300">📖 {chapter.title}</h4>
                          <div className="flex gap-2">
                              <button onClick={() => { setModalTarget({ courseId: course._id, chapterId: chapter._id }); setModal('addLesson'); }} className="text-[10px] font-black text-amber-500">+ LESSON/QUIZ</button>
                              <button onClick={async () => { if(window.confirm("Delete chapter?")) { await deleteChapter(course._id, chapter._id); loadCourses(); }}} className="text-stone-600 hover:text-red-500">🗑️</button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {(chapter.lessons || []).map(lesson => (
                            <div key={lesson._id} className="flex justify-between items-center bg-stone-950 px-3 py-2 rounded-lg group hover:bg-stone-900 transition-colors">
                              <span className="text-xs text-stone-400">{lesson.type === 'quiz' ? '❓' : '📄'} {lesson.title}</span>
                              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => { setLessonForm(lesson); setModalTarget({ courseId: course._id, chapterId: chapter._id, lessonId: lesson._id }); setModal('editLesson'); }} className="text-[10px] font-bold text-sky-500">EDIT</button>
                                <button onClick={async () => { if(window.confirm("Delete lesson?")) { await deleteLesson(course._id, chapter._id, lesson._id); loadCourses(); }}} className="text-[10px] font-bold text-red-500">DEL</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── MODALS (Same as before but with UI fixes) ── */}

      {modal === 'addCourse' && (
        <Modal title="New Course" onClose={closeModal}>
          <Field label="Course Title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g., Intro to Java" />
          <Field label="Description" textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} placeholder="What will students learn?" />
          <button onClick={handleAddCourse} disabled={saving} className="w-full bg-amber-500 py-4 rounded-xl font-bold text-stone-900 mt-4 active:scale-95 transition-transform disabled:opacity-50">
            {saving ? 'CREATING...' : 'CREATE COURSE'}
          </button>
        </Modal>
      )}

      {modal === 'addChapter' && (
        <Modal title="New Chapter" onClose={closeModal}>
          <Field label="Chapter Title" value={chapterForm.title} onChange={e => setChapterForm({title: e.target.value})} placeholder="e.g., Variables & Types" />
          <button onClick={handleAddChapter} disabled={saving} className="w-full bg-amber-500 py-4 rounded-xl font-bold text-stone-900 mt-4 active:scale-95 transition-transform disabled:opacity-50">
            {saving ? 'ADDING...' : 'ADD CHAPTER'}
          </button>
        </Modal>
      )}

      {(modal === 'addLesson' || modal === 'editLesson') && (
        <Modal title={modal === 'addLesson' ? "Create Content" : "Update Content"} onClose={closeModal}>
          <div className="space-y-6">
            <Field label="Title" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Lesson name" />
            
            <div className="flex bg-stone-100 p-1 rounded-xl">
              {['reading', 'quiz'].map(t => (
                <button 
                  key={t} 
                  type="button"
                  onClick={() => setLessonForm({...lessonForm, type: t})} 
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${lessonForm.type === t ? 'bg-white shadow-sm text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {lessonForm.type === 'reading' ? (
              <Field label="Reading Content" textarea value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} placeholder="Write your lesson content here..." />
            ) : (
              <div className="space-y-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <Field label="Question" value={lessonForm.quiz.question} onChange={e => setLessonForm({...lessonForm, quiz: {...lessonForm.quiz, question: e.target.value}})} placeholder="Ask something..." />
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Options (Click circle for correct answer)</p>
                <div className="space-y-2">
                  {lessonForm.quiz.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-stone-200 focus-within:border-amber-300 transition-colors">
                      <input 
                        type="radio" 
                        name="correctOpt" 
                        checked={lessonForm.quiz.correct === i} 
                        onChange={() => setLessonForm({...lessonForm, quiz: {...lessonForm.quiz, correct: i}})}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                      <input 
                        placeholder={`Option ${i+1}`} 
                        className="flex-1 text-sm outline-none text-stone-900 bg-transparent placeholder:text-stone-300" 
                        value={opt} 
                        onChange={e => {
                          const newOpts = [...lessonForm.quiz.options];
                          newOpts[i] = e.target.value;
                          setLessonForm({...lessonForm, quiz: {...lessonForm.quiz, options: newOpts}});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleSaveLesson} disabled={saving} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-amber-500 hover:text-stone-900 transition-all active:scale-95 disabled:opacity-50">
              {saving ? 'SAVING...' : 'SAVE CONTENT'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}