import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin, ADMIN_DENIED_MESSAGE } from '@/lib/admin';
import { ROUTES } from '@/lib/routes';

const AuthSpinner = () => (
  <div className="flex justify-center py-16">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

/** Requires authenticated user with profiles.is_admin = true */
export default function AdminRoute() {
  const { user, isLoadingAuth, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return <AuthSpinner />;

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />;
  }

  if (!isAdmin(user)) {
    return (
      <Navigate
        to={ROUTES.dashboard}
        replace
        state={{ flashError: ADMIN_DENIED_MESSAGE }}
      />
    );
  }

  return <Outlet />;
}
