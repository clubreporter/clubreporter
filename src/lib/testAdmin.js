/** QA / admin page walkthrough access */

import { isAdmin, OWNER_ADMIN_EMAIL } from '@/lib/admin';

export const TEST_ADMIN_EMAIL = 'test@test.com';
export const TEST_ADMIN_PASSWORD = '123456';

/** Emails that receive QA navigator + onboarding bypass once signed in */
export const PLATFORM_QA_EMAILS = [
  OWNER_ADMIN_EMAIL.toLowerCase(),
  TEST_ADMIN_EMAIL.toLowerCase(),
];

export function isPlatformQaEmail(email) {
  return PLATFORM_QA_EMAILS.includes(email?.toLowerCase() ?? '');
}

export function isTestAdmin(user) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return isPlatformQaEmail(user.email);
}

export function canUseTestNavigator(user) {
  return isTestAdmin(user);
}

/** Skips onboarding redirect so every protected page is reachable during QA */
export function bypassesOnboarding(user) {
  return isTestAdmin(user);
}

export function isTestPreviewPath(pathname = '') {
  return pathname.startsWith('/test-preview/');
}
