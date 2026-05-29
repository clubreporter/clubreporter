import { completeOnboarding } from '@/lib/completeOnboarding';
import {
  clearOnboardingState,
  hasStoredOnboarding,
  loadOnboardingState,
} from '@/lib/onboardingStorage';

/** Apply saved onboarding choices to Supabase after signup or email confirmation */
export async function finishOnboardingFromStorage() {
  const state = loadOnboardingState();
  if (!hasStoredOnboarding(state)) {
    return { completed: false };
  }

  const result = await completeOnboarding(state);
  return { completed: true, ...result };
}

export { loadOnboardingState, hasStoredOnboarding, clearOnboardingState };
