/**
 * Canonical site URL for auth email links (Supabase redirect allow-list must include this origin).
 * Set VITE_APP_URL=https://www.clubreporter.ie in production.
 */
export function getSiteUrl() {
  const configured = import.meta.env.VITE_APP_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://www.clubreporter.ie';
}

/** Build /auth/callback URL with optional onboarding hints preserved after email confirm */
export function buildAuthCallbackUrl(params = {}) {
  const url = new URL('/auth/callback', getSiteUrl());
  if (params.sport) url.searchParams.set('sport', params.sport);
  if (params.account) url.searchParams.set('account', params.account);
  if (params.plan) url.searchParams.set('plan', params.plan);
  if (params.redirect) url.searchParams.set('redirect', params.redirect);
  return url.toString();
}

export const SIGNUP_CONFIRMATION_MESSAGE =
  'Check your email to confirm your ClubReporter account.';

export const RESEND_SUCCESS_MESSAGE =
  'Confirmation email sent. Please check your inbox and spam folder.';
