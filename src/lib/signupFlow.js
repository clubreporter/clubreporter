import {
  ONBOARDING_SPORTS,
  ACCOUNT_TYPE_OPTIONS,
  SIGNUP_PLAN_OPTIONS,
  getPlanById,
} from '@/lib/planConfig';

/** Build /signup or /onboarding URL with funnel choices preserved */
export function buildSignupQuery({ sport, account, plan } = {}) {
  const params = new URLSearchParams();
  if (sport) params.set('sport', sport);
  if (account) params.set('account', account);
  if (plan) params.set('plan', plan);
  return params;
}

export function buildSignupUrl(options = {}) {
  const qs = buildSignupQuery(options).toString();
  return qs ? `/signup?${qs}` : '/signup';
}

export function buildOnboardingUrl(options = {}) {
  const qs = buildSignupQuery(options).toString();
  return qs ? `/onboarding/account-type?${qs}` : '/onboarding/account-type';
}

export function buildGetStartedUrl(options = {}) {
  const qs = buildSignupQuery(options).toString();
  return qs ? `/onboarding/account-type?${qs}` : '/onboarding/account-type';
}

/** True when sport, account and plan were chosen before signup */
export function isSignupPrefilled({ sport, account, plan }) {
  return Boolean(sport && account && plan);
}

export function formatSignupSummary({ sport, account, plan }) {
  const sportLabel = ONBOARDING_SPORTS.find((s) => s.id === sport)?.label;
  const accountLabel = ACCOUNT_TYPE_OPTIONS.find((a) => a.id === account)?.title;
  const planLabel =
    SIGNUP_PLAN_OPTIONS.find((p) => p.id === plan)?.label ||
    getPlanById(plan)?.name;
  const parts = [];
  if (sportLabel) parts.push(sportLabel);
  if (accountLabel) parts.push(accountLabel);
  if (planLabel) parts.push(planLabel);
  return parts.join(' · ');
}

export const SIGNUP_FUNNEL_STEPS = [
  { key: 'sport', title: 'Choose Sport' },
  { key: 'account', title: 'Choose Account Type' },
  { key: 'plan', title: 'Choose Plan' },
];
