import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { isTestAdmin } from '@/lib/testAdmin';
import { ROUTES } from '@/lib/routes';

const AuthSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

/** Lets test admin preview guest-only screens while still signed in */
export default function TestPreviewGate() {
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) return <AuthSpinner />;

  if (!isAuthenticated || !isTestAdmin(user)) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
