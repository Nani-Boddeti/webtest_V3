import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/build-plan', label: 'Build Plan' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo / brand */}
          <NavLink to="/dashboard" className="text-lg font-bold tracking-tight text-indigo-700">
            WaitlistHub
          </NavLink>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden text-sm text-gray-500 sm:inline">
                {user.name}{' '}
                <span
                  className={`ml-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role}
                </span>
              </span>
            )}
            <button
              onClick={logout}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav links */}
        <nav className="flex border-t border-gray-100 sm:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 py-2 text-center text-xs font-medium ${
                  isActive ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-gray-500'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
