import { BRAND } from '@/lib/brandConfig';

export const LANDING_TABS = [
  { id: 'all', label: 'All Sports', color: '#1a6b3c', motif: null },
  { id: 'gaa', label: 'GAA', color: '#1a6b3c', motif: '☘️' },
  { id: 'soccer', label: 'Soccer', color: '#1a3a6b', motif: '⚽' },
  { id: 'rugby', label: 'Rugby', color: '#6b1a1a', motif: '🏉' },
  { id: 'press', label: 'Press Pass', color: '#c9a84c', motif: '🎖️' },
];

export const HERO_CONTENT = {
  all: {
    tagline: 'One platform. Sport-specific match reports for GAA, soccer, and rugby clubs across Ireland.',
    cta: 'Start Free Trial',
    ctaLink: '/signup',
  },
  gaa: {
    tagline: 'Match reports for GAA clubs. Built the right way.',
    cta: 'Start Free — GAA Clubs',
    ctaLink: '/signup?sport=gaa',
  },
  soccer: {
    tagline: 'Live match reporting for soccer clubs across Ireland.',
    cta: 'Start Free — Soccer Clubs',
    ctaLink: '/signup?sport=soccer',
  },
  rugby: {
    tagline: 'Professional match reports for Irish rugby clubs.',
    cta: 'Start Free — Rugby Clubs',
    ctaLink: '/signup?sport=rugby',
  },
  press: {
    tagline: 'One tool. Every sport. Every match.',
    cta: 'Apply for Press Pass',
    ctaLink: '/signup?account=media',
  },
};

export const QUICK_LINKS = {
  all: [
    { label: 'GAA', tab: 'gaa', section: 'features' },
    { label: 'Soccer', tab: 'soccer', section: 'features' },
    { label: 'Rugby', tab: 'rugby', section: 'features' },
    { label: 'Press Pass', tab: 'press', section: 'features' },
    { label: 'Pricing', tab: 'all', section: 'pricing' },
  ],
  gaa: [
    { label: 'GAA Football', section: 'features' },
    { label: 'Hurling', section: 'features' },
    { label: 'Camogie', section: 'features' },
    { label: 'Ladies Football', section: 'features' },
    { label: 'All Codes', section: 'features' },
  ],
  soccer: [
    { label: 'Senior Football', section: 'features' },
    { label: 'Junior Football', section: 'features' },
    { label: 'Underage', section: 'features' },
    { label: 'Womens Football', section: 'features' },
    { label: 'Futsal', section: 'features' },
  ],
  rugby: [
    { label: 'Senior Rugby', section: 'features' },
    { label: 'Junior Rugby', section: 'features' },
    { label: 'Underage Rugby', section: 'features' },
    { label: 'Womens Rugby', section: 'features' },
  ],
  press: [
    { label: 'Club Coverage', section: 'features' },
    { label: 'Multi-Sport', section: 'features' },
    { label: 'Photography', section: 'features' },
    { label: 'Media Outlets', section: 'features' },
  ],
};

