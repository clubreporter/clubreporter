/** Plan cards shown on onboarding step 4 — exact copy per product spec */

export const ONBOARDING_PLAN_CARDS = [
  {
    id: 'free',
    name: 'Free',
    month: 0,
    year: 0,
    periodLabel: 'forever',
    badge: null,
    features: [
      '4 matches per month',
      'Manual entry',
      'Basic report',
      'Public share link',
      'No credit card required',
    ],
    cta: 'Start Free',
    ctaAction: 'free',
    clubOnly: true,
    mediaOnly: false,
  },
  {
    id: 'club',
    name: 'Club',
    month: 4.99,
    year: 44.99,
    periodLabel: null,
    badge: null,
    features: [
      'Unlimited matches',
      'Photos and video clips',
      'Sponsor on reports',
      'Push notifications',
      'Saved squad',
    ],
    cta: 'Start 14 Day Trial',
    ctaAction: 'trial',
    clubOnly: true,
    mediaOnly: false,
  },
  {
    id: 'county',
    name: 'County',
    month: 12.99,
    year: 119.99,
    periodLabel: null,
    badge: 'Most Popular',
    features: [
      'Everything in Club',
      'AI report generation',
      'Multiple admins',
      'Analytics dashboard',
      'Social media push',
    ],
    cta: 'Start 14 Day Trial',
    ctaAction: 'trial',
    clubOnly: true,
    mediaOnly: false,
  },
  {
    id: 'presspass',
    name: 'Press Pass',
    month: 34.99,
    year: 299.99,
    periodLabel: null,
    badge: null,
    features: [
      'Everything in County',
      'Media profile',
      'Cover unlimited clubs',
      'All sports supported',
      'Verified press badge',
    ],
    cta: 'Apply Now',
    ctaAction: 'apply',
    clubOnly: false,
    mediaOnly: true,
  },
];

export function onboardingPlansForAccount(accountType) {
  if (accountType === 'media') {
    return ONBOARDING_PLAN_CARDS.filter((p) => p.mediaOnly);
  }
  return ONBOARDING_PLAN_CARDS.filter((p) => p.clubOnly);
}

export function annualSavingsPercent(month, year) {
  if (!month || !year) return 0;
  const fullYear = month * 12;
  return Math.round(((fullYear - year) / fullYear) * 100);
}

export function formatPlanPrice(plan, billingPeriod) {
  if (plan.month === 0) return { price: '€0', suffix: ' forever' };
  if (billingPeriod === 'year') {
    return { price: `€${plan.year.toFixed(2)}`, suffix: ' per year' };
  }
  return { price: `€${plan.month.toFixed(2)}`, suffix: ' per month' };
}
