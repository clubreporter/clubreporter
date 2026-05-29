import { DEFAULT_ONBOARDING_STATE, ONBOARDING_STORAGE_KEY } from './onboardingConstants';

export function loadOnboardingState() {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ONBOARDING_STATE };
    return { ...DEFAULT_ONBOARDING_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_ONBOARDING_STATE };
  }
}

export function saveOnboardingState(state) {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
}

export function clearOnboardingState() {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}

export function patchOnboardingState(updates) {
  const next = { ...loadOnboardingState(), ...updates };
  saveOnboardingState(next);
  return next;
}
