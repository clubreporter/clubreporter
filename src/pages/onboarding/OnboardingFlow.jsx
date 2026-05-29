import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingFlowProvider } from '@/hooks/useOnboardingFlow';
import { ONBOARDING_ROUTES } from '@/lib/onboardingConstants';
import AccountTypeScreen from './AccountTypeScreen';
import SportScreen from './SportScreen';
import ClubDetailsScreen from './ClubDetailsScreen';
import PlanScreen from './PlanScreen';
import ConfirmEmailScreen from './ConfirmEmailScreen';
import WelcomeScreen from './WelcomeScreen';

function AnimatedOutlet({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22 }}
        className="h-full flex flex-col min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function OnboardingFlow() {
  const location = useLocation();

  return (
    <OnboardingFlowProvider>
      <AnimatedOutlet>
        <Routes location={location}>
          <Route index element={<Navigate to={ONBOARDING_ROUTES.accountType} replace />} />
          <Route path="account-type" element={<AccountTypeScreen />} />
          <Route path="sport" element={<SportScreen />} />
          <Route path="club-details" element={<ClubDetailsScreen />} />
          <Route path="plan" element={<PlanScreen />} />
          <Route path="confirm-email" element={<ConfirmEmailScreen />} />
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="*" element={<Navigate to={ONBOARDING_ROUTES.accountType} replace />} />
        </Routes>
      </AnimatedOutlet>
    </OnboardingFlowProvider>
  );
}
