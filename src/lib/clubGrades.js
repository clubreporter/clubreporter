export const GRADE_GROUPS = [
  {
    label: 'Adult Grades',
    grades: ['Senior', 'Intermediate', 'Premier Junior', 'Junior A', 'Junior B', 'Junior C', 'Junior D', 'Junior 2', 'Junior 3'],
  },
  {
    label: 'Youth / Teenage Grades',
    grades: ['U21', 'U20', 'Minor / U18', 'U17', 'U16', 'U15', 'U14', 'U13'],
  },
  {
    label: 'Juvenile / Go Games',
    grades: ['U12', 'U11', 'U10', 'U9', 'U8', 'U7'],
  },
  {
    label: 'Academy / Nursery',
    grades: ['U6', 'U5', 'Academy / Nursery'],
  },
];

export const CODES = [
  { key: 'football', label: 'Football' },
  { key: 'hurling', label: 'Hurling' },
  { key: 'ladies', label: 'Ladies' },
  { key: 'camogie', label: 'Camogie' },
];

export const ALL_GRADES = GRADE_GROUPS.flatMap(g => g.grades);

/** Build default grades object — all codes off */
export function defaultGrades() {
  return Object.fromEntries(
    ALL_GRADES.map(g => [g, { football: false, hurling: false, ladies: false, camogie: false }])
  );
}

/**
 * Returns array of active team strings, e.g. ["Senior Football", "Junior A Hurling"]
 * A grade-code combo is active when that code toggle is true.
 */
export function getActiveTeams(grades) {
  if (!grades) return [];
  const result = [];
  ALL_GRADES.forEach(grade => {
    const entry = grades[grade];
    if (!entry) return;
    CODES.forEach(({ key, label }) => {
      if (entry[key]) result.push(`${grade} ${label}`);
    });
  });
  return result;
}

const STORAGE_KEY = 'cr_active_teams';

export function saveActiveTeamsToStorage(grades) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getActiveTeams(grades)));
}

export function loadActiveTeamsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}