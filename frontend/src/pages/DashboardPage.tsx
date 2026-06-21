import { useAuth } from '../context/AuthContext';

/**
 * Dashboard placeholder — Part 2 will add:
 * - LandingPages tab
 * - Signups tab
 * - InviteUsers tab (owner-only)
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome back, {user?.name ?? 'User'}.
        {user?.role === 'owner' ? ' You have full owner access.' : ' You have editor access.'}
      </p>

      {/* Placeholder tabs UI */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {['Landing Pages', 'Signups', 'Invite Users'].map((tab) => (
              <button
                key={tab}
                disabled
                className={`cursor-not-allowed border-b-2 px-1 pb-2 text-sm font-medium ${
                  tab === 'Landing Pages'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab}
                {tab === 'Invite Users' && user?.role !== 'owner' && (
                  <span className="ml-1.5 inline-block rounded bg-gray-100 px-1.5 text-xs text-gray-500">
                    owner
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">Tab content will be implemented in Part 2.</p>
        </div>
      </div>
    </div>
  );
}
