/** Shared subscription plan definitions — ClubReporter.ie */

export const CONTACT_EMAIL = 'info@clubreporter.ie';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=Press%20Pass%20enquiry`;

export const PAID_TRIAL_NOTE = 'Credit card required for trial.';
export const FREE_PLAN_NOTE = 'No credit card required.';
export const MEDIA_NO_TRIAL_NOTICE =
  'No trial available for Media accounts — please contact info@clubreporter.ie';
export const MEDIA_NO_TRIAL_NOTE = 'No trial available for Media accounts.';
export const MEDIA_CONTACT_NOTE = `Please contact us at ${CONTACT_EMAIL}`;

export const ONBOARDING_SPORTS = [
  { id: 'gaa', label: 'GAA', emoji: '🏐', desc: 'Football, hurling, camogie and ladies football' },
  { id: 'soccer', label: 'Soccer', emoji: '⚽', desc: 'Senior, junior, underage and womens football' },
  { id: 'rugby', label: 'Rugby', emoji: '🏉', desc: 'Senior, junior, underage and womens rugby' },
];

export const ACCOUNT_TYPE_OPTIONS = [
  {
    id: 'fan',
    emoji: '👥',
    title: 'Fan',
    desc: 'For supporters and community reporters',
  },
  {
    id: 'club',
    emoji: '🏆',
    title: 'Club',
    desc: 'For official clubs, PROs and verified team reporters',
  },
  {
    id: 'media',
    emoji: '📰',
    title: 'Media',
    desc: 'For journalists, photographers and local sports media',
  },
];

/** Compact labels for the signup funnel plan step */
export const SIGNUP_PLAN_OPTIONS = [
  { id: 'free', label: 'Free' },
  { id: 'club', label: 'Club' },
  { id: 'county', label: 'County' },
  { id: 'presspass', label: 'Media' },
];

export function isSignupPlanDisabled(planId, profileType) {
  if (planId === 'presspass') return profileType !== 'media';
  if (profileType === 'media') return true;
  return false;
}

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: 'Forever free',
    month: 0,
    year: 0,
    altPrice: null,
    badge: null,
    highlight: false,
    hasTrial: false,
    trialLabel: null,
    features: [
      '4 matches per month',
      'Manual match entry',
      'Basic match report',
      'ClubReporter watermark on public reports',
      'No credit card required',
    ],
    cta: 'Start Free',
    ctaLink: '/onboarding?plan=free',
    ctaAction: 'free',
    footnote: FREE_PLAN_NOTE,
    mediaOnly: false,
    hideForMedia: false,
  },
  {
    id: 'club',
    name: 'Club',
    price: '€4.99',
    period: '/month',
    month: 4.99,
    year: 44.99,
    altPrice: 'or €44.99/year',
    badge: 'Best for Clubs',
    highlight: true,
    hasTrial: true,
    trialLabel: '14-day free trial',
    features: [
      '14-day free trial',
      'Credit card details required for trial',
      'Unlimited matches',
      'Saved team roster',
      'Photo uploads',
      'Sponsor on reports',
      'Remove ClubReporter watermark',
      'Push notifications',
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/onboarding?plan=club',
    ctaAction: 'trial',
    footnote: null,
    mediaOnly: false,
    hideForMedia: true,
  },
  {
    id: 'county',
    name: 'County',
    price: '€12.99',
    period: '/month',
    month: 12.99,
    year: 119.99,
    altPrice: 'or €119.99/year',
    badge: 'Most Popular',
    highlight: false,
    hasTrial: true,
    trialLabel: '14-day free trial',
    features: [
      '14-day free trial',
      'Credit card details required for trial',
      'Everything in Club',
      'AI report generation',
      'Multiple admins',
      'Analytics',
      'Social media push',
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/onboarding?plan=county',
    ctaAction: 'trial',
    footnote: null,
    mediaOnly: false,
    hideForMedia: true,
  },
  {
    id: 'presspass',
    name: 'Press Pass / Media',
    price: '€34.99',
    period: '/month',
    month: 34.99,
    year: 299.99,
    altPrice: 'or €299.99/year',
    badge: 'For Media',
    highlight: false,
    hasTrial: false,
    trialLabel: null,
    features: [
      'Everything in County',
      'Media profile',
      'Unlimited clubs',
      'Multiple sports',
      'Verified press badge',
      'Contact us to activate',
    ],
    cta: 'Contact Us',
    ctaLink: '/onboarding?account=media&plan=presspass',
    ctaAction: 'contact',
    footnote: MEDIA_NO_TRIAL_NOTE,
    mediaOnly: true,
    hideForMedia: false,
  },
];

/** Plans shown on marketing pricing pages */
export const PRICING_TIERS = SUBSCRIPTION_PLANS.map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  period: p.period,
  altPrice: p.altPrice,
  badge: p.badge,
  highlight: p.highlight,
  features: p.features.filter(
    (f) => !f.startsWith('Credit card') && !f.startsWith('Contact us to activate')
  ),
  cta: p.cta,
  ctaLink: p.ctaLink,
  ctaAction: p.ctaAction,
  hasTrial: p.hasTrial,
  footnote: p.footnote,
}));

export function plansForAccountType(profileType) {
  if (profileType === 'media') {
    return SUBSCRIPTION_PLANS.filter((p) => p.mediaOnly);
  }
  return SUBSCRIPTION_PLANS.filter((p) => !p.mediaOnly);
}

export function getPlanById(id) {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) || SUBSCRIPTION_PLANS[0];
}

export function defaultPlanForAccount(profileType, planParam) {
  if (profileType === 'media') return 'presspass';
  if (planParam && SUBSCRIPTION_PLANS.some((p) => p.id === planParam && !p.mediaOnly)) {
    return planParam;
  }
  return 'free';
}
