export const SPORTS = [
  { value: 'gaelic_football', label: 'Gaelic Football' },
  { value: 'hurling', label: 'Hurling' },
  { value: 'camogie', label: 'Camogie' },
  { value: 'ladies_football', label: 'Ladies Football' },
];

export const isGAA = (sport) => !isSoccer(sport);

export const isSoccer = (sport) => sport === 'soccer';

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

export function getOpponentPositionCount(sport) {
  return isSoccer(sport) ? SOCCER_POSITIONS.length : GAA_POSITIONS.length;
}

export function getOpponentPositionSlots(sport, useSquadNumbers = true) {
  const names = isSoccer(sport) ? SOCCER_POSITIONS : GAA_POSITIONS;
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

export const formatGAAScore = (goals, points) => {
  const g = goals || 0;
  const p = points || 0;
  return `${g}-${String(p).padStart(2, '0')} (${g * 3 + p})`;
};

export const SPORT_LABELS = {
  gaelic_football: 'Gaelic Football',
  hurling: 'Hurling', camogie: 'Camogie', ladies_football: 'Ladies Football'
};