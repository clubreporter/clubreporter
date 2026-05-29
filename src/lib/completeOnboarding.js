import { updateProfile } from '@/api/auth';
import { createCheckoutSession } from '@/api/billing';
import { entities } from '@/api/entities';
import { clearOnboardingState } from '@/lib/onboardingStorage';
import { clubCodeForSport, primarySportFromSelection } from '@/lib/onboardingConstants';
import { CONTACT_MAILTO } from '@/lib/planConfig';

export async function completeOnboarding(state) {
  const accountType = state.accountType;
  const sport = primarySportFromSelection(state.sport, accountType);
  const clubCode = state.clubCode || clubCodeForSport(state.sport);

  await updateProfile({
    profileType: accountType,
    primarySport: sport,
    subscriptionPlan: state.planId || 'free',
    subscriptionStatus: state.planId === 'free' ? 'active' : 'trialing',
    mediaOutletName: accountType === 'media' ? state.mediaOutletName || null : undefined,
    mediaVerificationInfo: accountType === 'media' ? state.mediaVerificationInfo || null : undefined,
  });

  if (accountType === 'club' && state.clubName?.trim()) {
    const existing = await entities.Club.list();
    if (!existing.length) {
      await entities.Club.create({
        name: state.clubName.trim(),
        county: state.county,
        grades: { sportCode: clubCode },
      });
    } else {
      await entities.Club.update(existing[0].id, {
        name: state.clubName.trim(),
        county: state.county,
        grades: { sportCode: clubCode },
      });
    }
  }

  const planId = state.planId || 'free';

  if (planId === 'club' || planId === 'county') {
    const result = await createCheckoutSession({
      plan: planId,
      billing: state.billingPeriod || 'month',
      clubName: state.clubName,
    });
    clearOnboardingState();
    if (result?.url) {
      window.location.href = result.url;
      return { redirecting: true };
    }
    return { redirecting: false };
  }

  if (planId === 'presspass') {
    clearOnboardingState();
    return { redirecting: false, contactMedia: true };
  }

  clearOnboardingState();
  return { redirecting: false };
}

export function openPressPassContact() {
  window.location.href = CONTACT_MAILTO;
}
