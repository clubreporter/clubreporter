import { GRADE_GROUPS, CODES } from '../lib/clubGrades';

function CodeToggle({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-muted text-muted-foreground border-border'
      }`}
    >
      {label}
    </button>
  );
}

export default function GradesTab({ grades, onChange }) {
  const toggle = (grade, codeKey) => {
    onChange({
      ...grades,
      [grade]: {
        ...(grades[grade] || {}),
        [codeKey]: !grades[grade]?.[codeKey],
      },
    });
  };

  return (
    <div className="space-y-5">
      {GRADE_GROUPS.map(group => (
        <div key={group.label}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
            {group.label}
          </p>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {group.grades.map(grade => {
              const entry = grades[grade] || {};
              const anyActive = CODES.some(c => entry[c.key]);
              return (
                <div
                  key={grade}
                  className={`flex items-center gap-2 px-3 py-2.5 ${anyActive ? 'bg-card' : 'bg-muted/30'}`}
                >
                  <span className={`text-sm font-medium flex-1 min-w-0 truncate ${anyActive ? '' : 'text-muted-foreground'}`}>
                    {grade}
                  </span>
                  <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                    {CODES.map(({ key, label }) => (
                      <CodeToggle
                        key={key}
                        active={!!entry[key]}
                        label={label}
                        onClick={() => toggle(grade, key)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}