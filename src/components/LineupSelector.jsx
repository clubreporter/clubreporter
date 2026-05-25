import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

function uniquePlayers(list) {
  const seenIds = new Set();
  const seenNames = new Set();
  return list.filter((p) => {
    if (p.id) {
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);
    }
    const nameKey = (p.name || '').trim().toLowerCase();
    if (!nameKey || seenNames.has(nameKey)) return false;
    seenNames.add(nameKey);
    return true;
  });
}

export default function LineupSelector({ players = [], selected = [], onChange, max, excluded = [], label }) {
  const [manualName, setManualName] = useState('');

  const roster = useMemo(() => uniquePlayers(players), [players]);

  // Players available to select (not excluded, not already in selected)
  const available = roster.filter(p => !excluded.includes(p.name) && !selected.includes(p.name));
  // Players selected (shown in ordered list)
  const atMax = selected.length >= max;

  const toggle = (name) => {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name));
    } else if (!atMax) {
      onChange([...selected, name]);
    }
  };

  const addManual = () => {
    const name = manualName.trim();
    if (!name || selected.includes(name) || excluded.includes(name) || atMax) return;
    onChange([...selected, name]);
    setManualName('');
  };

  const remove = (name) => onChange(selected.filter(n => n !== name));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${atMax ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          {selected.length}/{max}
        </span>
      </div>

      {/* Selected players ordered list */}
      {selected.length > 0 && (
        <div className="bg-muted/50 rounded-xl p-3 space-y-1">
          {selected.map((name, i) => (
            <div key={name} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-6 text-right font-mono text-xs">{i + 1}.</span>
              <span className="flex-1 font-medium">{name}</span>
              <button type="button" onClick={() => remove(name)} className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available players chips */}
      {available.length > 0 && !atMax && (
        <div className="flex flex-wrap gap-1.5">
          {available.map(p => (
            <button key={p.id ? `id-${p.id}` : `name-${p.name}`} type="button" onClick={() => toggle(p.name)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted hover:bg-primary hover:text-primary-foreground transition-colors border border-border">
              {p.number ? `#${p.number} ` : ''}{p.name}
            </button>
          ))}
        </div>
      )}

      {/* Manual name entry */}
      {!atMax && (
        <div className="flex gap-2">
          <Input
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addManual())}
            placeholder="Type player name…"
            className="text-sm h-8"
          />
          <Button type="button" size="sm" variant="outline" onClick={addManual} className="h-8 px-2">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {atMax && (
        <p className="text-xs text-muted-foreground italic">{max} players selected. Remove a player to change selection.</p>
      )}
    </div>
  );
}