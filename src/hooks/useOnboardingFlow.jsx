import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ONBOARDING_ROUTES,
  clubCodeForSport,
} from '@/lib/onboardingConstants';
import { loadOnboardingState, saveOnboardingState } from '@/lib/onboardingStorage';

const OnboardingFlowContext = createContext(null);

export function OnboardingFlowProvider({ children }) {
  const [state, setState] = useState(() => loadOnboardingState());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const account = searchParams.get('account');
    const sport = searchParams.get('sport');
    const plan = searchParams.get('plan');
    if (!account && !sport && !plan) return;

    setState((prev) => {
      const next = { ...prev };
      if (account === 'club' || account === 'media') {
        next.accountType = account;
        if (account === 'media') {
          next.sport = '';
          next.planId = plan === 'presspass' ? 'presspass' : prev.planId || 'presspass';
        }
      }
      if (sport && ['gaa', 'soccer', 'rugby', 'multi'].includes(sport)) {
        next.sport = sport;
        next.clubCode = clubCodeForSport(sport);
      }
      if (plan && ['free', 'club', 'county', 'presspass'].includes(plan)) {
        next.planId = plan;
      }
      return next;
    });
  }, [searchParams]);

  useEffect(() => {
    saveOnboardingState(state);
  }, [state]);

  const patch = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setAccountType = useCallback((accountType) => {
    setState((prev) => ({
      ...prev,
      accountType,
      sport: accountType === 'media' ? '' : prev.sport,
      clubCode: accountType === 'media' ? '' : prev.clubCode,
      planId: accountType === 'media' ? 'presspass' : prev.planId === 'presspass' ? 'free' : prev.planId,
    }));
  }, []);

  const setSport = useCallback((sport) => {
    setState((prev) => ({
      ...prev,
      sport,
      clubCode: clubCodeForSport(sport),
    }));
  }, []);

  const goTo = useCallback((path) => navigate(path), [navigate]);

  const nextFromAccountType = useCallback(() => {
    if (state.accountType === 'media') {
      goTo(ONBOARDING_ROUTES.plan);
    } else {
      goTo(ONBOARDING_ROUTES.sport);
    }
  }, [state.accountType, goTo]);

  const nextFromSport = useCallback(() => {
    goTo(ONBOARDING_ROUTES.clubDetails);
  }, [goTo]);

  const nextFromClubDetails = useCallback(() => {
    goTo(ONBOARDING_ROUTES.plan);
  }, [goTo]);

  const nextFromPlan = useCallback((emailVerified) => {
    if (emailVerified) {
      goTo(ONBOARDING_ROUTES.welcome);
    } else {
      goTo(ONBOARDING_ROUTES.confirmEmail);
    }
  }, [goTo]);

  const nextFromConfirmEmail = useCallback(() => {
    goTo(ONBOARDING_ROUTES.welcome);
  }, [goTo]);

  const backFrom = useCallback((currentPath) => {
    switch (currentPath) {
      case ONBOARDING_ROUTES.sport:
        goTo(ONBOARDING_ROUTES.accountType);
        break;
      case ONBOARDING_ROUTES.clubDetails:
        goTo(ONBOARDING_ROUTES.sport);
        break;
      case ONBOARDING_ROUTES.plan:
        goTo(state.accountType === 'media' ? ONBOARDING_ROUTES.accountType : ONBOARDING_ROUTES.clubDetails);
        break;
      case ONBOARDING_ROUTES.confirmEmail:
        goTo(ONBOARDING_ROUTES.plan);
        break;
      case ONBOARDING_ROUTES.welcome:
        goTo(ONBOARDING_ROUTES.confirmEmail);
        break;
      default:
        break;
    }
  }, [state.accountType, goTo]);

  const value = useMemo(
    () => ({
      state,
      patch,
      setAccountType,
      setSport,
      goTo,
      nextFromAccountType,
      nextFromSport,
      nextFromClubDetails,
      nextFromPlan,
      nextFromConfirmEmail,
      backFrom,
    }),
    [
      state,
      patch,
      setAccountType,
      setSport,
      goTo,
      nextFromAccountType,
      nextFromSport,
      nextFromClubDetails,
      nextFromPlan,
      nextFromConfirmEmail,
      backFrom,
    ]
  );

  return (
    <OnboardingFlowContext.Provider value={value}>
      {children}
    </OnboardingFlowContext.Provider>
  );
}

export function useOnboardingFlow() {
  const ctx = useContext(OnboardingFlowContext);
  if (!ctx) throw new Error('useOnboardingFlow must be used within OnboardingFlowProvider');
  return ctx;
}
