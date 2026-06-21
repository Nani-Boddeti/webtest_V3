import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Minimum role required to access the route. Defaults to 'editor'. */
  requiredRole?: 'owner' | 'editor';
}

/**
 * Route guard that redirects unauthenticated users to /login.
 * Optionally restricts access by role.
 */
export default function ProtectedRoute({ children, requiredRole = 'editor' }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" role="status">
          <span className="sr-only">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'owner' && user?.role !== 'owner') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center shadow-md">
          <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          <p className="mt-2 text-sm text-red-600">You need owner permissions to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
