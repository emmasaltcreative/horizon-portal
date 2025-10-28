import { NavLink, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'inspector'] },
  { to: '/inspectors', label: 'Inspectors', roles: ['admin', 'inspector'] },
  { to: '/clients', label: 'Clients', roles: ['admin', 'inspector'] }
] as const;

const AppLayout = ({ children }: PropsWithChildren) => {
  const { profile, logout } = useSupabaseAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 flex-col bg-brand-primary text-white lg:flex">
        <div className="px-6 py-8">
          <div className="hero-font text-2xl text-brand-accent-bright">Horizon Portal</div>
          <p className="mt-2 text-sm text-slate-200">Serving Virginia homeowners with confidence.</p>
        </div>
        <nav className="mt-6 flex-1 space-y-1 px-4">
          {navItems
            .filter((item) => (profile ? item.roles.includes(profile.role) : false))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'block rounded-lg px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          {profile?.role === 'admin' && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                clsx(
                  'block rounded-lg px-4 py-3 text-sm font-medium transition',
                  isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5'
                )
              }
            >
              Settings
            </NavLink>
          )}
        </nav>
        <div className="border-t border-white/10 px-6 py-5 text-sm text-slate-200">
          <div className="font-semibold text-white">{profile?.full_name}</div>
          <div className="mt-1 break-words text-xs text-slate-300">{profile?.email}</div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <div className="hero-font text-xl">Horizon Home Inspections</div>
            <div className="text-sm text-slate-500">{location.pathname.replace('/', '') || 'dashboard'}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-slate-900">{profile?.full_name}</div>
              <div className="text-sm text-slate-500">{profile?.role?.toUpperCase()}</div>
            </div>
            <button
              onClick={() => logout()}
              className="rounded-lg border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary hover:text-white"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="card p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
