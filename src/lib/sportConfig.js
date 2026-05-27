export const SPORTS = [
  { value: 'gaelic_football', label: 'Gaelic Football' },
  { value: 'hurling', label: 'Hurling' },
  { value: 'camogie', label: 'Camogie' },
  { value: 'ladies_football', label: 'Ladies Football' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'rugby', label: 'Rugby' },
];

const GAA_SPORTS = new Set(['gaelic_football', 'hurling', 'camogie', 'ladies_football']);

export const isGAA = (sport) => GAA_SPORTS.has(sport);

export const isSoccer = (sport) => sport === 'soccer';

export const isRugby = (sport) => sport === 'rugby';

export const SOCCER_FORMATIONS = ['4-4-2', '4-3-3', '3-5-2'];

export function defaultMatchSportForUser(user) {
  if (!user || user.profileType === 'media') return 'gaelic_football';
  const primary = user.primarySport || 'gaa';
  if (primary === 'soccer') return 'soccer';
  if (primary === 'rugby') return 'rugby';
  return 'gaelic_football';
}

export function filterSportsForUser(user) {
  if (!user || user.profileType === 'media' || user.primarySport === 'multi') return SPORTS;
  if (user.primarySport === 'soccer') return SPORTS.filter((s) => s.value === 'soccer');
  if (user.primarySport === 'rugby') return SPORTS.filter((s) => s.value === 'rugby');
  return SPORTS.filter((s) => isGAA(s.value));
}

export const PRIMARY_SPORT_OPTIONS = [
  { id: 'gaa', label: 'GAA', brand: 'GaelicReporter', emoji: '🏐', desc: 'Football, hurling, camogie & ladies football' },
  { id: 'soccer', label: 'Soccer', brand: 'PitchReporter', emoji: '⚽', desc: 'Senior, junior, underage & womens football' },
  { id: 'rugby', label: 'Rugby', brand: 'RugbyReporter', emoji: '🏉', desc: 'Senior, junior, underage & womens rugby' },
  { id: 'multi', label: 'Multiple sports', brand: 'ClubReporter', emoji: '🏆', desc: 'Cover more than one sport' },
];

export const GAA_POSITIONS = [
  'Goalkeeper',
  'Right Corner Back',
  'Full Back',
  'Left Corner Back',
  'Right Half Back',
  'Centre Half Back',
  'Left Half Back',
  'Midfielder',
  'Midfielder',
  'Left Half Forward',
  'Centre Half Forward',
  'Right Half Forward',
  'Left Corner Forward',
  'Full Forward',
  'Right Corner Forward',
];

export const SOCCER_POSITIONS = [
  'Goalkeeper',
  'Right Back',
  'Centre Back',
  'Centre Back',
  'Left Back',
  'Defensive Midfielder',
  'Right Midfielder',
  'Centre Midfielder',
  'Left Midfielder',
  'Attacking Midfielder',
  'Striker',
];

export const RUGBY_POSITIONS = [
  'Loosehead Prop', 'Hooker', 'Tighthead Prop',
  'Lock', 'Lock',
  'Blindside Flanker', 'Openside Flanker', 'Number 8',
  'Scrum Half', 'Fly Half',
  'Inside Centre', 'Outside Centre',
  'Left Wing', 'Right Wing', 'Full Back',
];

export function getOpponentPositionCount(sport) {
  if (isSoccer(sport)) return SOCCER_POSITIONS.length;
  if (isRugby(sport)) return RUGBY_POSITIONS.length;
  return GAA_POSITIONS.length;
}

export function getOpponentPositionSlots(sport, useSquadNumbers = true) {
  const names = isSoccer(sport) ? SOCCER_POSITIONS : isRugby(sport) ? RUGBY_POSITIONS : GAA_POSITIONS;
  return names.map((position, i) => {
    const num = i + 1;
    return {
      number: num,
      label: useSquadNumbers ? `#${num}` : String(num),
      position,
    };
  });
}

export function buildDefaultOpponentLineup(sport, useSquadNumbers = true) {
  return getOpponentPositionSlots(sport, useSquadNumbers).map(
    ({ label, position }) => `${label} ${position}`
  );
}

export function buildEmptyOpponentInputs(sport) {
  return Array(getOpponentPositionCount(sport)).fill('');
}

export function isDefaultOpponentLineup(lineup, sport) {
  if (!lineup?.length) return true;
  const count = getOpponentPositionCount(sport);
  if (lineup.length !== count) return false;
  const withHash = buildDefaultOpponentLineup(sport, true);
  const withoutHash = buildDefaultOpponentLineup(sport, false);
  const legacy = Array.from({ length: count }, (_, i) => `#${i + 1}`);
  return [withHash, withoutHash, legacy].some(
    (variant) => variant.every((entry, i) => lineup[i] === entry)
  );
}

