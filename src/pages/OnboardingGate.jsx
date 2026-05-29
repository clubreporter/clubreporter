import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ROUTES } from '@/lib/routes';
import { ONBOARDING_ROUTES } from '@/lib/onboardingConstants';
import OnboardingFlow from './onboarding/OnboardingFlow';

const AuthSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#e8f2f0]">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1A9E6D] rounded-full animate-spin" />
  </div>
);

function isOnboardingPath(pathname) {
  return pathname === ROUTES.onboarding || pathname.startsWith(`${ROUTES.onboarding}/`);
}

/** Six-screen onboarding — local state until welcome step writes to Supabase */
export default function OnboardingGate() {
  const { isLoadingAuth, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return <AuthSpinner />;

  const profileComplete =
    user?.profileType &&
    (user.profileType === 'media' || user.primarySport);

  if (
    isAuthenticated &&
    profileComplete &&
    user?.emailVerified !== false &&
    isOnboardingPath(location.pathname) &&
    !location.pathname.endsWith('/welcome')
  ) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  if (!location.pathname.startsWith(`${ROUTES.onboarding}/`)) {
    return <Navigate to={`${ONBOARDING_ROUTES.accountType}${location.search}`} replace />;
  }

  return <OnboardingFlow />;
}
