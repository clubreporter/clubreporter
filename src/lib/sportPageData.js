import { BRAND } from '@/lib/brandConfig';

const GAA_EXAMPLE = `BARRYROE 1-12 (15) 0-14 KILBRITTAIN

Barryroe moved top of the Cork County Senior Football Championship table with a hard-fought victory over Kilbrittain at a wet and windy Clonakilty on Sunday.

Goals from Ciarán Murphy (54') and a late Jamie Hurley point sealed the win for the west Cork side, who led 0-08 to 0-06 at half time.

Kilbrittain fought back through points from D. O'Callaghan and M. Walsh, but a black card for the visitors on 43' disrupted their rhythm.

Barryroe's defence, marshalled from full back, held firm in the closing stages to secure a valuable two-point win.`;

const SOCCER_EXAMPLE = `MIDLETON FC 2-1 CARRIGTWOHILL UNITED

Midleton FC secured a crucial Munster Senior League victory at Knockgriffin on Saturday thanks to a second-half strike from striker David O'Brien.

The home side took an early lead through a well-worked team goal before Carrigtwohill equalised from the penalty spot on 38'.

O'Brien's 67th-minute winner, set up by midfielder Sarah Keane, proved the difference in a tense local derby watched by over 400 supporters.

Both teams finished with ten men after late yellow cards, but Midleton held on for three valuable points.`;

const RUGBY_EXAMPLE = `CORK CONSTITUTION 24-17 DULBIN UNIVERSITY

Cork Constitution secured a hard-earned AIL Division 1A victory at Temple Hill on Saturday in a match decided by set-piece dominance and clinical finishing.

Tries from the wing and number eight, converted by the fly-half, gave Con a 17-10 half-time lead after a sin bin for the visitors on 32'.

DU hit back with a penalty and unconverted try, but a late drop goal sealed the win for the home side in front of a vocal Cork crowd.

The scrum and lineout proved decisive throughout, with Con winning the battle at the breakdown in the closing quarter.`;

export const GAELIC_PAGE = {
  brand: BRAND.gaa,
  headline: 'Match reports for GAA clubs. Built the right way.',
  subheadline: 'Track goals, points, cards and substitutions with GAA-native scoring, positions and AI reports.',
  features: [
    { emoji: '🎯', title: 'Goals & points scoring', desc: 'GAA format 1-12 — not a single total like other sports.' },
    { emoji: '👥', title: '15-player line-up', desc: 'Full GAA positions from goalkeeper to corner forward.' },
    { emoji: '📋', title: 'GAA incidents', desc: 'Goal, point, wide, 45, black card, yellow, red, sub, injury, free.' },
    { emoji: '⏱️', title: 'Half time at 30 minutes', desc: 'Match controls built for GAA timing.' },
    { emoji: '➕', title: 'Extra time support', desc: 'Continue reporting through extra time and beyond.' },
    { emoji: '📰', title: 'AI GAA newspaper reports', desc: 'Generate reports in authentic GAA newspaper style.' },
  ],
  codes: 'Gaelic football, hurling, camogie, ladies football',
  exampleTitle: 'Example GAA match report',
  exampleContent: GAA_EXAMPLE,
  pricingHighlight: 'GAA clubs',
};

export const SOCCER_PAGE = {
  brand: BRAND.soccer,
  headline: 'Live match reporting for soccer clubs across Ireland.',
  subheadline: 'Line-ups, goals, assists, cards and live timelines — built for club PROs and local football pages.',
  features: [
    { emoji: '⚽', title: 'Goals-only scoring', desc: 'Simple 2-1 scorelines — no points system.' },
    { emoji: '👥', title: '11-player line-up', desc: 'Full soccer positions from keeper to striker.' },
    { emoji: '📐', title: 'Formation selector', desc: '4-4-2, 4-3-3, 3-5-2 and more.' },
    { emoji: '📋', title: 'Soccer incidents', desc: 'Goal, own goal, assist, cards, penalties, VAR, offside, sub, injury.' },
    { emoji: '⏱️', title: '90-minute match timer', desc: 'Built for standard and stoppage time.' },
    { emoji: '🏆', title: 'Extra time & penalties', desc: 'Full shootout and extra time modes.' },
    { emoji: '📰', title: 'AI soccer reports', desc: 'Newspaper-style reports with formation and competition context.' },
  ],
  codes: 'Senior, junior, underage, womens football',
  exampleTitle: 'Example soccer match report',
  exampleContent: SOCCER_EXAMPLE,
  pricingHighlight: 'Soccer clubs',
};

export const RUGBY_PAGE = {
  brand: BRAND.rugby,
  headline: 'Professional match reports for Irish rugby clubs.',
  subheadline: 'Tries, conversions, penalties, sin bins and set pieces — with rugby-native reporting.',
  features: [
    { emoji: '🏉', title: 'Rugby scoring', desc: 'Try, conversion, penalty and drop goal tracking.' },
    { emoji: '👥', title: '15-player line-up', desc: 'Full rugby positions from prop to full back.' },
    { emoji: '📋', title: 'Rugby incidents', desc: 'Try, conversion, penalty, drop goal, cards, sin bin, scrum, lineout.' },
    { emoji: '⏱️', title: '80-minute match timer', desc: 'Built for standard rugby match duration.' },
    { emoji: '➕', title: 'Extra time support', desc: 'Continue through extra time when needed.' },
    { emoji: '📰', title: 'AI rugby reports', desc: 'Professional post-match reports with set-piece references.' },
  ],
  codes: 'Senior, junior, underage, womens rugby',
  exampleTitle: 'Example rugby match report',
  exampleContent: RUGBY_EXAMPLE,
  pricingHighlight: 'Rugby clubs',
};

export const PRESS_PAGE = {
  brand: BRAND.media,
  headline: 'One tool. Every sport. Every match.',
  subheadline: 'Cover unlimited clubs across GAA, soccer and rugby. Publish reports attributed to your outlet.',
  features: [
    { emoji: '🌐', title: 'Unlimited clubs & sports', desc: 'Cover multiple clubs across all supported sports.' },
    { emoji: '📰', title: 'Media profile', desc: 'Your outlet branding instead of a single club profile.' },
    { emoji: '✍️', title: 'Report attribution', desc: 'Every report credited to your media outlet.' },
    { emoji: '🔗', title: 'Direct website link', desc: 'Link reports back to your website or social channels.' },
    { emoji: '📸', title: 'Photo uploads & galleries', desc: 'Attach photos to match moments and reports.' },
    { emoji: '🎙️', title: 'Voice to text reporting', desc: 'Dictate match updates from the sideline.' },
    { emoji: '📰', title: 'AI newspaper reports', desc: 'Generate publication-ready match reports in seconds.' },
    { emoji: '🎖️', title: 'Verified press badge', desc: 'Verified badge displayed on all your published reports.' },
  ],
  codes: 'GAA, soccer, rugby — all supported',
  showPricing: false,
  verification: {
    title: 'Press Pass verification',
    items: [
      'Media outlet name required on signup',
      'Website or social media page required for verification',
      'Our team reviews applications within 24 hours',
      'Our team reviews applications within 24 hours',
      'Contact us to activate your Press Pass account',
    ],
    note: 'Press Pass is €34.99/month or €299.99/year. No trial available for Media accounts — please contact info@clubreporter.ie.',
  },
};
