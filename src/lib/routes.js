/** App route paths — keep links in sync with App.jsx */

export const ROUTES = {
  home: '/',
  signup: '/signup',
  login: '/login',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  matches: '/matches',
  matchNew: '/matches/new',
  match: (id) => `/matches/${id}`,
  matchTimeline: (id) => `/matches/${id}/timeline`,
  matchReport: (id) => `/matches/${id}/report`,
  report: (slug) => `/reports/${slug}`,
  admin: '/admin',
  billing: '/billing',
  club: '/club',
  pricing: '/pricing',
};

export function publicReportPath(publicId) {
  return ROUTES.report(publicId);
}

export function publicReportUrl(publicId) {
  if (typeof window === 'undefined') return publicReportPath(publicId);
  return `${window.location.origin}${publicReportPath(publicId)}`;
}