export const WEATHER_OPTIONS = ['Dry', 'Wet', 'Windy', 'Cold', 'Sunny', 'Overcast', 'Heavy Rain', 'Foggy', 'Poor Visibility'];

export const ATTENDANCE_OPTIONS = ['~100', '~250', '~500', '~1,000', '~2,000', '~5,000'];

export const STATUS_LABELS = {
  scheduled: 'Scheduled', live: 'LIVE', half_time: 'Half Time', full_time: 'Full Time',
  extra_time: 'Extra Time', penalties: 'Penalties', postponed: 'Postponed', abandoned: 'Abandoned'
};

export const INCIDENT_TYPES = {
  gaelic_football: [
    { type: 'goal', label: 'Goal', color: 'bg-emerald-600', scores: 'goals' },
    { type: 'point', label: 'Point', color: 'bg-emerald-500', scores: 'points' },
    { type: 'wide', label: 'Wide', color: 'bg-gray-400' },
    { type: 'free_scored', label: 'Free ✓', color: 'bg-teal-600', scores: 'points' },
    { type: 'free_missed', label: 'Free ✗', color: 'bg-gray-400' },
    { type: '45_scored', label: "45' ✓", color: 'bg-teal-600', scores: 'points' },
    { type: '45_missed', label: "45' ✗", color: 'bg-gray-400' },
    { type: 'yellow_card', label: 'Yellow', color: 'bg-yellow-500' },
    { type: 'black_card', label: 'Black Card', color: 'bg-gray-900' },
    { type: 'red_card', label: 'Red Card', color: 'bg-red-600' },
    { type: 'substitution', label: 'Sub', color: 'bg-blue-500' },
    { type: 'injury', label: 'Injury', color: 'bg-orange-500' },
    { type: 'penalty_scored', label: 'Pen ✓', color: 'bg-emerald-700', scores: 'goals' },
    { type: 'penalty_missed', label: 'Pen ✗', color: 'bg-gray-400' },
    { type: 'own_goal', label: 'Own Goal', color: 'bg-red-400', scores: 'goals_other' },
    { type: 'manual_update', label: 'Update', color: 'bg-gray-500' },
  ],
  hurling: [
    { type: 'goal', label: 'Goal', color: 'bg-emerald-600', scores: 'goals' },
    { type: 'point', label: 'Point', color: 'bg-emerald-500', scores: 'points' },
    { type: 'wide', label: 'Wide', color: 'bg-gray-400' },
    { type: 'free_scored', label: 'Free ✓', color: 'bg-teal-600', scores: 'points' },
    { type: 'free_missed', label: 'Free ✗', color: 'bg-gray-400' },
    { type: '65_scored', label: "65' ✓", color: 'bg-teal-600', scores: 'points' },
    { type: '65_missed', label: "65' ✗", color: 'bg-gray-400' },
    { type: 'yellow_card', label: 'Yellow', color: 'bg-yellow-500' },
    { type: 'red_card', label: 'Red Card', color: 'bg-red-600' },
    { type: 'substitution', label: 'Sub', color: 'bg-blue-500' },
    { type: 'injury', label: 'Injury', color: 'bg-orange-500' },
    { type: 'penalty_scored', label: 'Pen ✓', color: 'bg-emerald-700', scores: 'goals' },
    { type: 'penalty_missed', label: 'Pen ✗', color: 'bg-gray-400' },
    { type: 'own_goal', label: 'Own Goal', color: 'bg-red-400', scores: 'goals_other' },
    { type: 'manual_update', label: 'Update', color: 'bg-gray-500' },
  ],
};

INCIDENT_TYPES.camogie = INCIDENT_TYPES.hurling;
INCIDENT_TYPES.ladies_football = INCIDENT_TYPES.gaelic_football;

INCIDENT_TYPES.soccer = [
  { type: 'goal', label: 'Goal', color: 'bg-emerald-600', scores: 'goals' },
  { type: 'own_goal', label: 'Own Goal', color: 'bg-red-400', scores: 'goals_other' },
  { type: 'assist', label: 'Assist', color: 'bg-blue-500' },
  { type: 'yellow_card', label: 'Yellow', color: 'bg-yellow-500' },
  { type: 'red_card', label: 'Red', color: 'bg-red-600' },
  { type: 'penalty_scored', label: 'Pen ✓', color: 'bg-emerald-700', scores: 'goals' },
  { type: 'penalty_missed', label: 'Pen ✗', color: 'bg-gray-400' },
  { type: 'substitution', label: 'Sub', color: 'bg-blue-500' },
  { type: 'injury', label: 'Injury', color: 'bg-orange-500' },
  { type: 'var_review', label: 'VAR', color: 'bg-purple-600' },
  { type: 'offside', label: 'Offside', color: 'bg-gray-500' },
  { type: 'manual_update', label: 'Update', color: 'bg-gray-500' },
];

