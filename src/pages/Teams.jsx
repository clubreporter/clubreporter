import { useState, useEffect } from 'react';
import { usePlan } from '../lib/usePlan';
import { LockedBlock } from '../components/UpgradeModal';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const { isPremium } = usePlan();

  useEffect(() => {
    entities.Team.list('-created_date').then(t => { setTeams(t); setLoading(false); });
  }, []);

  const addTeam = async () => {
    if (!name.trim()) return;
    const team = await entities.Team.create({ name: name.trim() });
    setTeams(prev => [team, ...prev]);
    setName('');
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.trim().split('\n').filter(Boolean);
      const start = lines[0].toLowerCase().includes('team') ? 1 : 0;
      const rows = lines.slice(start).map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        return { team: cols[0], stadium: cols[1] || '' };
      }).filter(r => r.team);
      setCsvRows(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addFromCsv = async (row) => {
    setImporting(true);
    await entities.Team.create({ name: row.team });
    if (row.stadium) await entities.Venue.create({ name: row.stadium });
    const updated = await entities.Team.list('-created_date');
    setTeams(updated);
    setCsvRows(prev => prev.filter(r => r.team !== row.team));
    setImporting(false);
    toast.success(`Added ${row.team}`);
  };

  const deleteTeam = async (id) => {
    await entities.Team.delete(id);
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{"Teams & Opponents"}</h2>

      <div className="flex gap-2">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Add team name" className="text-base" onKeyDown={e => e.key === 'Enter' && addTeam()} />
        <Button onClick={addTeam} size="icon"><Plus className="w-4 h-4" /></Button>
      </div>

      <LockedBlock locked={!isPremium} requiredPlan="premium" label="Premium: CSV Upload">
        <div>
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Upload className="w-4 h-4" />
            {csvRows.length > 0 ? `${csvRows.length} teams ready to add` : 'Upload CSV to populate dropdown'}
            <input type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          </label>
          <p className="text-[11px] text-muted-foreground mt-1 px-1">CSV format: team name, stadium name</p>
        </div>
      </LockedBlock>

      {csvRows.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <p className="text-xs font-semibold px-3 py-2 bg-muted text-muted-foreground uppercase tracking-wide">Select from CSV to add</p>
          <div className="max-h-52 overflow-y-auto divide-y divide-border">
            {csvRows.map((row, i) => (
              <button key={i} onClick={() => addFromCsv(row)} disabled={importing}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent text-left transition-colors disabled:opacity-50">
                <div>
                  <p className="text-sm font-medium">{row.team}</p>
                  {row.stadium && <p className="text-xs text-muted-foreground">{row.stadium}</p>}
                </div>
                <Plus className="w-4 h-4 text-primary flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {teams.map(t => (
          <div key={t.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
            <span className="font-medium text-sm">{t.name}</span>
            <button onClick={() => deleteTeam(t.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {teams.length === 0 && <p className="text-muted-foreground text-center py-6 text-sm">Save opponent teams here for quick reuse</p>}
      </div>
    </div>
  );
}