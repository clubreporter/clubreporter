// Colour name → { hsl, isDark }
export const COLOUR_OPTIONS = [
  { label: 'Red',      value: 'Red',      hsl: '0 72% 42%',    isDark: true  },
  { label: 'White',    value: 'White',    hsl: '0 0% 98%',     isDark: false },
  { label: 'Blue',     value: 'Blue',     hsl: '217 91% 40%',  isDark: true  },
  { label: 'Navy',     value: 'Navy',     hsl: '221 61% 22%',  isDark: true  },
  { label: 'Sky Blue', value: 'Sky Blue', hsl: '199 89% 48%',  isDark: false },
  { label: 'Green',    value: 'Green',    hsl: '152 69% 31%',  isDark: true  },
  { label: 'Yellow',   value: 'Yellow',   hsl: '48 100% 50%',  isDark: false },
  { label: 'Gold',     value: 'Gold',     hsl: '43 96% 46%',   isDark: false },
  { label: 'Black',    value: 'Black',    hsl: '0 0% 8%',      isDark: true  },
  { label: 'Maroon',   value: 'Maroon',   hsl: '0 61% 28%',    isDark: true  },
  { label: 'Purple',   value: 'Purple',   hsl: '270 60% 35%',  isDark: true  },
  { label: 'Orange',   value: 'Orange',   hsl: '25 95% 50%',   isDark: false },
  { label: 'Grey',     value: 'Grey',     hsl: '0 0% 55%',     isDark: false },
  { label: 'Silver',   value: 'Silver',   hsl: '0 0% 75%',     isDark: false },
];

export const STORAGE_KEY = 'cr_club_colours';

export function getColourMeta(name) {
  return COLOUR_OPTIONS.find(c => c.value === name);
}

export function applyClubColours(primary, secondary, accent) {
  const root = document.documentElement;
  const p = getColourMeta(primary);
  const s = getColourMeta(secondary);
  const a = getColourMeta(accent);

  if (p) {
    root.style.setProperty('--primary', p.hsl);
    root.style.setProperty('--primary-foreground', p.isDark ? '0 0% 98%' : '0 0% 6%');
  }
  if (s) {
    root.style.setProperty('--secondary', s.hsl);
    root.style.setProperty('--secondary-foreground', s.isDark ? '0 0% 98%' : '0 0% 6%');
  }
  if (a) {
    // accent used for ring / chart-1
    root.style.setProperty('--ring', a.hsl);
    root.style.setProperty('--chart-1', a.hsl);
  }

  // persist to localStorage so App applies on every load
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ primary, secondary, accent }));
}

export function loadAndApplyStoredColours() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (stored) applyClubColours(stored.primary, stored.secondary, stored.accent);
  } catch { /* ignore */ }
}