export const ONBOARDING_STORAGE_KEY = 'clubreporter_onboarding_v2';

export const ONBOARDING_ROUTES = {
  accountType: '/onboarding/account-type',
  sport: '/onboarding/sport',
  clubDetails: '/onboarding/club-details',
  plan: '/onboarding/plan',
  confirmEmail: '/onboarding/confirm-email',
  welcome: '/onboarding/welcome',
};

export const ONBOARDING_STEP_BY_PATH = {
  '/onboarding/account-type': 1,
  '/onboarding/sport': 2,
  '/onboarding/club-details': 3,
  '/onboarding/plan': 4,
  '/onboarding/confirm-email': 5,
  '/onboarding/welcome': 6,
};

export const TOTAL_ONBOARDING_STEPS = 6;

export const IRISH_COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry', 'Donegal',
  'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
  'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
];

export const ONBOARDING_SPORT_OPTIONS = [
  { id: 'gaa', label: 'GAA', icon: '☘️', color: '#1A9E6D', clubCode: 'GAA' },
  { id: 'soccer', label: 'Soccer', icon: '⚽', color: '#1e3a5f', clubCode: 'Soccer' },
  { id: 'rugby', label: 'Rugby', icon: '🏉', color: '#dc2626', clubCode: 'Rugby' },
  { id: 'multi', label: 'All Sports', icon: '🌍', color: '#1A9E6D', clubCode: 'Multi-sport' },
];

export const ACCOUNT_TYPE_CARDS = [
  {
    id: 'club',
    title: 'Club account',
    desc: 'Report for a GAA, soccer or rugby club',
    emoji: '🏆',
  },
  {
    id: 'media',
    title: 'Media account',
    desc: 'Cover multiple clubs as a journalist or outlet',
    emoji: '📰',
  },
];

export function clubCodeForSport(sportId) {
  return ONBOARDING_SPORT_OPTIONS.find((s) => s.id === sportId)?.clubCode ?? 'GAA';
}

export function primarySportFromSelection(sportId, accountType) {
  if (accountType === 'media') return 'media';
  return sportId || 'gaa';
}

export const DEFAULT_ONBOARDING_STATE = {
  accountType: '',
  sport: '',
  clubName: '',
  county: '',
  clubCode: '',
  planId: '',
  billingPeriod: 'month',
  mediaOutletName: '',
  mediaVerificationInfo: '',
  signupEmail: '',
  completed: false,
};
