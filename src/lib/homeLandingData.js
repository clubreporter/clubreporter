/** Homepage landing copy and config — single ClubReporter brand */

export const ACCENT = {
  primary: '#1a9e6d',
  primaryDark: '#15803d',
  navy: '#0f172a',
  navyLight: '#1e293b',
  gaelic: '#1a6b3c',
  soccer: '#1a3a6b',
  rugby: '#6b1a1a',
};

export const TIMELINE_EVENTS = [
  { minute: "12'", type: 'goal', label: 'Goal — Brian O\'Connor', color: 'text-emerald-400' },
  { minute: "18'", type: 'point', label: 'Point — Seán Murphy', color: 'text-emerald-300' },
  { minute: "24'", type: 'card', label: 'Yellow Card — David Walsh', color: 'text-yellow-400' },
  { minute: "38'", type: 'sub', label: 'Substitution — Cian Ryan for Jack Kelly', color: 'text-blue-400' },
  { minute: "52'", type: 'photo', label: 'Photo Added — Crowd celebration', color: 'text-purple-400' },
  { minute: "67'", type: 'goal', label: 'Goal — Mark O\'Sullivan', color: 'text-emerald-400' },
  { minute: "78'", type: 'note', label: 'Full-time Note — Match report ready', color: 'text-slate-300' },
];

export const CONTROL_BUTTONS = [
  { label: 'Goal', color: 'bg-emerald-600' },
  { label: 'Point', color: 'bg-emerald-500' },
  { label: 'Try', color: 'bg-emerald-700' },
  { label: 'Conversion', color: 'bg-teal-600' },
  { label: 'Yellow Card', color: 'bg-yellow-500 text-gray-900' },
  { label: 'Red Card', color: 'bg-red-600' },
  { label: 'Substitution', color: 'bg-blue-600' },
  { label: 'Injury', color: 'bg-orange-600' },
  { label: 'Attendance', color: 'bg-slate-600' },
  { label: 'Photo Upload', color: 'bg-purple-600' },
  { label: 'Match Note', color: 'bg-slate-500' },
  { label: 'Generate Report', color: 'bg-[#1a9e6d]', wide: true },
];

export const SPORT_CARDS = [
  {
    id: 'gaa',
    title: 'Gaelic Games',
    emoji: '🏐',
    color: ACCENT.gaelic,
    description:
      'For Gaelic football, hurling, camogie and ladies football. Track goals, points, cards, substitutions, photos and match notes in real time.',
    cta: 'Set up Gaelic Reporter',
    signup: '/signup?sport=gaa',
  },
  {
    id: 'soccer',
    title: 'Soccer',
    emoji: '⚽',
    color: ACCENT.soccer,
    description:
      'For soccer clubs and local match reporters. Record goals, assists, bookings, substitutions, injuries, attendance and key match moments.',
    cta: 'Set up Soccer Reporter',
    signup: '/signup?sport=soccer',
  },
  {
    id: 'rugby',
    title: 'Rugby',
    emoji: '🏉',
    color: ACCENT.rugby,
    description:
      'For rugby clubs and media teams. Track tries, conversions, penalties, cards, substitutions and match events from one simple panel.',
    cta: 'Set up Rugby Reporter',
    signup: '/signup?sport=rugby',
  },
];

export const BENEFITS = [
  {
    title: 'Capture Every Key Moment',
    description: 'Record goals, points, tries, cards, substitutions, injuries, photos and notes as the match unfolds.',
    icon: '⚡',
  },
  {
    title: 'Build a Clean Match Timeline',
    description: 'Turn every event into a professional timeline that supporters can follow and clubs can share.',
    icon: '📋',
  },
  {
    title: 'Generate Match Reports Faster',
    description: 'Create a structured match report without starting from a blank page.',
    icon: '✨',
  },
  {
    title: 'Keep Supporters Updated',
    description: 'Give followers a clear, reliable match story before, during and after the final whistle.',
    icon: '📣',
  },
  {
    title: 'Add Photos to the Story',
    description: 'Bring the match story to life with photos linked to key match moments.',
    icon: '📸',
  },
  {
    title: 'Built for Clubs and Media',
    description: 'Perfect for club PROs, volunteers, local reporters, photographers and sports media pages.',
    icon: '🏆',
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Choose your sport',
    description: 'Select Gaelic, soccer or rugby so the reporting tools match your game.',
  },
  {
    step: 2,
    title: 'Record the match',
    description: 'Use the control panel to add scores, cards, substitutions, notes and photos as they happen.',
  },
  {
    step: 3,
    title: 'Publish the story',
    description: 'Create a clean timeline and match report ready to share with supporters, media and club channels.',
  },
];

export const FEATURE_BULLETS = [
  'Live match timeline',
  'Sport-specific event buttons',
  'Player and team details',
  'Photo uploads',
  'Sponsor-ready reports',
  'Match report generation',
  'Social sharing support',
  'Multiple club/media options on higher tiers',
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: 'Forever free',
    highlight: false,
    badge: null,
    features: [
      '4 matches per month',
      'Manual match entry',
      'Basic match report',
      'No photo uploads',
      'ClubReporter watermark on public reports',
      'No credit card required',
    ],
    cta: 'Start Free',
    ctaLink: '/signup',
  },
  {
    id: 'club',
    name: 'Club',
    price: '€4.99',
    period: '/month',
    altPrice: 'or €44.99/year',
    highlight: true,
    badge: 'Best for Clubs',
    trial: '14-day free trial',
    features: [
      'Unlimited matches',
      'Saved team roster',
      'Photo uploads',
      'Sponsor on reports',
      'Remove ClubReporter watermark',
      'Push notifications',
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/signup',
  },
  {
    id: 'county',
    name: 'County',
    price: '€12.99',
    period: '/month',
    altPrice: 'or €119.99/year',
    highlight: false,
    badge: null,
    trial: '14-day free trial',
    features: [
      'Everything in Club',
      'AI report generation',
      'Multiple admins',
      'Analytics',
      'Social media push',
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/signup',
  },
  {
    id: 'presspass',
    name: 'Press Pass',
    price: '€34.99',
    period: '/month',
    altPrice: 'or €299.99/year',
    highlight: false,
    badge: null,
    trial: '14-day free trial',
    features: [
      'Everything in County',
      'Media profile',
      'Unlimited clubs',
      'Multiple sports',
      'Verified press badge',
    ],
    cta: 'Start 14-Day Trial',
    ctaLink: '/signup?account=media',
  },
];

export function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
