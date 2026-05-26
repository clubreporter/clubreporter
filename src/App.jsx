import { Toaster } from "@/components/ui/toaster"
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateMatch from './pages/CreateMatch';
import LiveMatch from './pages/LiveMatch';
import PublicMatch from './pages/PublicMatch';
import Fixtures from './pages/Fixtures';
import Teams from './pages/Teams';
import Venues from './pages/Venues';
import Club from './pages/Club';
import MatchReport from './pages/MatchReport';
import Onboarding from './pages/Onboarding.jsx';
import Billing from './pages/Billing';
import { loadAndApplyStoredColours } from './lib/clubColours';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

loadAndApplyStoredColours();

const AuthSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

/** Only for logged-out visitors (login / signup) */
const GuestOnly = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  if (isLoadingAuth) return <AuthSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

/** Requires Supabase session */
const ProtectedLayout = () => {
  const { isLoadingAuth, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return <AuthSpinner />;

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (user && !user.profileType && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // App UI is light-mode; avoid forcing dark theme from OS preference (breaks form inputs).
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.18 }}>
        <Routes location={location}>

          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Landing />} />
          <Route path="/m/:publicId" element={<PublicMatch />} />

          {/* Auth pages — redirect to dashboard if already signed in */}
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Password reset — must stay public (recovery session counts as signed in) */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected app */}
          <Route element={<ProtectedLayout />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-match" element={<CreateMatch />} />
              <Route path="/match/:matchId/live" element={<LiveMatch />} />
              <Route path="/match/:matchId/report" element={<MatchReport />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/club" element={<Club />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>
          </Route>

          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
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
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
