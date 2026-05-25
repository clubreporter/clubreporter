import { INCIDENT_TYPES } from '../lib/sportConfig';

const SCORING_TYPES = new Set([
  'goal', 'point', 'wide', 'free_scored', 'free_missed',
  '45_scored', '45_missed', '65_scored', '65_missed',
  'penalty_scored', 'penalty_missed', 'own_goal',
]);

const DISCIPLINE_TYPES = new Set(['yellow_card', 'black_card', 'red_card']);
const MATCH_TYPES = new Set(['substitution', 'injury', 'manual_update']);

const DISPLAY_LABELS = {
  goal: 'Goal',
  point: 'Point',
  wide: 'Wide',
  free_scored: 'Free Scored',
  free_missed: 'Free Missed',
  '45_scored': '45 Scored',
  '45_missed': '45 Missed',
  '65_scored': '65 Scored',
  '65_missed': '65 Missed',
  penalty_scored: 'Penalty Scored',
  penalty_missed: 'Penalty Missed',
  own_goal: 'Own Goal',
  yellow_card: 'Yellow Card',
  black_card: 'Black Card',
  red_card: 'Red Card',
  substitution: 'Sub',
  injury: 'Injury',
  manual_update: 'Update',
};

function buttonClass(type) {
  if (DISCIPLINE_TYPES.has(type)) {
    if (type === 'yellow_card') return 'bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-yellow-300';
    if (type === 'black_card') return 'bg-gray-950 hover:bg-black text-white border-gray-700';
    if (type === 'red_card') return 'bg-red-600 hover:bg-red-500 text-white border-red-400';
  }
  if (MATCH_TYPES.has(type)) {
    return 'bg-slate-600 hover:bg-slate-500 text-white border-slate-500';
  }
  if (SCORING_TYPES.has(type)) {
    if (type.includes('missed') || type === 'wide') {
      return 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700/50';
    }
    return 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/30';
  }
  return 'bg-emerald-700 text-white border-emerald-600';
}

function groupIncidents(sport) {
  const all = INCIDENT_TYPES[sport] || INCIDENT_TYPES.gaelic_football;
  const scoring = [];
  const discipline = [];
  const matchEvents = [];

  all.forEach((inc) => {
    if (SCORING_TYPES.has(inc.type)) scoring.push(inc);
    else if (DISCIPLINE_TYPES.has(inc.type)) discipline.push(inc);
    else if (MATCH_TYPES.has(inc.type)) matchEvents.push(inc);
  });

  return [
    { id: 'scoring', label: 'Scoring', items: scoring },
    { id: 'discipline', label: 'Discipline', items: discipline },
    { id: 'match', label: 'Match', items: matchEvents },
  ].filter((g) => g.items.length > 0);
}

function Section({ label, items, onIncident, disabled }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A9E6D]/90">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {items.map((inc) => (
          <button
            key={inc.type}
            type="button"
            disabled={disabled}
            onClick={() => onIncident(inc)}
            className={`${buttonClass(inc.type)} border font-bold py-3 px-1.5 rounded-xl text-[11px] sm:text-xs leading-tight active:scale-95 transition-all touch-manipulation disabled:opacity-40 shadow-sm`}
          >
            {DISPLAY_LABELS[inc.type] || inc.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function IncidentButtons({ sport, onIncident, disabled }) {
  const groups = groupIncidents(sport);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Section
          key={group.id}
          label={group.label}
          items={group.items}
          onIncident={onIncident}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
