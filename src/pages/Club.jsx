import { useState, useEffect } from 'react';
import { usePlan } from '../lib/usePlan';
import { LockedBlock } from '../components/UpgradeModal';
import { entities } from '@/api/entities';
import { Core } from '@/api/integrations';
import { deleteAccount as removeAccount } from '@/api/billing';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save, Trash2, Plus, User, Lock, AlertTriangle, LogOut } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { COLOUR_OPTIONS, applyClubColours, getColourMeta } from '../lib/clubColours';
import { defaultGrades, getActiveTeams, saveActiveTeamsToStorage } from '../lib/clubGrades';
import GradesTab from '../components/GradesTab';

function ColourSwatch({ colour }) {
  const meta = getColourMeta(colour);
  if (!meta) return null;
  return <span className="inline-block w-4 h-4 rounded-full border border-black/10 flex-shrink-0" style={{ background: `hsl(${meta.hsl})` }} />;
}

function ColourSelect({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">{label}</label>
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            {value && <ColourSwatch colour={value} />}
            <SelectValue placeholder="Select colour…" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {COLOUR_OPTIONS.map(c => (
            <SelectItem key={c.value} value={c.value}>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: `hsl(${c.hsl})` }} />
                {c.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ColourPreview({ primary, secondary, accent }) {
  const pm = getColourMeta(primary);
  const sm = getColourMeta(secondary);
  const am = getColourMeta(accent);
  if (!pm && !sm) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {pm && (
        <div className="px-4 py-3 flex items-center gap-2" style={{ background: `hsl(${pm.hsl})` }}>
          <span className="font-black text-sm" style={{ color: pm.isDark ? '#fff' : '#111' }}>My Club GAA</span>
          {am && (
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `hsl(${am.hsl})`, color: getColourMeta(accent)?.isDark ? '#fff' : '#111' }}>LIVE</span>
          )}
        </div>
      )}
      <div className="p-3 bg-card space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold">Home GAA</span>
          <span className="font-black text-base">1-08 – 0-09</span>
          <span className="font-semibold">Away GAA</span>
        </div>
        {sm && <div className="h-1 rounded-full" style={{ background: `hsl(${sm.hsl})` }} />}
        {pm && (
          <div className="flex gap-2 mt-1">
            <div className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center" style={{ background: `hsl(${pm.hsl})`, color: pm.isDark ? '#fff' : '#111' }}>Report</div>
            {sm && <div className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center border" style={{ borderColor: `hsl(${sm.hsl})`, color: `hsl(${sm.hsl})` }}>Share</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Club() {
  const { logout } = useAuth();
  const [club, setClub] = useState(null);
  const [form, setForm] = useState({
    name: '', county: '', primaryColour: '', secondaryColour: '', accentColour: '',
    founded: '', ground: '', website: '', bio: '', contactEmail: '', contactPhone: ''
  });
  const [grades, setGrades] = useState(defaultGrades());
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [players, setPlayers] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [playerForm, setPlayerForm] = useState({ name: '', number: '', position: '' });
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvRows, setCsvRows] = useState([]);

  const isExisting = !!club;
  const activeTeams = getActiveTeams(grades);
  const { isPremium } = usePlan();

  useEffect(() => {
    entities.Club.list().then(clubs => {
      if (clubs.length > 0) {
        const c = clubs[0];
        setClub(c);
        setForm({
          name: c.name || '', county: c.county || '',
          primaryColour: c.primaryColour || '', secondaryColour: c.secondaryColour || '', accentColour: c.accentColour || '',
          founded: c.founded || '', ground: c.ground || '', website: c.website || '',
          bio: c.bio || '', contactEmail: c.contactEmail || '', contactPhone: c.contactPhone || '',
        });
        if (c.grades) setGrades({ ...defaultGrades(), ...c.grades });
        if (c.logo) setLogoPreview(c.logo);
        if (c.primaryColour) applyClubColours(c.primaryColour, c.secondaryColour, c.accentColour);
        if (c.grades) saveActiveTeamsToStorage(c.grades);
      }
    });
    entities.Player.list('-created_date', 200).then(setPlayers);
  }, []);

  useEffect(() => {
    if (form.primaryColour) applyClubColours(form.primaryColour, form.secondaryColour, form.accentColour);
  }, [form.primaryColour, form.secondaryColour, form.accentColour]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const saveClub = async () => {
    setSaving(true);
    let logoUrl = club?.logo || '';
    if (logoFile) {
      const res = await Core.UploadFile({ file: logoFile });
      logoUrl = res.file_url;
    }
    const data = { ...form, logo: logoUrl, grades };
    if (club) {
      data.name = club.name; // locked
      const updated = await entities.Club.update(club.id, data);
      setClub(updated);
    } else {
      const created = await entities.Club.create(data);
      setClub(created);
    }
    applyClubColours(form.primaryColour, form.secondaryColour, form.accentColour);
    saveActiveTeamsToStorage(grades);
    setSaving(false);
    toast.success('Club info saved');
  };

  const saveGrades = async () => {
    if (!club) return;
    setSaving(true);
    const updated = await entities.Club.update(club.id, { grades });
    setClub(updated);
    saveActiveTeamsToStorage(grades);
    setSaving(false);
    toast.success('Grades saved');
  };

  const addPlayer = async () => {
    if (!playerForm.name.trim() || !selectedGrade) return;
    const p = await entities.Player.create({ ...playerForm, team: selectedGrade });
    setPlayers(prev => [p, ...prev]);
    setPlayerForm({ name: '', number: '', position: '' });
  };

  const deletePlayer = async (id) => {
    await entities.Player.delete(id);
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handlePlayerCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.trim().split('\n').filter(Boolean);
      const firstLine = lines[0].toLowerCase();
      const start = (firstLine.includes('name') || firstLine.includes('player')) ? 1 : 0;
      const rows = lines.slice(start).map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        return { name: cols[0], number: cols[1] || '', position: cols[2] || '', team: selectedGrade };
      }).filter(r => r.name);
      setCsvRows(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addFromCsvRow = async (row) => {
    setCsvImporting(true);
    const p = await entities.Player.create(row);
    setPlayers(prev => [p, ...prev]);
    setCsvRows(prev => prev.filter(r => r.name !== row.name));
    setCsvImporting(false);
  };

  const importAllCsv = async () => {
    setCsvImporting(true);
    const created = [];
    for (const row of csvRows) {
      const p = await entities.Player.create(row);
      created.push(p);
    }
    setPlayers(prev => [...created, ...prev]);
    setCsvRows([]);
    setCsvImporting(false);
    toast.success(`Imported ${created.length} players`);
  };

  const deleteClub = async () => {
    if (!club) return;
    setDeleting(true);
    await entities.Club.delete(club.id);
    setClub(null);
    setForm({ name: '', county: '', primaryColour: '', secondaryColour: '', accentColour: '', founded: '', ground: '', website: '', bio: '', contactEmail: '', contactPhone: '' });
    setLogoPreview(null);
    setDeleting(false);
    toast.success('Club profile deleted');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await removeAccount();
    toast.success('Account and all data deleted. Signing you out…');
    setTimeout(() => logout(true), 1500);
  };

  const pageTitle = form.name || 'My Club';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{pageTitle}</h2>

      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Club Info</TabsTrigger>
          <TabsTrigger value="players" className="flex-1">Players</TabsTrigger>
          <TabsTrigger value="grades" className="flex-1">Grades</TabsTrigger>
        </TabsList>

        {/* ── Club Info ── */}
        <TabsContent value="info" className="space-y-4 pt-2">
          <LockedBlock locked={!isPremium} requiredPlan="premium" label="Premium: Logo Upload">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted flex-shrink-0">
                {logoPreview ? <img src={logoPreview} alt="Club logo" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-muted-foreground" />}
              </div>
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-primary underline underline-offset-2">Upload Logo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
            </div>
          </LockedBlock>

          <div className="space-y-3">
            {/* Club Name — locked */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
                Club Name {isExisting && <Lock className="w-3 h-3" />}
              </label>
              {isExisting ? (
                <div className="flex h-9 items-center rounded-md border border-input bg-muted/50 px-3 text-base text-foreground/70 cursor-not-allowed select-none">{form.name}</div>
              ) : (
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Barryroe GAA" className="text-base" />
              )}
              {isExisting && <p className="text-[11px] text-muted-foreground mt-1">Club name is locked. Contact support to change it.</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">County</label>
              <Input value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))} placeholder="e.g. Cork" className="text-base" />
            </div>

            <LockedBlock locked={!isPremium} requiredPlan="premium" label="Premium: Club Colours">
              <div className="bg-muted/40 rounded-xl p-3 space-y-3 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Club Colours</p>
                <ColourSelect label="Primary Colour" value={form.primaryColour} onChange={v => setForm(f => ({ ...f, primaryColour: v }))} />
                <ColourSelect label="Secondary Colour" value={form.secondaryColour} onChange={v => setForm(f => ({ ...f, secondaryColour: v }))} />
                <ColourSelect label="Accent Colour (optional)" value={form.accentColour} onChange={v => setForm(f => ({ ...f, accentColour: v }))} />
                {(form.primaryColour || form.secondaryColour) && (
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-2 font-medium">Preview</p>
                    <ColourPreview primary={form.primaryColour} secondary={form.secondaryColour} accent={form.accentColour} />
                  </div>
                )}
              </div>
            </LockedBlock>

            {[
              { key: 'founded', label: 'Founded', placeholder: 'e.g. 1892' },
              { key: 'ground', label: 'Home Ground', placeholder: 'e.g. Páirc Uí Mhurchú' },
              { key: 'website', label: 'Website', placeholder: 'https://' },
              { key: 'contactEmail', label: 'Contact Email', placeholder: 'secretary@club.ie' },
              { key: 'contactPhone', label: 'Contact Phone', placeholder: '' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">{label}</label>
                <Input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="text-base" />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">About the Club</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short club bio for match reports…" rows={3}
                className="w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            </div>
          </div>

          <Button onClick={saveClub} disabled={saving} className="w-full gap-2">
            <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Club Info'}
          </Button>

          <div className="mt-6 border border-destructive/30 rounded-xl p-4 space-y-3 bg-destructive/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <p className="text-sm font-bold text-destructive">Danger Zone</p>
              </div>
              <p className="text-xs text-muted-foreground">Permanently delete this club profile. All associated data including matches, players and reports will be lost and cannot be recovered.</p>
              {club && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/10" disabled={deleting}>
                      <Trash2 className="w-4 h-4" />{deleting ? 'Deleting…' : 'Delete Club Profile'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Club Profile?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>{club.name}</strong> and all associated data — matches, players, reports, and settings. This action <strong>cannot be undone</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteClub} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, Delete Club
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => logout(true)}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>

              <div className="border-t border-destructive/20 pt-3 space-y-2">
                <p className="text-xs font-semibold text-destructive">Delete My Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your ClubReporter account and all data across all clubs, matches, players and reports. This cannot be undone.</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full gap-2" disabled={deleting}>
                      <Trash2 className="w-4 h-4" />{deleting ? 'Deleting…' : 'Delete My Account'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Your Account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will <strong>permanently delete your account</strong> and all associated data including every club profile, all matches, players, reports and settings. You will be signed out immediately. This action <strong>cannot be undone</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
        </TabsContent>

        {/* ── Players ── */}
        <TabsContent value="players" className="space-y-4 pt-2">

          {/* Grade selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Select Grade / Team</label>
            {activeTeams.length > 0 ? (
              <Select value={selectedGrade} onValueChange={v => { setSelectedGrade(v); setCsvRows([]); }}>
                <SelectTrigger><SelectValue placeholder="Select a grade to manage players…" /></SelectTrigger>
                <SelectContent>{activeTeams.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground italic py-2">Enable grades in the Grades tab first.</p>
            )}
          </div>

          {selectedGrade && (
            <>
              {/* Add player manually */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add Player to {selectedGrade}</p>
                <div className="flex gap-2">
                  <Input value={playerForm.name} onChange={e => setPlayerForm(f => ({ ...f, name: e.target.value }))} placeholder="Player name" className="text-base flex-1" onKeyDown={e => e.key === 'Enter' && addPlayer()} />
                  <Input value={playerForm.number} onChange={e => setPlayerForm(f => ({ ...f, number: e.target.value }))} placeholder="#" className="text-base w-16" />
                </div>
                <Input value={playerForm.position} onChange={e => setPlayerForm(f => ({ ...f, position: e.target.value }))} placeholder="Position" className="text-base" />
                <Button onClick={addPlayer} className="w-full gap-2"><Plus className="w-4 h-4" />Add Player</Button>
              </div>

              {/* CSV Upload */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="w-4 h-4" />
                  {csvRows.length > 0 ? `${csvRows.length} players ready for ${selectedGrade}` : `Upload CSV → ${selectedGrade}`}
                  <input type="file" accept=".csv" className="hidden" onChange={handlePlayerCSV} />
                </label>
                <p className="text-[11px] text-muted-foreground mt-1 px-1">CSV: name, number, position — all imported to <strong>{selectedGrade}</strong></p>
              </div>

              {/* CSV preview */}
              {csvRows.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-muted">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From CSV → {selectedGrade}</p>
                    <Button size="sm" onClick={importAllCsv} disabled={csvImporting} className="h-7 text-xs">Import All</Button>
                  </div>
                  <div className="max-h-52 overflow-y-auto divide-y divide-border">
                    {csvRows.map((row, i) => (
                      <button key={i} onClick={() => addFromCsvRow(row)} disabled={csvImporting}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent text-left transition-colors disabled:opacity-50">
                        <div>
                          <p className="text-sm font-medium">{row.name} {row.number && <span className="text-muted-foreground">#{row.number}</span>}</p>
                          {row.position && <p className="text-xs text-muted-foreground">{row.position}</p>}
                        </div>
                        <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Player list for selected grade */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{selectedGrade} Players ({players.filter(p => p.team === selectedGrade).length})</p>
                {players.filter(p => p.team === selectedGrade).map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{p.name} {p.number && <span className="text-muted-foreground text-xs">#{p.number}</span>}</p>
                        {p.position && <p className="text-xs text-muted-foreground">{p.position}</p>}
                      </div>
                    </div>
                    <button onClick={() => deletePlayer(p.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {players.filter(p => p.team === selectedGrade).length === 0 && (
                  <p className="text-muted-foreground text-center py-6 text-sm">No players for {selectedGrade} yet. Add manually or upload a CSV above.</p>
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* ── Grades / Teams ── */}
        <TabsContent value="grades" className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground">Toggle each grade and the codes your club competes in. Only active grades appear in match setup and player assignment.</p>
          <GradesTab grades={grades} onChange={setGrades} />
          <Button onClick={saveGrades} disabled={saving || !club} className="w-full gap-2">
            <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Grades'}
          </Button>
          {!club && <p className="text-[11px] text-muted-foreground text-center">Save Club Info first before saving grades.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}