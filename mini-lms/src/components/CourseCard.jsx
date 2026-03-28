import { useNavigate } from 'react-router-dom';

function CourseCard({ course, progress, isAdmin }) {
  const navigate = useNavigate();
  const { getProgress, completedLessons } = progress;

  // ── Calculation Logic ──────────────────────────────────────────
  const allLessons = (course.chapters || []).flatMap(ch => ch.lessons || []);
  const progressPct = getProgress(allLessons);
  const completedCount = allLessons.filter(l =>
    completedLessons.includes(l._id)
  ).length;
  
  // Only consider it "complete" if the user is a student and hits 100%
  const isComplete = !isAdmin && progressPct === 100;

  const levelStyles = {
    Beginner:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Intermediate: 'bg-sky-50    text-sky-700    ring-1 ring-sky-200',
    Advanced:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Visual Accent */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-300 w-full" />

      <div className="p-5 flex flex-col flex-1">
        {/* Level badge + completion badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md ${levelStyles[course.level] || levelStyles.Advanced}`}>
            {course.level}
          </span>
          
          {/* 💡 Hide "Done" badge for Admin */}
          {!isAdmin && isComplete && (
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-md shadow-sm">
              ✓ COMPLETED
            </span>
          )}
          
          {/* 🛠️ Show Admin Label instead */}
          {isAdmin && (
            <span className="text-[9px] font-black text-stone-300 uppercase tracking-tighter">
              Admin View
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-stone-800 leading-tight group-hover:text-amber-600 transition-colors duration-200">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-2 italic">
          {course.description || "No description provided."}
        </p>

        {/* ── Metadata & Progress ── */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">
            <span>{course.chapters?.length || 0} Chapters</span>
            
            {/* 💡 Hide "0/0 lessons" count for Admin */}
            {!isAdmin && (
              <span>{completedCount}/{allLessons.length} Lessons</span>
            )}
          </div>

          {/* 💡 Progress Bar - ONLY FOR STUDENTS */}
          {!isAdmin ? (
            <>
              <div className="bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                    isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${isComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {progressPct}% Progress
              </p>
            </>
          ) : (
            /* 🛠️ Admin View Footer */
            <div className="border-t border-stone-50 pt-3">
               <span className="text-[10px] font-bold text-amber-500/50">Click to preview content →</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;