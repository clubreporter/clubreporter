import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ONBOARDING_ROUTES,
  clubCodeForSport,
} from '@/lib/onboardingConstants';
import {
  loadOnboardingState,
  saveOnboardingState,
  patchOnboardingState,
  hasStoredOnboarding,
} from '@/lib/onboardingStorage';

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
      saveOnboardingState(next);
      return next;
    });
  }, [searchParams]);

  const persist = useCallback((next) => {
    saveOnboardingState(next);
    setState(next);
    return next;
  }, []);

  const patch = useCallback((updates) => {
    return persist(patchOnboardingState(updates));
  }, [persist]);

  const setAccountType = useCallback((accountType) => {
    const prev = loadOnboardingState();
    const planId = accountType === 'media' ? 'presspass' : prev.planId === 'presspass' ? 'free' : prev.planId;
    persist(patchOnboardingState({
      accountType,
      sport: accountType === 'media' ? '' : prev.sport,
      clubCode: accountType === 'media' ? '' : prev.clubCode,
      planId,
      plan: planId,
    }));
  }, [persist]);

  const setSport = useCallback((sport) => {
    persist(patchOnboardingState({
      sport,
      clubCode: clubCodeForSport(sport),
    }));
  }, [persist]);

  const goTo = useCallback((path) => navigate(path), [navigate]);

  const nextFromAccountType = useCallback(() => {
    saveOnboardingState(state);
    if (state.accountType === 'media') {
      goTo(ONBOARDING_ROUTES.plan);
    } else {
      goTo(ONBOARDING_ROUTES.sport);
    }
  }, [state, goTo]);

  const nextFromSport = useCallback(() => {
    saveOnboardingState(state);
    goTo(ONBOARDING_ROUTES.clubDetails);
  }, [state, goTo]);

  const nextFromClubDetails = useCallback(() => {
    saveOnboardingState(state);
    goTo(ONBOARDING_ROUTES.plan);
  }, [state, goTo]);

  const nextFromPlan = useCallback((emailVerified) => {
    saveOnboardingState(state);
    if (emailVerified) {
      goTo(ONBOARDING_ROUTES.welcome);
    } else {
      goTo(ONBOARDING_ROUTES.confirmEmail);
    }
  }, [state, goTo]);

  const nextFromConfirmEmail = useCallback(() => {
    saveOnboardingState(state);
    goTo(ONBOARDING_ROUTES.welcome);
  }, [state, goTo]);

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