INCIDENT_TYPES.rugby = [
  { type: 'try', label: 'Try', color: 'bg-emerald-600', scores: 'delta', scoreDelta: 5 },
  { type: 'conversion', label: 'Conversion', color: 'bg-emerald-500', scores: 'delta', scoreDelta: 2 },
  { type: 'penalty', label: 'Penalty', color: 'bg-teal-600', scores: 'delta', scoreDelta: 3 },
  { type: 'drop_goal', label: 'Drop Goal', color: 'bg-teal-500', scores: 'delta', scoreDelta: 3 },
  { type: 'yellow_card', label: 'Yellow', color: 'bg-yellow-500' },
  { type: 'red_card', label: 'Red', color: 'bg-red-600' },
  { type: 'sin_bin', label: 'Sin Bin', color: 'bg-orange-500' },
  { type: 'substitution', label: 'Sub', color: 'bg-blue-500' },
  { type: 'injury', label: 'Injury', color: 'bg-orange-600' },
  { type: 'scrum', label: 'Scrum', color: 'bg-slate-600' },
  { type: 'lineout', label: 'Lineout', color: 'bg-slate-500' },
  { type: 'manual_update', label: 'Update', color: 'bg-gray-500' },
];

export const formatGAAScore = (goals, points) => {
  const g = goals || 0;
  const p = points || 0;
  return `${g}-${String(p).padStart(2, '0')} (${g * 3 + p})`;
};

export const SPORT_LABELS = {
  gaelic_football: 'Gaelic Football',
  hurling: 'Hurling',
  camogie: 'Camogie',
  ladies_football: 'Ladies Football',
  soccer: 'Soccer',
  rugby: 'Rugby',
};

export function formatScore(match) {
  if (isGAA(match.sport)) return formatGAAScore(match.homeGoals, match.homePoints);
  if (isRugby(match.sport)) {
    return `${match.homeGoals || 0}-${match.awayGoals || 0}`;
  }
  return String(match.homeGoals || 0);
}

export function buildReportPrompt(match, incidents) {
  const timelineText = incidents
    .filter((i) => i.type !== 'admin_note')
    .map((i) => `${i.minute}' - ${i.details || i.type}`)
    .join('\n');

  const homeScore = isGAA(match.sport)
    ? formatGAAScore(match.homeGoals, match.homePoints)
    : isRugby(match.sport)
      ? `${match.homeGoals || 0}`
      : String(match.homeGoals || 0);
  const awayScore = isGAA(match.sport)
    ? formatGAAScore(match.awayGoals, match.awayPoints)
    : isRugby(match.sport)
      ? `${match.awayGoals || 0}`
      : String(match.awayGoals || 0);

  const base = `Match: ${match.homeTeamName} vs ${match.awayTeamName}
Sport: ${SPORT_LABELS[match.sport] || match.sport}
Competition: ${match.competition || 'N/A'} ${match.category || ''}
Final Score: ${match.homeTeamName} ${homeScore} - ${awayScore} ${match.awayTeamName}
${match.halfTimeHome ? `Half Time: ${match.halfTimeHome} - ${match.halfTimeAway}` : ''}
${match.venue ? `Venue: ${match.venue}` : ''}
${match.formation && isSoccer(match.sport) ? `Formation: ${match.formation}` : ''}
${match.playerOfMatch ? `Player of the Match: ${match.playerOfMatch}` : ''}

Timeline of Events:
${timelineText || 'No events recorded.'}`;

  if (isSoccer(match.sport)) {
    return `You are a professional soccer match reporter for Irish club football. Write a concise, engaging match report (3-4 paragraphs, newspaper style).

Use soccer terminology: goals, striker, midfielder, assists, formation. Score format like 2-1. Reference league, cup or competition names.

${base}

Write the report in flowing prose. Do not use bullet points. Use the team names throughout.`;
  }

  if (isRugby(match.sport)) {
    return `You are a professional rugby match reporter for Irish rugby clubs. Write a concise, engaging post-match report (3-4 paragraphs, newspaper style).

Use rugby terminology: tries, conversions, penalties, drop goals, scrum, lineout, sin bin. Score format like 24-17. Reference set pieces and competition names.

${base}

Write the report in flowing prose. Do not use bullet points. Use the team names throughout.`;
  }

  return `You are a professional GAA match reporter. Write a concise, engaging match report (3-4 paragraphs, GAA newspaper style).

Use GAA terminology: goals and points, half forward, full back, county and club names. Score format like 1-12 to 0-14. Reference GAA competition names.

${base}

Write the report in flowing prose. Do not use bullet points. Use the team names throughout.`;
}

export function getReportSystemPrompt(sport) {
  if (isSoccer(sport)) return 'You are a professional soccer journalist covering Irish club football.';
  if (isRugby(sport)) return 'You are a professional rugby journalist covering Irish rugby clubs.';
  return 'You are a professional GAA sports journalist.';
}