import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/AuthContext';
import { Spinner } from '@/shared/ui/Spinner';

interface ProtectedRouteProps {
  allowIncompleteProfile?: boolean;
}

export function ProtectedRoute({ allowIncompleteProfile = false }: ProtectedRouteProps) {
  const { currentUser, isProfileComplete, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking your session" />
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isProfileComplete && !allowIncompleteProfile) return <Navigate to="/onboarding" replace />;
  if (isProfileComplete && allowIncompleteProfile) return <Navigate to="/jobs" replace />;
  return <Outlet />;
}
