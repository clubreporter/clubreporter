import { ROUTES } from '@/lib/routes';

/**
 * Numbered index of every page for test-admin QA.
 * Dynamic paths use :id or :slug — resolve with resolveTestPagePath().
 */
export const TEST_PAGES = [
  { num: 1, name: 'Landing', path: ROUTES.home, group: 'Public' },
  { num: 2, name: 'Pricing', path: ROUTES.pricing, group: 'Public' },
  { num: 3, name: 'Gaelic Reporter', path: '/gaelicreporter', group: 'Public' },
  { num: 4, name: 'Pitch Reporter', path: '/pitchreporter', group: 'Public' },
  { num: 5, name: 'Rugby Reporter', path: '/rugbyreporter', group: 'Public' },
  { num: 6, name: 'Press Pass', path: '/press-pass', group: 'Public' },
  { num: 7, name: 'Onboarding funnel', path: '/test-preview/onboarding-funnel', group: 'Preview' },
  { num: 8, name: 'Signup', path: '/test-preview/signup', group: 'Preview' },
  { num: 9, name: 'Login', path: '/test-preview/login', group: 'Preview' },
  { num: 10, name: 'Forgot password', path: '/test-preview/forgot-password', group: 'Preview' },
  { num: 11, name: 'Reset password', path: '/test-preview/reset-password', group: 'Preview' },
  { num: 12, name: 'Public match report', path: '/reports/:slug', group: 'Public', dynamic: true },
  { num: 13, name: 'Dashboard', path: ROUTES.dashboard, group: 'App' },
  { num: 14, name: 'Matches list', path: ROUTES.matches, group: 'App' },
  { num: 15, name: 'Create match', path: ROUTES.matchNew, group: 'App' },
  { num: 16, name: 'Match control panel', path: '/matches/:id', group: 'App', dynamic: true },
  { num: 17, name: 'Live timeline', path: '/matches/:id/timeline', group: 'App', dynamic: true },
  { num: 18, name: 'Match report editor', path: '/matches/:id/report', group: 'App', dynamic: true },
  { num: 19, name: 'Fixtures', path: '/fixtures', group: 'App' },
  { num: 20, name: 'Teams', path: '/teams', group: 'App' },
  { num: 21, name: 'Venues', path: '/venues', group: 'App' },
  { num: 22, name: 'Club profile', path: ROUTES.club, group: 'App' },
  { num: 23, name: 'Club verify invite', path: '/club/verify?token=preview', group: 'App' },
  { num: 24, name: 'Admin Panel', path: ROUTES.admin, group: 'App' },
  { num: 25, name: 'Billing', path: ROUTES.billing, group: 'App' },
  { num: 26, name: 'Onboarding profile setup', path: '/test-preview/onboarding-setup', group: 'Preview' },
  { num: 27, name: 'Test page index', path: '/test-pages', group: 'QA' },
];

export function resolveTestPagePath(page, { matchId, publicSlug } = {}) {
  const id = matchId || '—';
  const slug = publicSlug || '—';
  return page.path.replace(':id', id).replace(':slug', slug);
}

function pathMatchesPattern(pathname, pattern) {
  const pathSegments = pathname.split('?')[0].split('/').filter(Boolean);
  const patternSegments = pattern.split('?')[0].split('/').filter(Boolean);
  if (pathSegments.length !== patternSegments.length) return false;
  return patternSegments.every((seg, i) => seg.startsWith(':') || seg === pathSegments[i]);
}

/** Find the numbered test page for the current URL */
export function findTestPageForPath(pathname, { matchId, publicSlug } = {}) {
  const clean = pathname.split('?')[0];

  if (clean === '/test-pages') {
    return TEST_PAGES.find((p) => p.path === '/test-pages');
  }

  for (const page of TEST_PAGES) {
    if (page.dynamic) continue;
    if (page.path.split('?')[0] === clean) return page;
    if (page.path.includes('?') && pathname.startsWith(page.path.split('?')[0])) return page;
  }

  for (const page of TEST_PAGES.filter((p) => p.dynamic)) {
    const pattern = page.path.split('?')[0];
    if (pathMatchesPattern(clean, pattern)) {
      return page;
    }
  }

  if (clean === '/onboarding') {
    return TEST_PAGES.find((p) => p.path === '/test-preview/onboarding-funnel');
  }

  if (clean.startsWith('/test-preview/')) {
    return TEST_PAGES.find((p) => p.path.split('?')[0] === clean);
  }

  return null;
}

export const TEST_PAGE_COUNT = TEST_PAGES.length;
