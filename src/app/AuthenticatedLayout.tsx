import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';
import { Button } from '@/shared/ui/Button';
import { useQueuedAutoApplyCount } from '@/features/autoApply/hooks/useQueuedAutoApplyCount';

const navItems = [
  { label: 'Jobs', to: '/jobs' },
  { label: 'Tracker', to: '/tracker' },
  { label: 'Queue', to: '/queue' },
  { label: 'Settings', to: '/settings' },
];

export function AuthenticatedLayout() {
  const { logout } = useAuth();
  const queueCount = useQueuedAutoApplyCount();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-2">
          <NavLink to="/jobs" className="text-lg font-semibold tracking-tight text-emerald-800">
            Switchmate
          </NavLink>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <span>{label}</span>
                {label === 'Queue' && (
                  <span
                    aria-label={`${queueCount} queued for approval`}
                    className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-900"
                  >
                    {queueCount}
                  </span>
                )}
              </NavLink>
            ))}
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
