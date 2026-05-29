/** Homepage landing copy and config — ClubReporter.ie */

import { SUBSCRIPTION_PLANS, PAID_TRIAL_NOTE, FREE_PLAN_NOTE } from '@/lib/planConfig';

export const PAGE_TITLE = 'ClubReporter – Match Reporting for Clubs';

export const ACCENT = {
  primary: '#1a9e6d',
  primaryDark: '#15803d',
  navy: '#0f172a',
  gaelic: '#1a6b3c',
  soccer: '#1a3a6b',
  rugby: '#6b1a1a',
};

export const HERO = {
  headline: 'Match reports made simple for GAA, soccer and rugby clubs.',
  subheadline:
    'Track scores, scorers, cards, substitutions, photos and key moments live — then publish a clean match timeline and report for your club.',
  trustLine: 'Built for club PROs, coaches, reporters and local sports media.',
  primaryCta: 'Start your first match report',
  primaryLink: '/onboarding',
  secondaryCta: 'View sample report',
  secondaryAction: 'sample-report',
};

export const MOCKUP = {
  competition: 'Cork SFC · Round 3',
  venue: 'Clonakilty',
  homeTeam: 'Barryroe GAA',
  awayTeam: 'Kilbrittain',
  homeScore: '1-09',
  awayScore: '0-07',
  events: [
    { minute: "03'", label: 'Goal — Barryroe GAA — Jack O\'Brien', type: 'goal' },
    { minute: "17'", label: 'Yellow Card — Kilbrittain', type: 'card' },
    { minute: "29'", label: 'Point — Barryroe GAA', type: 'point' },
    { minute: 'HT', label: 'HT Score: Barryroe 1-06 Kilbrittain 0-05', type: 'ht', highlight: true },
    { minute: "44'", label: 'Substitution — Barryroe GAA', type: 'sub' },
    { minute: "61'", label: 'Goal photo uploaded', type: 'photo', hasThumb: true },
    { minute: 'FT', label: 'Report generated', type: 'report', highlight: true },
  ],
};

export const SPORT_CARDS = [
  {
    id: 'gaa',
    title: 'GAA Reporter',
    emoji: '🏐',
    color: ACCENT.gaelic,
    description: 'For Gaelic football, hurling, camogie and ladies football.',
    cta: 'Start GAA Reporting',
    signup: '/onboarding?sport=gaa',
  },
  {
    id: 'soccer',
    title: 'Soccer Reporter',
    emoji: '⚽',
    color: ACCENT.soccer,
    description: 'For goals, assists, cards, substitutions and match reports.',
    cta: 'Start Soccer Reporting',
    signup: '/onboarding?sport=soccer',
  },
  {
    id: 'rugby',
    title: 'Rugby Reporter',
    emoji: '🏉',
    color: ACCENT.rugby,
    description: 'For tries, conversions, penalties, cards and team updates.',
    cta: 'Start Rugby Reporting',
    signup: '/onboarding?sport=rugby',
  },
];

export const PROBLEM_SOLUTION = {
  headline: 'Stop typing match notes into WhatsApp, Notes or Facebook.',
  subheadline: 'Build the match report live as the game happens.',
  benefits: [
    { title: 'Capture every key moment', icon: '⚡' },
    { title: 'Save time after full-time', icon: '⏱️' },
    { title: 'Publish cleaner reports for supporters', icon: '📣' },
  ],
};

export const FEATURES = [
  {
    id: 'timeline',
    title: 'Live Match Timeline',
    description: 'Record goals, points, tries, cards, substitutions and major incidents as they happen.',
    icon: 'timeline',
  },
  {
    id: 'photos',
    title: 'Photo Uploads',
    description: 'Add match photos directly to the timeline and report.',
    icon: 'camera',
  },
  {
    id: 'report',
    title: 'Auto Report Builder',
    description: 'Turn your timeline into a clean editable match report.',
    icon: 'report',
  },
  {
    id: 'roster',
    title: 'Team & Roster Management',
    description: 'Save players, positions, squad lists and team details for faster match setup.',
    icon: 'users',
  },
  {
    id: 'sponsor',
    title: 'Sponsor Placement',
    description: 'Add sponsor branding to public reports.',
    icon: 'sponsor',
  },
  {
    id: 'share',
    title: 'Social & Public Sharing',
    description: 'Share match updates, timelines and reports with supporters.',
    icon: 'share',
  },
];

export const ACCOUNT_TYPES = [
  {
    id: 'verified',
    title: 'Verified Club Accounts',
    badge: 'Verified Club',
    badgeStyle: 'bg-emerald-600 text-white',
    description:
      'Official club accounts verified by invite link, club email, admin approval or manual review.',
    detail: 'Verified reports display a verified badge on the public match page.',
  },
  {
    id: 'fan',
    title: 'Fan Reporter Accounts',
    badge: 'Community Report',
    badgeStyle: 'bg-slate-600 text-white',
    description:
      'Supporters, local media pages and community reporters can publish reports clearly marked as fan or community coverage.',
    detail: 'Fan reports are labelled so supporters know the source of the coverage.',
  },
];

export const SAMPLE_REPORT = {
  headline: 'See what a finished report looks like.',
  subheadline: 'A sample match timeline and final report — before you sign up.',
  timeline: [
    "03' Goal — Jack O'Brien (Barryroe GAA)",
    "17' Yellow Card — Kilbrittain",
    "29' Point — Barryroe GAA",
    'HT — Barryroe 1-06, Kilbrittain 0-05',
    "44' Substitution — Barryroe GAA",
    "61' Photo — Goal celebration uploaded",
  ],
  reportExcerpt: `Barryroe GAA secured a valuable Cork Senior Football Championship win over Kilbrittain at Clonakilty, with Jack O'Brien's early goal setting the tone for a disciplined team performance.

The west Cork side led 1-06 to 0-05 at half time and managed the second half well despite a spirited Kilbrittain comeback. Key moments included a second-half substitution and a goal celebration photo shared live with supporters.

Barryroe's PRO published the full match report within minutes of the final whistle — a clean, structured timeline supporters could follow from throw-in to full-time.`,
};

export const PRICING_PLANS = SUBSCRIPTION_PLANS;
export { PAID_TRIAL_NOTE, FREE_PLAN_NOTE };

export const PRICING_PREVIEW = SUBSCRIPTION_PLANS.filter((p) => p.id !== 'free').map((p) => ({
  id: p.id,
  name: p.name,
  description:
    p.id === 'club'
      ? 'Best for clubs that want quick, clean match reports every week.'
      : p.id === 'county'
        ? 'Best for clubs with multiple teams, admins and regular coverage.'
        : 'Best for local media covering multiple clubs across multiple sports.',
  price: p.id === 'presspass' ? '€34.99/mo' : p.price + (p.period?.startsWith('/') ? p.period : ''),
  highlight: p.highlight,
  hasTrial: p.hasTrial,
  cta: p.cta,
  ctaLink: p.ctaLink,
  ctaAction: p.ctaAction,
}));

export const FINAL_CTA = {
  headline: 'Create your first professional match report today.',
  subheadline: 'From throw-in to full-time, ClubReporter helps you capture the story of the game.',
  primaryCta: 'Start your first match report',
  secondaryCta: 'View sample report',
};

export function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