export const CORE_FEATURES = [
  {
    id: 'timeline',
    icon: 'clock-zap',
    title: 'Live Match Timeline',
    description:
      'Record every key moment as it happens — goals, cards, substitutions, injuries and more. Each event is time-stamped and player-attributed. Build the full match story in real time from the first whistle to the last.',
    details: [
      'Tap to record any incident instantly',
      'Add player name and minute automatically',
      'Voice to text description for detail',
      'Undo last incident if you make a mistake',
      'Timeline syncs live to the public page',
      'Followers see updates in real time',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby'],
  },
  {
    id: 'ai-report',
    icon: 'sparkles',
    title: 'AI Match Report Generator',
    description:
      'When the final whistle blows tap Generate Report. ClubReporter takes your live timeline and turns it into a professional newspaper-style match report in seconds. Edit before publishing or share as-is.',
    details: [
      'Structured report auto-filled from timeline',
      'AI newspaper style option for richer prose',
      'Edit any section before publishing',
      'Saves hours compared to writing manually',
      'Report remembers half time scores, scorers and key moments',
      'Published instantly with one tap',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby', 'press'],
  },
  {
    id: 'public-share',
    icon: 'share',
    title: 'Public Share Page',
    description:
      'Every match gets a unique public URL the moment it is created. Share it on WhatsApp, Facebook, Twitter or by text. Anyone can follow the match live without needing an account.',
    details: [
      'Unique URL for every match — shareable instantly',
      'Live score updates visible to anyone',
      'Timeline of events appears in real time',
      'Share buttons built into every report page',
      'View count shows how many people are following',
      'Works on any device — no app download needed',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby', 'press'],
  },
  {
    id: 'photos',
    icon: 'camera',
    title: 'Photos and Video Clips',
    description:
      'Attach photos and short video clips directly to match moments in the timeline. Team photos, goal celebrations, player of the match — all linked to the match and visible on the public report page.',
    details: [
      'Upload photos during or after the match',
      'Attach clips up to 60 seconds',
      'Link media to specific incidents',
      'Match gallery displayed on report page',
      'Sponsor logo watermark option',
      'Download full gallery after the match',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby', 'press'],
  },
  {
    id: 'sponsor',
    icon: 'handshake',
    title: 'Sponsor Every Report',
    description:
      'Add a sponsor logo and link to every published match report. Your club sponsor gets prominent display on every report page every time it is shared. Track impressions and clicks so sponsors see their value.',
    details: [
      'Upload sponsor logo in club settings',
      'Appears on every published report',
      'Sponsor link tracked for clicks',
      'Impression count per report',
      'Show sponsors proof of reach',
      'Different sponsor per match if needed',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby'],
  },
  {
    id: 'push',
    icon: 'bell',
    title: 'Live Match Alerts',
    description:
      'Followers who subscribe to your club get push notifications for key match events. Goals, red cards, and full time results delivered instantly to their phone — wherever they are.',
    details: [
      'Followers subscribe with one tap',
      'Goal alerts sent instantly',
      'Red card and half time notifications',
      'Full time result notification',
      'Works on Android and iOS',
      'Club controls which events trigger alerts',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby'],
  },
  {
    id: 'club-profile',
    icon: 'shield',
    title: 'Club Profile',
    description:
      'Create a professional club profile with your logo, colours, home ground, social media links and contact details. Your profile appears on every report you publish — building your club brand with every match covered.',
    details: [
      'Club logo and colours applied throughout',
      'Social media links on every report',
      'Home ground and county displayed',
      'All match history in one place',
      'Sponsor management from one screen',
      'Multiple admin users for different teams',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby'],
  },
  {
    id: 'lineups',
    icon: 'users',
    title: 'Team Line-Ups',
    description:
      'Add your starting lineup before the match with player names, numbers and positions. For GAA that is 15 positions. For soccer it is 11 with formation selector. Lineups appear on the public report page and are saved to your squad automatically.',
    details: [
      'Full lineup with positions per sport',
      'Save players to squad for reuse',
      'CSV import for bulk player upload',
      'Formation selector for soccer',
      'Substitutions tracked automatically',
      'Lineup printed on the match report',
    ],
    sports: ['all', 'gaa', 'soccer', 'rugby'],
  },
];

export const SPORT_FEATURES = {
  gaa: [
    {
      id: 'gaa-scoring',
      icon: 'gaa-ball',
      title: 'GAA Scoring — Goals and Points',
      description:
        'ClubReporter understands GAA scoring natively. Scores displayed as 1-12 not 25. Goals and points tracked separately throughout the match. Half time and full time scores recorded correctly every time.',
      details: [
        'Goals and points scored separately',
        'Score displayed in correct GAA format',
        '45s tracked separately from points',
        'Penalty scoring included',
        'Extra time scoring support',
        'Works for football, hurling, camogie and ladies football',
      ],
    },
    {
      id: 'gaa-codes',
      icon: 'shamrock',
      title: 'All Four Codes Supported',
      description:
        'GaelicReporter covers GAA football, hurling, camogie, and ladies football. Each code has the correct incident types, positions, and scoring format built in.',
      details: [
        'GAA Football — full incident set',
        'Hurling — puck outs and sidelines included',
        'Camogie — same as hurling with ladies specific options',
        'Ladies Football — same as GAA football',
        'Select code when creating a match',
        'Report language adapts to the code',
      ],
    },
  ],
  soccer: [
    {
      id: 'soccer-scoring',
      icon: 'soccer-ball',
      title: 'Football Specific Scoring',
      description:
        'PitchReporter tracks goals only with no points system. Includes own goals, assists, penalties, VAR reviews and offsides. Match timer runs to 90 minutes with extra time and penalty shootout mode.',
      details: [
        'Goals only — no points confusion',
        'Own goals tracked separately',
        'Assist attribution per goal',
        'Penalty shootout mode with scores',
        'VAR review incident type',
        '90 minute timer with injury time',
      ],
    },
    {
      id: 'formation',
      icon: 'tactics',
      title: 'Formation and Tactics',
      description:
        'Select your formation before the match — 4-4-2, 4-3-3, 3-5-2, 4-2-3-1 and more. Player positions auto-populate based on your chosen formation. Change formation at half time if needed.',
      details: [
        '8 standard formations available',
        'Player positions auto-fill',
        'Visual formation display',
        'Half time formation change tracked',
        'Formation appears in match report',
        'Tactical notes field for manager',
      ],
    },
  ],
  rugby: [
    {
      id: 'rugby-scoring',
      icon: 'rugby-ball',
      title: 'Rugby Scoring System',
      description:
        'RugbyReporter tracks tries, conversions, penalties and drop goals with correct point values. Yellow cards, red cards and sin bins all recorded. 80 minute timer with extra time support.',
      details: [
        'Try — 5 points',
        'Conversion — 2 points',
        'Penalty — 3 points',
        'Drop goal — 3 points',
        'Yellow card and sin bin timer',
        '80 minute match with extra time',
      ],
    },
    {
      id: 'set-pieces',
      icon: 'scrum',
      title: 'Set Pieces and Restarts',
      description:
        'Record scrums, lineouts, mauls and restarts as they happen. Build a complete picture of the match beyond just the scoring plays.',
      details: [
        'Scrum awarded to either team',
        'Lineout won or lost',
        'Maul and ruck incidents',
        'Restart after try',
        'Penalty kicked or tapped',
        'All incidents timestamped',
      ],
    },
  ],
  press: [
    {
      id: 'multi-club',
      icon: 'globe',
      title: 'Cover Any Club Any Sport',
      description:
        'Press Pass users are not tied to one club. Cover any match across any sport with a single account. Perfect for local journalists covering multiple teams every weekend.',
      details: [
        'No club affiliation required',
        'Cover GAA, soccer and rugby from one account',
        'Reports attributed to your media outlet',
        'Build a portfolio of match coverage',
        'Link directly to your website',
        'Export all reports as a media pack',
      ],
    },
    {
      id: 'press-badge',
      icon: 'badge',
      title: 'Verified Media Badge',
      description:
        'Press Pass accounts are verified against media outlet details. All reports carry a verified press badge showing readers the content is from a credentialled journalist or media outlet.',
      details: [
        'Automatic verification process',
        'Media outlet name on all reports',
        'Verified badge visible on public page',
        'Builds reader trust and credibility',
        'Accepted by GAA clubs for accreditation',
        'Badge links to your media outlet',
      ],
    },
  ],
};

export function getFeaturesForTab(tab) {
  if (tab === 'all') return CORE_FEATURES;
  if (tab === 'press') {
    return [
      ...CORE_FEATURES.filter((f) => f.sports.includes('press')),
      ...SPORT_FEATURES.press,
    ];
  }
  const core = CORE_FEATURES.filter((f) => f.sports.includes(tab));
  const specific = SPORT_FEATURES[tab] || [];
  return [...core, ...specific];
}

export const STATS_BY_TAB = {
  all: [
    { value: 2300, suffix: '+', label: 'GAA clubs in Ireland' },
    { value: 3000, suffix: '+', label: 'soccer clubs in Ireland' },
    { value: 230, suffix: '+', label: 'rugby clubs in Ireland' },
    { value: null, text: 'Minutes not hours', label: 'Reports published' },
  ],
  gaa: [
    { value: 2300, suffix: '+', label: 'GAA clubs' },
    { value: 32, suffix: '', label: 'counties covered' },
    { value: 4, suffix: '', label: 'codes supported' },
    { value: null, text: 'GAA newspaper style', label: 'Reports in' },
  ],
  soccer: [
    { value: 3000, suffix: '+', label: 'soccer clubs' },
    { value: null, text: 'All divisions', label: 'covered' },
    { value: null, text: 'FAI & local leagues', label: '' },
    { value: null, text: 'Soccer specific', label: 'scoring' },
  ],
  rugby: [
    { value: 230, suffix: '+', label: 'rugby clubs' },
    { value: null, text: 'Leinster, Munster, Ulster, Connacht', label: '' },
    { value: null, text: 'All age grades', label: 'supported' },
    { value: null, text: 'IRFU club', label: 'coverage' },
  ],
  press: [
    { value: null, text: 'Unlimited', label: 'clubs covered' },
    { value: null, text: 'All sports', label: 'one account' },
    { value: null, text: 'Verified', label: 'media credentials' },
    { value: null, text: 'Direct to', label: 'your website' },
  ],
};

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Create your match',
    description:
      'Enter teams, competition, venue and date. Takes 60 seconds. Your match page is live immediately with a shareable URL.',
  },
  {
    step: 2,
    title: 'Record live events',
    description:
      'Tap the incident buttons as events happen. Goal, card, substitution — each tap adds to the live timeline instantly. Use voice to text for richer descriptions.',
  },
  {
    step: 3,
    title: 'Share as it happens',
    description:
      'Your followers see every update in real time on the public match page. Share the link on WhatsApp or social media and let the match come to them.',
  },
  {
    step: 4,
    title: 'Generate your report',
    description:
      'At full time tap Generate Report. Your AI-powered match report is ready in seconds. Edit if needed then publish with one tap.',
  },
];

export const TESTIMONIALS_BY_TAB = {
  all: [
    { quote: 'We used to spend hours writing match reports after the game. Now it is done in minutes.', name: 'John Murphy', role: 'Barryroe GAA PRO' },
    { quote: 'PitchReporter made our Saturday match updates instant. Supporters love the live timeline.', name: 'Sarah Keane', role: 'Midleton FC Club Manager' },
    { quote: 'As a local journalist covering five clubs every weekend, Press Pass has changed everything.', name: 'Pat Collins', role: 'Southern Star' },
  ],
  gaa: [
    { quote: "We used to spend Sunday nights writing the match report from memory. Now it is done before we leave the ground.", name: "Michael O'Sullivan", role: 'Barryroe GAA PRO' },
    { quote: 'The AI report feature is incredible. It writes better than I do and takes 30 seconds instead of an hour.', name: 'Sinéad Murphy', role: 'Castlehaven GAA' },
    { quote: 'Our county board recommended ClubReporter to every club. It has transformed our coverage.', name: 'Pat Collins', role: 'Cork GAA Officer' },
  ],
  soccer: [
    { quote: 'Finally a match reporting app that understands soccer. Not a GAA app with soccer bolted on.', name: 'James Ryan', role: 'Cork City AFC Manager' },
    { quote: 'Our Sunday league coverage used to be a paragraph on Facebook. Now we publish professional reports every week.', name: "Sarah O'Brien", role: 'Bandon AFC PRO' },
  ],
  rugby: [
    { quote: 'The sin bin timer is genius. Everything we need is in one place.', name: 'Conor Walsh', role: 'Bandon RFC PRO' },
    { quote: 'Our match reports look like they came from a professional journalist. Parents and supporters love it.', name: 'Emma Hurley', role: 'Skibbereen RFC' },
  ],
  press: [
    { quote: 'I cover 6 matches every weekend. ClubReporter means I can publish reports within minutes of full time.', name: 'Pat Collins', role: 'Southern Star Sport' },
    { quote: 'The verified press badge has opened doors for me with clubs that were previously reluctant to give access.', name: 'Mary Walsh', role: 'West Cork Sport' },
  ],
};

const GAA_REPORT = `BARRYROE 1-12 (15) 0-14 KILBRITTAIN

Barryroe moved top of the Cork County Senior Football Championship table with a hard-fought victory over Kilbrittain at a wet and windy Clonakilty on Sunday.

Goals from Ciarán Murphy (54') and a late Jamie Hurley point sealed the win for the west Cork side, who led 0-08 to 0-06 at half time.

Kilbrittain fought back through points from D. O'Callaghan and M. Walsh, but a black card for the visitors on 43' disrupted their rhythm.

Barryroe's defence, marshalled from full back, held firm in the closing stages to secure a valuable two-point win.`;

const SOCCER_REPORT = `MIDLETON FC 2-1 CARRIGTWOHILL UNITED

Midleton FC secured a crucial Munster Senior League victory at Knockgriffin on Saturday thanks to a second-half strike from striker David O'Brien.

The home side took an early lead through a well-worked team goal before Carrigtwohill equalised from the penalty spot on 38'.

O'Brien's 67th-minute winner, set up by midfielder Sarah Keane, proved the difference in a tense local derby watched by over 400 supporters.

Both teams finished with ten men after late yellow cards, but Midleton held on for three valuable points.`;

const RUGBY_REPORT = `CORK CONSTITUTION 24-17 DUBLIN UNIVERSITY

Cork Constitution secured a hard-earned AIL Division 1A victory at Temple Hill on Saturday in a match decided by set-piece dominance and clinical finishing.

Tries from the wing and number eight, converted by the fly-half, gave Con a 17-10 half-time lead after a sin bin for the visitors on 32'.

DU hit back with a penalty and unconverted try, but a late drop goal sealed the win for the home side in front of a vocal Cork crowd.

The scrum and lineout proved decisive throughout, with Con winning the battle at the breakdown in the closing quarter.`;

const PRESS_REPORT = `SOUTHERN STAR MATCH REPORT — BARRYROE 1-12 KILBRITTAIN 0-14

By Pat Collins, Southern Star Sport | Verified Press Pass

Barryroe secured a vital Cork SFC win at Clonakilty in a match covered live by Southern Star Sport using ClubReporter Press Pass.

Full report published within 8 minutes of the final whistle and shared directly to southernstar.ie and social channels.

This report is attributed to Southern Star Sport. Verified press badge displayed on the public match page.`;

export const EXAMPLE_REPORTS = {
  all: { title: 'Example match report', content: GAA_REPORT },
  gaa: { title: 'Example GAA match report', content: GAA_REPORT },
  soccer: { title: 'Example soccer match report', content: SOCCER_REPORT },
  rugby: { title: 'Example rugby match report', content: RUGBY_REPORT },
  press: { title: 'Example Press Pass report', content: PRESS_REPORT },
};

export function getTabBrand(tab) {
  if (tab === 'gaa') return BRAND.gaa;
  if (tab === 'soccer') return BRAND.soccer;
  if (tab === 'rugby') return BRAND.rugby;
  if (tab === 'press') return BRAND.media;
  return { color: '#1a6b3c', motif: null, product: 'ClubReporter.ie' };
}
