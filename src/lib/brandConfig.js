/** ClubReporter.ie multi-product brand configuration */

export const BRAND = {
  master: { name: 'ClubReporter.ie', tagline: 'One platform. Sport-specific match reports.' },
  gaa: {
    key: 'gaa',
    product: 'GaelicReporter',
    slug: '/gaelicreporter',
    color: '#1a6b3c',
    colorHsl: '152 58% 26%',
    emoji: '🏐',
    motif: '☘️',
    signupLabel: 'Start Free — GAA Clubs',
    signupQuery: '?sport=gaa',
  },
  soccer: {
    key: 'soccer',
    product: 'PitchReporter',
    slug: '/pitchreporter',
    color: '#1a3a6b',
    colorHsl: '217 58% 26%',
    emoji: '⚽',
    motif: '⚽',
    signupLabel: 'Start Free — Soccer Clubs',
    signupQuery: '?sport=soccer',
  },
  rugby: {
    key: 'rugby',
    product: 'RugbyReporter',
    slug: '/rugbyreporter',
    color: '#6b1a1a',
    colorHsl: '0 58% 26%',
    emoji: '🏉',
    motif: '🏉',
    signupLabel: 'Start Free — Rugby Clubs',
    signupQuery: '?sport=rugby',
  },
  media: {
    key: 'media',
    product: 'Press Pass',
    slug: '/press-pass',
    color: '#c9a84c',
    colorHsl: '43 52% 54%',
    emoji: '📰',
    motif: '🎖️',
    signupLabel: 'Apply for Press Pass',
    signupQuery: '?account=media',
  },
};

export const PRODUCT_CARDS = [
  {
    ...BRAND.gaa,
    title: 'GaelicReporter',
    description:
      'For GAA, hurling, camogie and ladies football clubs. Track goals, points, cards, substitutions and generate match reports in minutes.',
    linkText: 'Learn more about GaelicReporter',
  },
  {
    ...BRAND.soccer,
    title: 'PitchReporter',
    description:
      'For soccer clubs. Track line-ups, goals, assists, cards and build live match timelines. Perfect for club PROs and local football pages.',
    linkText: 'Learn more about PitchReporter',
  },
  {
    ...BRAND.rugby,
    title: 'RugbyReporter',
    description:
      'For rugby clubs. Track tries, conversions, penalties, sin bins and yellow cards. Generate professional post-match reports.',
    linkText: 'Learn more about RugbyReporter',
  },
  {
    ...BRAND.media,
    title: 'Press Pass',
    description:
      'For journalists, photographers and local media. Cover multiple clubs across multiple sports. Generate reports and publish directly to your website or social media.',
    linkText: 'Learn more about Press Pass',
  },
];

export const HOME_TESTIMONIALS = [
  {
    quote: 'We used to spend hours writing match reports after the game. GaelicReporter does it in minutes.',
    name: 'John Murphy',
    role: 'Barryroe GAA PRO',
  },
  {
    quote: 'PitchReporter made our Saturday match updates instant. Supporters love the live timeline.',
    name: 'Sarah Keane',
    role: 'Midleton FC Club Manager',
  },
  {
    quote: 'As a local journalist covering five clubs every weekend, Press Pass has changed everything.',
    name: 'Pat Collins',
    role: 'Southern Star',
  },
];

export const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: 'forever',
    highlight: false,
    features: [
      '4 matches per month',
      'Manual player entry',
      'Basic timeline',
      'Basic report',
      'All sports supported',
      'No credit card required',
    ],
    cta: 'Sign up free',
    ctaLink: '/signup',
  },
  {
    id: 'club',
    name: 'Club',
    price: '€4.99',
    period: '/month',
    altPrice: '€44.99/year',
    highlight: false,
    features: [
      'Unlimited matches',
      'Saved roster',
      'Photo uploads',
      'Sponsor on reports',
      'Push notifications',
      'All sports supported',
    ],
    cta: 'Start free trial',
    ctaLink: '/signup',
  },
  {
    id: 'county',
    name: 'County',
    price: '€12.99',
    period: '/month',
    altPrice: '€119.99/year',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Club',
      'AI newspaper style reports',
      'Multiple admins',
      'Analytics',
      'Social media push',
      'All sports supported',
    ],
    cta: 'Start free trial',
    ctaLink: '/signup',
  },
  {
    id: 'presspass',
    name: 'Press Pass',
    price: '€34.99',
    period: '/month',
    altPrice: '€299.99/year',
    highlight: false,
    features: [
      'Everything in County',
      'Media profile',
      'Unlimited clubs',
      'All sports',
      'Verified press badge',
    ],
    cta: 'Apply now',
    ctaLink: '/signup?account=media',
  },
];

export const SPORT_COMPARISON = {
  headers: ['Feature', 'GAA', 'Soccer', 'Rugby'],
  rows: [
    ['Scoring format', 'Goals & points (1-12)', 'Goals only (2-1)', 'Tries & conversions (24-17)'],
    ['Players per team', '15', '11', '15'],
    ['Match duration', '60–70 minutes', '90 minutes', '80 minutes'],
    ['Incident types', 'Goal, point, wide, cards, sub', 'Goal, assist, cards, VAR', 'Try, conversion, sin bin, scrum'],
    ['Report style', 'GAA newspaper', 'Soccer match report', 'Rugby post-match'],
    ['Position names', 'Full back, half forward', 'Striker, midfielder', 'Prop, fly-half, wing'],
  ],
};

export function getBrandForUser(user) {
  if (!user) return BRAND.gaa;
  if (user.profileType === 'media') return BRAND.media;
  const sport = user.primarySport || 'gaa';
  if (sport === 'soccer') return BRAND.soccer;
  if (sport === 'rugby') return BRAND.rugby;
  if (sport === 'multi') return { ...BRAND.master, key: 'multi', product: 'ClubReporter', color: '#1a6b3c', colorHsl: '152 58% 26%' };
  return BRAND.gaa;
}

export function applyBrandTheme(brandKey) {
  const brand = Object.values(BRAND).find((b) => b.key === brandKey) || BRAND.gaa;
  if (!brand.colorHsl) return;
  document.documentElement.style.setProperty('--primary', brand.colorHsl);
  document.documentElement.style.setProperty('--ring', brand.colorHsl);
}
