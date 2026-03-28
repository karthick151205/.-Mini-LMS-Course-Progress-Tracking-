import { useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  // 🛡️ Admin Check
  const isAdmin = user?.role === 'admin';

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/'); 
  };

  // Generate initials for the avatar
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <nav className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* ── Brand / Logo ────────────────────────────────────────── */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-all duration-200">
            <span className="text-white text-sm">📚</span>
          </div>
          <span className="text-stone-800 font-black text-lg tracking-tighter uppercase italic">
            MiniLMS
          </span>
        </div>

        {/* ── Navigation & User Controls ───────────────────────────── */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Main Navigation Links */}
          <div className="flex items-center gap-4 border-r border-stone-200 pr-4 sm:pr-6">
            <button
              onClick={() => navigate('/')}
              className="text-stone-500 hover:text-amber-600 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Courses
            </button>

            {/* 💡 HIDE "My Progress" for Admins */}
            {!isAdmin && (
              <button
                onClick={() => navigate('/profile')}
                className="text-stone-500 hover:text-amber-600 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                My Progress
              </button>
            )}

            {/* ✅ ADMIN PANEL LINK (Highlighted for Admins) */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-stone-900 text-amber-500 hover:bg-stone-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
              >
                ⚙️ Admin Panel
              </button>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shadow-inner">
                <span className="text-stone-600 text-[10px] font-black">{initials}</span>
              </div>
              <div className="hidden md:block leading-none">
                <p className="text-stone-800 text-xs font-black uppercase tracking-tight">
                  {user?.name}
                </p>
                <p className="text-[9px] font-bold text-stone-400 uppercase mt-0.5 tracking-tighter">
                  {isAdmin ? 'System Admin' : 'Student'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-stone-300 hover:text-red-500 transition-all p-2 rounded-xl hover:bg-red-50 group border border-transparent hover:border-red-100"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;