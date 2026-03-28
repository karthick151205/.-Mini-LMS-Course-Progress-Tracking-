import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCourses,
  createCourse,
  deleteCourse,
  createChapter,
  createLesson,
  deleteLesson, // Assuming you add this to api.js based on previous steps
} from '../api';

// ── Reusable UI Components ──────────────────────────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder, textarea }) => (
  <div>
    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">{label}</label>
    {textarea ? (
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm px-0 py-2 outline-none focus:border-amber-500 transition-all duration-200 placeholder:text-stone-300 resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-stone-50 border-b-2 border-stone-200 text-stone-800 text-sm px-0 py-2 outline-none focus:border-amber-500 transition-all duration-200 placeholder:text-stone-300"
      />
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
      <div className="px-7 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-stone-800 tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-600 transition-colors text-xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />
      <div className="px-7 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-lg">⚠️</span>
          </div>
          <div>
            <p className="text-stone-800 font-semibold text-sm">Are you sure?</p>
            <p className="text-stone-400 text-xs mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">Delete</button>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Admin Panel ──────────────────────────────────────────
export default function AdminPanel({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const [modal, setModal] = useState(null); 
  const [modalTarget, setModalTarget] = useState(null); 
  const [confirmDelete, setConfirmDelete] = useState(null); 

  const [courseForm, setCourseForm] = useState({ title: '', description: '', level: 'Beginner' });
  const [chapterForm, setChapterForm] = useState({ title: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', type: 'reading', content: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') navigate('/');
    loadCourses();
  }, [user, navigate]);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => { setModal(null); setModalTarget(null); setSaving(false); };

  // ── Handlers ────────────────────────────────────────────────
  const handleAddCourse = async () => {
    if (!courseForm.title.trim()) return;
    setSaving(true);
    await createCourse(courseForm);
    await loadCourses();
    closeModal();
    showToast('Course created!');
  };

  const handleDeleteCourse = async (id) => {
    await deleteCourse(id);
    await loadCourses();
    showToast('Course deleted.', 'error');
    setConfirmDelete(null);
  };

  const handleAddChapter = async () => {
    if (!chapterForm.title.trim()) return;
    setSaving(true);
    // ModalTarget is the Course ID
    await createChapter(modalTarget, { ...chapterForm, order: 1 });
    await loadCourses();
    closeModal();
    showToast('Chapter added!');
  };

  const handleAddLesson = async () => {
    if (!lessonForm.title.trim()) return;
    setSaving(true);
    const { courseId, chapterId } = modalTarget;
    await createLesson(courseId, chapterId, { ...lessonForm, order: 1 });
    await loadCourses();
    closeModal();
    showToast('Lesson added!');
  };

  const handleDeleteLesson = async (courseId, chapterId, lessonId) => {
    await deleteLesson(courseId, chapterId, lessonId);
    await loadCourses();
    showToast('Lesson deleted.', 'error');
    setConfirmDelete(null);
  };

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div></div>;

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-stone-900 font-bold">L</div>
          <span className="font-bold text-xl tracking-tight">MiniLMS</span>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/10 text-amber-500 rounded-xl font-bold text-sm">🗂️ Courses</button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-white transition-colors text-sm">🏠 Back to Site</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="px-8 py-6 border-b border-stone-800 flex justify-between items-center bg-stone-950/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Management</h1>
            <p className="text-stone-500 text-sm">Control your courses and content</p>
          </div>
          <button 
            onClick={() => { setCourseForm({ title: '', description: '', level: 'Beginner' }); setModal('addCourse'); }}
            className="px-5 py-2.5 bg-amber-500 text-stone-900 font-bold rounded-xl hover:bg-amber-400 transition-all active:scale-95"
          >
            + Create Course
          </button>
        </header>

        <div className="p-8 space-y-6">
          {courses.map(course => (
            <div key={course._id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:border-stone-700 transition-all">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)} className="text-stone-600 hover:text-amber-500 transition-colors">
                    {expandedCourse === course._id ? '🔽' : '▶️'}
                  </button>
                  <div>
                    <h3 className="font-bold text-white">{course.title}</h3>
                    <p className="text-stone-500 text-xs">{course.level} • {course.chapters?.length || 0} Chapters</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setModalTarget(course._id); setModal('addChapter'); }} className="px-3 py-1.5 bg-stone-800 text-xs font-bold rounded-lg hover:bg-stone-700 transition-colors">+ Chapter</button>
                  <button onClick={() => setConfirmDelete({ type: 'course', id: course._id, label: course.title })} className="p-1.5 text-stone-500 hover:text-red-500 transition-colors">🗑️</button>
                </div>
              </div>

              {expandedCourse === course._id && (
                <div className="bg-stone-950/30 border-t border-stone-800 p-4 space-y-3">
                  {course.chapters?.map(chapter => (
                    <div key={chapter._id} className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-bold text-stone-300">📖 {chapter.title}</h4>
                        <button 
                          onClick={() => { setModalTarget({ courseId: course._id, chapterId: chapter._id }); setModal('addLesson'); }}
                          className="text-[10px] font-bold text-amber-500 hover:underline"
                        >
                          + Add Lesson
                        </button>
                      </div>
                      <div className="space-y-1 pl-4">
                        {chapter.lessons?.map(lesson => (
                          <div key={lesson._id} className="flex justify-between items-center group">
                            <span className="text-xs text-stone-500 group-hover:text-stone-300 transition-colors">• {lesson.title}</span>
                            <button 
                              onClick={() => setConfirmDelete({ type: 'lesson', courseId: course._id, chapterId: chapter._id, id: lesson._id, label: lesson.title })}
                              className="text-[10px] text-stone-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Delete
                            </button>
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
      </main>

      {/* Modals */}
      {modal === 'addCourse' && <Modal title="New Course" onClose={closeModal}><div className="space-y-4"><Field label="Title" value={courseForm.title} onChange={e=>setCourseForm({...courseForm, title: e.target.value})} /><Field label="Desc" textarea value={courseForm.description} onChange={e=>setCourseForm({...courseForm, description: e.target.value})} /><button onClick={handleAddCourse} className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl">Create</button></div></Modal>}
      
      {modal === 'addChapter' && <Modal title="New Chapter" onClose={closeModal}><div className="space-y-4"><Field label="Chapter Name" value={chapterForm.title} onChange={e=>setChapterForm({title: e.target.value})} /><button onClick={handleAddChapter} className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl">Add Chapter</button></div></Modal>}
      
      {modal === 'addLesson' && <Modal title="New Lesson" onClose={closeModal}><div className="space-y-4"><Field label="Lesson Title" value={lessonForm.title} onChange={e=>setLessonForm({...lessonForm, title: e.target.value})} /><Field label="Content" textarea value={lessonForm.content} onChange={e=>setLessonForm({...lessonForm, content: e.target.value})} /><button onClick={handleAddLesson} className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl">Add Lesson</button></div></Modal>}

      {confirmDelete && <ConfirmModal message={`Delete ${confirmDelete.label}?`} onCancel={()=>setConfirmDelete(null)} onConfirm={()=>{
        if(confirmDelete.type==='course') handleDeleteCourse(confirmDelete.id);
        if(confirmDelete.type==='lesson') handleDeleteLesson(confirmDelete.courseId, confirmDelete.chapterId, confirmDelete.id);
      }} />}
    </div>
  );
}