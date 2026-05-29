import { Toaster } from "@/components/ui/toaster"
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { bypassesOnboarding } from '@/lib/testAdmin';
import { hasStoredOnboarding } from '@/lib/onboardingStorage';
import TestPageNav from '@/components/admin/TestPageNav';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import CreateMatch from './pages/CreateMatch';
import MatchControl from './pages/MatchControl';
import LiveMatch from './pages/LiveMatch';
import MatchReport from './pages/MatchReport';
import PublicMatch from './pages/PublicMatch';
import Fixtures from './pages/Fixtures';
import Teams from './pages/Teams';
import Venues from './pages/Venues';
import Club from './pages/Club';
import Billing from './pages/Billing';
import { loadAndApplyStoredColours } from './lib/clubColours';
import Landing from './pages/Landing';
import PressPassPage from './pages/marketing/PressPass';
import GaelicReporter from './pages/marketing/GaelicReporter';
import PitchReporter from './pages/marketing/PitchReporter';
import RugbyReporter from './pages/marketing/RugbyReporter';
import Pricing from './pages/Pricing';
import OnboardingGate from './pages/OnboardingGate';
import ClubVerify from './pages/ClubVerify';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import TestPages from './pages/admin/TestPages';
import TestPreviewGate from './pages/TestPreviewGate';
import GetStarted from './pages/GetStarted';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ROUTES } from '@/lib/routes';

loadAndApplyStoredColours();

function RedirectWithParams({ template }) {
  const params = useParams();
  let path = template;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return <Navigate to={path} replace />;
}

const AuthSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

/** Only for logged-out visitors (login / signup) */
const GuestOnly = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  if (isLoadingAuth) return <AuthSpinner />;
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;
  return <Outlet />;
};

/** Requires Supabase session */
const ProtectedLayout = () => {
  const { isLoadingAuth, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return <AuthSpinner />;

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />;
  }

  if (user?.accountSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold">Account suspended</h1>
          <p className="text-muted-foreground text-sm">
            Your account has been suspended. Please contact info@clubreporter.ie for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (!bypassesOnboarding(user)) {
    const onAdminPath =
      location.pathname === ROUTES.admin || location.pathname.startsWith('/test-pages');

    if (user && !user.profileType && !onAdminPath && !hasStoredOnboarding()) {
      return <Navigate to="/onboarding/account-type" replace />;
    }

    if (
      user &&
      user.profileType !== 'media' &&
      !user.primarySport &&
      !onAdminPath &&
      !hasStoredOnboarding()
    ) {
      return <Navigate to="/onboarding/account-type" replace />;
    }
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.18 }}>
        <Routes location={location}>

          {/* Public marketing */}
          <Route path={ROUTES.home} element={<Landing />} />
          <Route path={ROUTES.pricing} element={<Pricing />} />
          <Route path="/gaelicreporter" element={<GaelicReporter />} />
          <Route path="/pitchreporter" element={<PitchReporter />} />
          <Route path="/rugbyreporter" element={<RugbyReporter />} />
          <Route path="/press-pass" element={<PressPassPage />} />

          {/* Public reports */}
          <Route path="/reports/:slug" element={<PublicMatch />} />
          <Route
            path="/m/:publicId"
            element={<RedirectWithParams template="/reports/:publicId" />}
          />

          {/* Pre-signup funnel + post-signup profile setup */}
          <Route path={`${ROUTES.onboarding}/*`} element={<OnboardingGate />} />
          <Route path="/get-started" element={<Navigate to="/onboarding/account-type" replace />} />

          {/* Test admin previews (signed-in test admin only) */}
          <Route element={<TestPreviewGate />}>
            <Route path="/test-preview/onboarding-funnel" element={<GetStarted />} />
            <Route path="/test-preview/signup" element={<Auth />} />
            <Route path="/test-preview/login" element={<Auth />} />
            <Route path="/test-preview/forgot-password" element={<ForgotPassword />} />
            <Route path="/test-preview/reset-password" element={<ResetPassword preview />} />
            <Route element={<Layout />}>
              <Route path="/test-preview/onboarding-setup" element={<Onboarding />} />
            </Route>
          </Route>

          {/* Email confirmation callback (must stay public) */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Auth pages — redirect to dashboard if already signed in */}
          <Route element={<GuestOnly />}>
            <Route path={ROUTES.login} element={<Auth />} />
            <Route path={ROUTES.signup} element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Password reset — must stay public (recovery session counts as signed in) */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected app */}
          <Route element={<ProtectedLayout />}>
            <Route element={<Layout />}>
              <Route path={ROUTES.dashboard} element={<Dashboard />} />
              <Route path={ROUTES.matches} element={<Matches />} />
              <Route path={ROUTES.matchNew} element={<CreateMatch />} />
              <Route path="/matches/:id" element={<MatchControl />} />
              <Route path="/matches/:id/timeline" element={<LiveMatch />} />
              <Route path="/matches/:id/report" element={<MatchReport />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/venues" element={<Venues />} />
              <Route path={ROUTES.club} element={<Club />} />
              <Route path="/club/verify" element={<ClubVerify />} />
              <Route path={ROUTES.billing} element={<Billing />} />
              <Route element={<AdminRoute />}>
                <Route path={ROUTES.admin} element={<AdminDashboard />} />
                <Route path="/test-pages" element={<TestPages />} />
              </Route>
            </Route>
          </Route>

          {/* Legacy redirects */}
          <Route path="/home" element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path="/create-match" element={<Navigate to={ROUTES.matchNew} replace />} />
          <Route
            path="/match/:matchId/live"
            element={<RedirectWithParams template="/matches/:matchId/timeline" />}
          />
          <Route
            path="/match/:matchId/report"
            element={<RedirectWithParams template="/matches/:matchId/report" />}
          />
          <Route path="/admin/club-verifications" element={<Navigate to={ROUTES.admin} replace />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <TestPageNav />
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
