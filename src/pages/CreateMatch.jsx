import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPORTS, WEATHER_OPTIONS, ATTENDANCE_OPTIONS, isGAA, getOpponentPositionSlots, getOpponentPositionCount, buildDefaultOpponentLineup, buildEmptyOpponentInputs, isDefaultOpponentLineup } from '../lib/sportConfig';
import { loadActiveTeamsFromStorage } from '../lib/clubGrades';
import { playerMatchesCategory, dedupePlayers } from '../lib/players';
import LineupSelector from '../components/LineupSelector';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, ArrowUpDown } from 'lucide-react';

export default function CreateMatch() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sport: 'gaelic_football', homeTeamName: '', awayTeamName: '', competition: '',
    category: '', matchDate: '', venue: '', referee: '', weather: '', attendance: '',
    sponsorName: '', sponsorLogo: '', sponsorLink: '', template: 'quick',
  });
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [saving, setSaving] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubId, setClubId] = useState(null);
  const [opponent, setOpponent] = useState('');
  const [swapped, setSwapped] = useState(false);
  const [newOpponentName, setNewOpponentName] = useState('');
  const [showAddOpponent, setShowAddOpponent] = useState(false);
  const DEFAULT_CATEGORIES = ['Senior','Intermediate','Premier Intermediate','Junior A','Junior B','Junior C','Junior D','Novice','U21','U20','U19','Minor','U18','U17','U16','U15','U14','U13','U12','U11','U10','U9','U8','U7','U6','Ladies','Camogie','Mothers & Others','Development','Academy','Schools','College','Friendly','Challenge Match','League','Championship','Cup','Shield','Tournament','Blitz'];
  const activeGrades = loadActiveTeamsFromStorage();
  const [categories, setCategories] = useState(() => {
    if (activeGrades.length > 0) return activeGrades;
    try { const saved = JSON.parse(localStorage.getItem('cr_categories') || '[]'); return saved.length ? saved : DEFAULT_CATEGORIES; } catch { return DEFAULT_CATEGORIES; }
  });
  const DEFAULT_COMPETITIONS = ['County Senior Championship','County Intermediate Championship','County Junior Championship','County Minor Championship','County U21 Championship','County U20 Championship','County Senior League','County Intermediate League','County Junior League','County Minor League','County Senior Cup','County Intermediate Cup','County Junior Cup','All-Ireland Club Championship','Munster Club Championship','Leinster Club Championship','Ulster Club Championship','Connacht Club Championship','National League','Challenge Match','Friendly','Tournament','Blitz','Schools','College','Other'];
  const [competitions, setCompetitions] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('cr_competitions') || '[]'); return saved.length ? saved : DEFAULT_COMPETITIONS; } catch { return DEFAULT_COMPETITIONS; }
  });
  const [allPlayers, setAllPlayers] = useState([]);
  const [homeLineup, setHomeLineup] = useState([]);
  const [homeSubs, setHomeSubs] = useState([]);
  const [awayLineup, setAwayLineup] = useState([]);
  const [addOpponentLineup, setAddOpponentLineup] = useState('no');
  const [useSquadNumbers, setUseSquadNumbers] = useState(true);

  const opponentSlots = useMemo(
    () => getOpponentPositionSlots(form.sport, useSquadNumbers),
    [form.sport, useSquadNumbers]
  );

  const categoryPlayers = useMemo(() => {
    if (!form.category) return [];
    const filtered = allPlayers.filter((p) => playerMatchesCategory(p, form.category));
    return dedupePlayers(filtered);
  }, [allPlayers, form.category]);

  // Drop lineup picks that are not in the current category when it changes
  useEffect(() => {
    const allowed = new Set(categoryPlayers.map((p) => p.name));
    setHomeLineup((prev) => prev.filter((n) => allowed.has(n)));
    setHomeSubs((prev) => prev.filter((n) => allowed.has(n)));
  }, [form.category, categoryPlayers]);
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [validationMessage, setValidationMessage] = useState('');

  const homeTeamName = swapped ? opponent : clubName;
  const awayTeamName = swapped ? clubName : opponent;

  const fieldErrorClass = 'border-red-500 ring-1 ring-red-500 focus-visible:ring-red-500';
  const fieldErrorLabelClass = 'text-red-600';

  const clearFieldError = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setValidationMessage('');
  };

  const handleCategoryCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.trim().split('\n').filter(Boolean);
      const start = lines[0].toLowerCase().includes('categor') ? 1 : 0;
      const cats = [...new Set(lines.slice(start).map(l => l.split(',')[0].trim().replace(/^"|"$/g, '')).filter(Boolean))];
      const merged = [...new Set([...categories, ...cats])];
      setCategories(merged);
      localStorage.setItem('cr_categories', JSON.stringify(merged));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCompetitionCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.trim().split('\n').filter(Boolean);
      const comps = [...new Set(lines.map(l => l.split(',')[0].trim().replace(/^"|"$/g, '')).filter(Boolean))];
      setCompetitions(comps);
      localStorage.setItem('cr_competitions', JSON.stringify(comps));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSponsorCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const lines = evt.target.result.trim().split('\n').filter(Boolean);
      if (lines.length < 2) return;
      const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
      const si = header.indexOf('sponsor'), ii = header.indexOf('image'), li = header.indexOf('site');
      const created = [];
      for (const line of lines.slice(1)) {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const name = si >= 0 ? cols[si] : '';
        if (!name) continue;
        const s = await entities.Sponsor.create({ name, logoUrl: ii >= 0 ? cols[ii] : '', websiteLink: li >= 0 ? cols[li] : '' });
        created.push(s);
      }
      setSponsors(prev => [...prev, ...created]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    entities.Team.list().then(setTeams);
    entities.Venue.list().then(setVenues);
    entities.Club.list().then(clubs => {
      if (clubs[0]) {
        setClubName(clubs[0].name || '');
        setClubId(clubs[0].id);
      }
    });
    entities.Player.list().then(setAllPlayers);
    entities.Sponsor.list().then(setSponsors);
  }, []);

  const handleOpponentSelect = (val) => {
    clearFieldError('awayTeam');
    clearFieldError('homeTeam');
    if (val === '__add__') { setShowAddOpponent(true); }
    else { setOpponent(val); setShowAddOpponent(false); }
  };

  const saveNewOpponent = async () => {
    if (!newOpponentName.trim()) return;
    const t = await entities.Team.create({ name: newOpponentName.trim() });
    setTeams(prev => [...prev, t]);
    setOpponent(t.name);
    setNewOpponentName('');
    setShowAddOpponent(false);
  };

  const set = (field) => (val) => {
    if (field === 'sport') clearFieldError('sport');
    if (field === 'matchDate') clearFieldError('matchDate');
    setForm(f => ({ ...f, [field]: typeof val === 'object' ? val.target.value : val }));
  };

  const validate = () => {
    const errors = {};
    const missing = [];

    if (!form.sport?.trim()) {
      errors.sport = true;
      missing.push('Sport');
    }
    if (!homeTeamName?.trim()) {
      errors.homeTeam = true;
      missing.push('Home Team');
    }
    if (!awayTeamName?.trim()) {
      errors.awayTeam = true;
      missing.push('Away Team');
    }
    if (!form.matchDate?.trim()) {
      errors.matchDate = true;
      missing.push('Date & Time');
    }

    return { errors, missing };
  };

  const submit = async () => {
    const { errors, missing } = validate();
    if (missing.length > 0) {
      setFieldErrors(errors);
      setValidationMessage(`Please fill in: ${missing.join(', ')}`);
      return;
    }

    setFieldErrors({});
    setValidationMessage('');
    setSaving(true);
    try {
      const publicId = Math.random().toString(36).substring(2, 10);
      const match = await entities.Match.create({
        ...form, homeTeamName, awayTeamName, clubId, status: 'scheduled', homeGoals: 0, homePoints: 0, awayGoals: 0, awayPoints: 0,
        reportPublished: false, publicId, photos: [],
        homeLineup,
        homeSubs,
        awayLineup:
          addOpponentLineup === 'yes'
            ? opponentSlots.map(({ label, position }, i) => {
                const name = (awayLineup[i] ?? '').trim();
                return name || `${label} ${position}`;
              })
            : buildDefaultOpponentLineup(form.sport, useSquadNumbers),
        awaySubs: [],
      });
      navigate(`/match/${match.id}/live`);
    } catch (err) {
      setValidationMessage(err.message || 'Could not create match. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const setOpponentLineupMode = (mode) => {
    setAddOpponentLineup(mode);
    if (mode === 'no') {
      setAwayLineup(buildDefaultOpponentLineup(form.sport, useSquadNumbers));
    } else {
      setAwayLineup((prev) =>
        isDefaultOpponentLineup(prev, form.sport)
          ? buildEmptyOpponentInputs(form.sport)
          : [...prev, ...Array(Math.max(0, getOpponentPositionCount(form.sport) - prev.length)).fill('')].slice(0, getOpponentPositionCount(form.sport))
      );
    }
  };

  const updateOpponentPlayer = (index, value) => {
    setAwayLineup((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="space-y-4 pb-4">
      <h2 className="text-xl font-bold">New Match</h2>

      <div>
        <Label className={`text-xs font-semibold uppercase tracking-wide ${fieldErrors.sport ? fieldErrorLabelClass : 'text-muted-foreground'}`}>
          Sport <span className="text-red-600">*</span>
        </Label>
        <Select value={form.sport} onValueChange={set('sport')}>
          <SelectTrigger className={fieldErrors.sport ? fieldErrorClass : ''}><SelectValue /></SelectTrigger>
          <SelectContent>{SPORTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
        {fieldErrors.sport && <p className="text-xs text-red-600 mt-1">Sport is required</p>}
      </div>

      {/* Team matchup block */}
      <div className={`rounded-xl border overflow-hidden ${fieldErrors.homeTeam || fieldErrors.awayTeam ? 'border-red-500 ring-1 ring-red-500' : 'border-border'}`}>
        {/* Row 1: your club */}
        <div className={`px-4 py-3 flex items-center gap-3 ${((fieldErrors.homeTeam && !swapped) || (fieldErrors.awayTeam && swapped)) ? 'bg-red-50' : ''}`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest w-10 shrink-0 ${swapped ? 'text-muted-foreground' : 'text-primary'}`}>{swapped ? 'Away' : 'Home'}</span>
          <div className="flex-1">
            <p className={`text-[10px] mb-0.5 ${((fieldErrors.homeTeam && !swapped) || (fieldErrors.awayTeam && swapped)) ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
              Your Club <span className="text-red-600">*</span>
            </p>
            <p className={`font-semibold text-sm ${!clubName && ((fieldErrors.homeTeam && !swapped) || (fieldErrors.awayTeam && swapped)) ? 'text-red-700' : ''}`}>
              {clubName || <span className="italic">No club saved — add one in My Club</span>}
            </p>
            {!clubName && ((fieldErrors.homeTeam && !swapped) || (fieldErrors.awayTeam && swapped)) && (
              <p className="text-xs text-red-600 mt-0.5">Your club name is required</p>
            )}
          </div>
        </div>

        {/* Swap divider */}
        <div className="flex items-center gap-3 px-4 py-1 bg-muted/50 border-y border-border">
          <span className="text-[10px] text-muted-foreground w-10 shrink-0">v</span>
          <button type="button" onClick={() => { setSwapped(s => !s); clearFieldError('homeTeam'); clearFieldError('awayTeam'); }}
            className="flex items-center gap-1.5 text-[11px] text-primary font-semibold py-1 hover:underline">
            <ArrowUpDown className="w-3 h-3" /> Swap Home / Away
          </button>
        </div>

        {/* Row 2: opponent */}
        <div className={`px-4 py-3 flex items-center gap-3 ${((fieldErrors.awayTeam && !swapped) || (fieldErrors.homeTeam && swapped)) ? 'bg-red-50' : ''}`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest w-10 shrink-0 ${swapped ? 'text-primary' : 'text-muted-foreground'}`}>{swapped ? 'Home' : 'Away'}</span>
          <div className="flex-1">
            <p className={`text-[10px] mb-0.5 ${((fieldErrors.awayTeam && !swapped) || (fieldErrors.homeTeam && swapped)) ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
              Opponent <span className="text-red-600">*</span>
            </p>
            <Select value={opponent} onValueChange={handleOpponentSelect}>
              <SelectTrigger className={`text-sm h-8 border-0 p-0 shadow-none focus:ring-0 font-semibold ${((fieldErrors.awayTeam && !swapped) || (fieldErrors.homeTeam && swapped)) ? `${fieldErrorClass} px-2` : ''}`}>
                <SelectValue placeholder="Select opponent…" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                <SelectItem value="__add__">➕ Add new opponent…</SelectItem>
              </SelectContent>
            </Select>
            {((fieldErrors.awayTeam && !swapped) || (fieldErrors.homeTeam && swapped)) && !opponent && (
              <p className="text-xs text-red-600 mt-0.5">Opponent is required</p>
            )}
          </div>
        </div>
      </div>

      {showAddOpponent && (
        <div className="flex gap-2">
          <Input value={newOpponentName} onChange={e => setNewOpponentName(e.target.value)} placeholder="New opponent name" className="text-base" onKeyDown={e => e.key === 'Enter' && saveNewOpponent()} />
          <Button onClick={saveNewOpponent} size="sm">Add</Button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Competition</Label>
          <label className="flex items-center gap-1 text-[11px] text-primary cursor-pointer">
            <Upload className="w-3 h-3" />
            Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCompetitionCSV} />
          </label>
        </div>
        {competitions.length > 0 ? (
          <Select value={form.competition} onValueChange={set('competition')}>
            <SelectTrigger><SelectValue placeholder="Select competition" /></SelectTrigger>
            <SelectContent>{competitions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        ) : (
          <Input value={form.competition} onChange={set('competition')} placeholder="e.g. County Championship" />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</Label>
          <label className="flex items-center gap-1 text-[11px] text-primary cursor-pointer">
            <Upload className="w-3 h-3" />
            Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCategoryCSV} />
          </label>
        </div>
        {categories.length > 0 ? (
          <Select value={form.category} onValueChange={set('category')}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <Input value={form.category} onChange={set('category')} placeholder="e.g. Senior, Minor, U21" />
        )}
      </div>

      {/* Team Line-Ups */}
      <div className="rounded-xl border border-border p-4 space-y-4">
        <p className="font-bold text-sm">Team Line-Ups</p>

        {/* Club lineup */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Club</p>
          {!form.category ? (
            <p className="text-sm text-muted-foreground italic">Select a category above to choose players for this line-up.</p>
          ) : categoryPlayers.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No players found for {form.category}. Add them in My Club → Players.</p>
          ) : (
            <>
              <LineupSelector
                players={categoryPlayers}
                selected={homeLineup}
                onChange={setHomeLineup}
                excluded={homeSubs}
                max={isGAA(form.sport) ? 15 : 11}
                label={`Starting ${isGAA(form.sport) ? '15' : '11'}`}
              />
              <LineupSelector
                players={categoryPlayers}
                selected={homeSubs}
                onChange={setHomeSubs}
                excluded={homeLineup}
                max={isGAA(form.sport) ? 10 : 7}
                label="Substitutes"
              />
            </>
          )}
        </div>

        {/* Opponent lineup toggle */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Add Opponent Line-Up?</p>
          <div className="grid grid-cols-2 gap-2">
            {['yes', 'no'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setOpponentLineupMode(v)}
                className={`py-2 rounded-xl font-bold text-sm transition-all capitalize ${
                  addOpponentLineup === v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
          {addOpponentLineup === 'no' && (
            <>
              <label className="flex items-center gap-2.5 mt-3 cursor-pointer select-none">
                <Checkbox
                  id="use-squad-numbers"
                  checked={useSquadNumbers}
                  onCheckedChange={(checked) => {
                    const useHash = checked === true;
                    setUseSquadNumbers(useHash);
                    setAwayLineup(buildDefaultOpponentLineup(form.sport, useHash));
                  }}
                />
                <span className="text-sm font-medium text-foreground">Use squad numbers</span>
              </label>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Opposition positions will be numbered 1-15 and can be named later
              </p>
            </>
          )}
        </div>

        {/* Opponent lineup */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {opponent || 'Opponent'} — Starting {getOpponentPositionCount(form.sport)}
          </p>

          {addOpponentLineup === 'no' ? (
            <div className="bg-muted/50 rounded-xl border border-border divide-y divide-border">
              {opponentSlots.map((slot) => (
                <div key={slot.number} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="font-mono font-bold text-muted-foreground w-10 shrink-0 tabular-nums">
                    {slot.label}
                  </span>
                  <span className="font-medium text-foreground">{slot.position}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {opponentSlots.map((slot, i) => (
                <div key={slot.number} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground w-8 shrink-0 text-right tabular-nums">
                    {slot.label}
                  </span>
                  <Input
                    value={awayLineup[i] ?? ''}
                    onChange={(e) => updateOpponentPlayer(i, e.target.value)}
                    placeholder="Player name"
                    className="text-base h-10 flex-1"
                  />
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground">All fields are optional — empty slots use the position name above.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label className={`text-xs font-semibold uppercase tracking-wide ${fieldErrors.matchDate ? fieldErrorLabelClass : 'text-muted-foreground'}`}>
          Date & Time <span className="text-red-600">*</span>
        </Label>
        <Input
          type="datetime-local"
          value={form.matchDate}
          onChange={set('matchDate')}
          className={fieldErrors.matchDate ? fieldErrorClass : ''}
        />
        {fieldErrors.matchDate && <p className="text-xs text-red-600 mt-1">Date & time is required</p>}
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Venue</Label>
        <Input value={form.venue} onChange={set('venue')} placeholder="Match venue" list="venues-list" />
        <datalist id="venues-list">{venues.map(v => <option key={v.id} value={v.name} />)}</datalist>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Referee</Label>
        <Input value={form.referee} onChange={set('referee')} placeholder="Referee name" />
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weather</Label>
        <Select value={form.weather} onValueChange={set('weather')}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{WEATHER_OPTIONS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Est. Attendance</Label>
        <Select value={form.attendance} onValueChange={set('attendance')}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{ATTENDANCE_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm">Sponsor</p>
          <label className="flex items-center gap-1 text-[11px] text-primary cursor-pointer font-semibold">
            <Upload className="w-3 h-3" />Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleSponsorCSV} />
          </label>
        </div>
        {sponsors.length > 0 && (
          <Select value={selectedSponsor} onValueChange={(val) => {
            setSelectedSponsor(val);
            if (val === '__none__') {
              setForm(f => ({ ...f, sponsorName: '', sponsorLogo: '', sponsorLink: '' }));
            } else {
              const sp = sponsors.find(s => s.id === val);
              if (sp) setForm(f => ({ ...f, sponsorName: sp.name, sponsorLogo: sp.logoUrl || '', sponsorLink: sp.websiteLink || '' }));
            }
          }}>
            <SelectTrigger><SelectValue placeholder="Select sponsor…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No sponsor</SelectItem>
              {sponsors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sponsor Name</Label>
          <Input value={form.sponsorName} onChange={set('sponsorName')} placeholder="Sponsor name (optional)" />
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sponsor Logo URL</Label>
          <Input value={form.sponsorLogo} onChange={set('sponsorLogo')} placeholder="https://… image link" />
          {form.sponsorLogo && (
            <img src={form.sponsorLogo} alt="Sponsor logo preview" className="mt-2 h-12 object-contain rounded border border-border" />
          )}
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sponsor Website Link</Label>
          <Input value={form.sponsorLink} onChange={set('sponsorLink')} placeholder="https://sponsor.ie" />
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Template</Label>
        <Select value={form.template} onValueChange={set('template')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="quick">Quick Match</SelectItem>
            <SelectItem value="full">Full Match</SelectItem>
            <SelectItem value="report_only">Report Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="sticky bottom-20 z-30 -mx-4 px-4 pt-3 pb-1 bg-gradient-to-t from-background via-background to-transparent">
        {validationMessage && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3 font-medium" role="alert">
            {validationMessage}
          </p>
        )}
        <Button
          type="button"
          onClick={submit}
          disabled={saving}
          className="w-full py-6 text-base font-black rounded-xl text-white border-0 shadow-lg hover:opacity-95 active:scale-[0.99] transition-all"
          style={{
            background: 'repeating-linear-gradient(90deg, #166534 0px, #166534 28px, #15803d 28px, #15803d 56px)',
            boxShadow: '0 4px 14px rgba(21,128,61,0.45)',
          }}
          size="lg"
        >
          {saving ? 'Creating…' : 'Create Match'}
        </Button>
      </div>
    </div>
  );
}