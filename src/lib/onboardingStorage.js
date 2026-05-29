import { DEFAULT_ONBOARDING_STATE, ONBOARDING_STORAGE_KEY } from './onboardingConstants';

const LEGACY_STORAGE_KEY = 'clubreporter_onboarding_v2';

/** Normalize stored shape — supports `plan` and internal `planId` */
export function normalizeOnboardingState(raw = {}) {
  const plan = raw.plan || raw.planId || '';
  return {
    ...DEFAULT_ONBOARDING_STATE,
    ...raw,
    planId: plan,
    plan,
  };
}

export function hasStoredOnboarding(state = loadOnboardingState()) {
  return Boolean(state.accountType && (state.planId || state.plan));
}

export function loadOnboardingState() {
  try {
    let raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return { ...DEFAULT_ONBOARDING_STATE };
    return normalizeOnboardingState(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_ONBOARDING_STATE };
  }
}

export function saveOnboardingState(state) {
  const normalized = normalizeOnboardingState(state);
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
    accountType: normalized.accountType,
    sport: normalized.sport,
    clubName: normalized.clubName,
    county: normalized.county,
    clubCode: normalized.clubCode,
    plan: normalized.plan,
    planId: normalized.planId,
    billingPeriod: normalized.billingPeriod,
    mediaOutletName: normalized.mediaOutletName,
    mediaVerificationInfo: normalized.mediaVerificationInfo,
    signupEmail: normalized.signupEmail,
    completed: normalized.completed,
  }));
}

export function clearOnboardingState() {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

/** Merge updates and persist immediately (survives navigation before React re-render) */
export function patchOnboardingState(updates) {
  const next = normalizeOnboardingState({ ...loadOnboardingState(), ...updates });
  saveOnboardingState(next);
  return next;
}
