import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function MainLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-neutral-800">
      <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <Link to="/dashboard" className="font-bold text-lg text-white tracking-tight">FlashGo</Link>
            <Link to="/explore" className="text-sm text-neutral-400 hover:text-white transition-colors">Explore</Link>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-neutral-400">Hi, {user?.username || 'User'}</span>
            <button
              onClick={() => logout()}
              className="text-sm px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
