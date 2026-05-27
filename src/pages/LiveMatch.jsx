import { useState, useEffect, useCallback } from 'react';
import { usePlan } from '../lib/usePlan';
import { useParams, Link } from 'react-router-dom';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Undo2, Eye, FileText, Camera } from 'lucide-react';
import PhotoModal from '../components/PhotoModal';
import LiveScoreboard from '../components/LiveScoreboard';
import IncidentModal from '../components/IncidentModal';
import IncidentButtons from '../components/IncidentButtons';
import Timeline from '../components/Timeline';
import { STATUS_LABELS, isGAA, isRugby, formatGAAScore } from '../lib/sportConfig';

export default function LiveMatch() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [minute, setMinute] = useState('');
  const [lastIncident, setLastIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [players, setPlayers] = useState([]);
  const [modalIncident, setModalIncident] = useState(null);
  const [confirmUndo, setConfirmUndo] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const { isPremium } = usePlan();

  const loadData = useCallback(async () => {
    const matches = await entities.Match.filter({ id: matchId });
    if (matches.length) setMatch(matches[0]);
    const inc = await entities.MatchIncident.filter({ matchId }, 'created_date', 100);
    const allPlayers = await entities.Player.list();
    const m = matches[0];
    const lineupNames = [
      ...(m?.homeLineup || []).map(name => ({ name, team: m.homeTeamName })),
      ...(m?.homeSubs || []).map(name => ({ name, team: m.homeTeamName })),
      ...(m?.awayLineup || []).map(name => ({ name, team: m.awayTeamName })),
      ...(m?.awaySubs || []).map(name => ({ name, team: m.awayTeamName })),
    ];
    const merged = [...allPlayers];
    lineupNames.forEach(lp => {
      if (!merged.find(p => p.name === lp.name && p.team === lp.team)) {
        merged.push({ id: `lineup_${lp.team}_${lp.name}`, name: lp.name, team: lp.team });
      }
    });
    setPlayers(merged);
    setIncidents(inc);
    setLoading(false);
  }, [matchId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const timerToMinute = (secs) => String(Math.floor(secs / 60) + 1);

  const getEffectiveMinute = () => {
    if (minute) return minute;
    if (match && (isGAA(match.sport) || match.sport === 'soccer' || isRugby(match.sport))) {
      return timerToMinute(timerSeconds);
    }
    return '';
  };

  const updateStatus = async (newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'half_time' && match) {
      const gaa = isGAA(match.sport);
      const rugby = isRugby(match.sport);
      updates.halfTimeHome = gaa
        ? `${match.homeGoals || 0}-${String(match.homePoints || 0).padStart(2, '0')}`
        : String(rugby ? match.homeGoals || 0 : match.homeGoals || 0);
      updates.halfTimeAway = gaa
        ? `${match.awayGoals || 0}-${String(match.awayPoints || 0).padStart(2, '0')}`
        : String(rugby ? match.awayGoals || 0 : match.awayGoals || 0);
    }
    await entities.Match.update(matchId, updates);
    setMatch(m => ({ ...m, ...updates }));
  };

  const addMatchEvent = async (eventType) => {
    const min = getEffectiveMinute() || '1';
    let details = '';
    let newStatus = null;
    const hs = formatGAAScore(match.homeGoals, match.homePoints);
    const as_ = formatGAAScore(match.awayGoals, match.awayPoints);

    if (eventType === 'throw_in') {
      const sponsorPart = match.sponsorName ? ` Today's game report is sponsored by ${match.sponsorName}.` : '';
      details = `1' Welcome to today's game: ${match.homeTeamName} vs ${match.awayTeamName}.${sponsorPart} Throw-in is underway.`;
      newStatus = 'live';
      if (isGAA(match.sport)) { setTimerSeconds(0); setTimerRunning(true); }
    } else if (eventType === 'half_time') {
      details = `HT Half Time: ${match.homeTeamName} ${hs} - ${match.awayTeamName} ${as_}. The referee brings the first half to a close.`;
      newStatus = 'half_time';
      setTimerRunning(false);
    } else if (eventType === 'second_half') {
      details = `2H The second half is underway. ${match.homeTeamName} and ${match.awayTeamName} are back in action.`;
      newStatus = 'live';
      if (isGAA(match.sport)) setTimerRunning(true);
    } else if (eventType === 'full_time') {
      details = `FT Full Time: ${match.homeTeamName} ${hs} - ${match.awayTeamName} ${as_}. The referee blows the final whistle.`;
      newStatus = 'full_time';
      setTimerRunning(false);
    } else if (eventType === 'extra_time') {
      details = `ET Extra time is underway. There is still nothing between ${match.homeTeamName} and ${match.awayTeamName}.`;
      newStatus = 'extra_time';
    }

    if (newStatus) await updateStatus(newStatus);
    const inc = await entities.MatchIncident.create({ matchId, type: eventType, minute: min, team: 'home', details });
    setIncidents(prev => [...prev, inc]);
    setLastIncident({ ...inc, config: {} });
    setMinute('');
  };

  const addIncident = async ({ type, minute: incMinute, team, player, details, scores, scoreDelta }) => {
    setModalIncident(null);
    setMinute('');
    const scoreUpdate = { currentMinute: incMinute, lastIncidentId: '_pending' };
    if (scores === 'delta' && scoreDelta) {
      const f = team === 'home' ? 'homeGoals' : 'awayGoals';
      scoreUpdate[f] = (match[f] || 0) + scoreDelta;
    } else if (scores === 'goals') {
      const f = team === 'home' ? 'homeGoals' : 'awayGoals';
      scoreUpdate[f] = (match[f] || 0) + 1;
    } else if (scores === 'points') {
      const f = team === 'home' ? 'homePoints' : 'awayPoints';
      scoreUpdate[f] = (match[f] || 0) + 1;
    } else if (scores === 'goals_other') {
      const f = team === 'home' ? 'awayGoals' : 'homeGoals';
      scoreUpdate[f] = (match[f] || 0) + 1;
    }
    if (Object.keys(scoreUpdate).length > 2) setMatch(m => ({ ...m, ...scoreUpdate }));
    const inc = await entities.MatchIncident.create({
      matchId, type, minute: incMinute, team, player: player || undefined, details: details || undefined,
    });
    scoreUpdate.lastIncidentId = inc.id;
    await entities.Match.update(matchId, scoreUpdate);
    setMatch(m => ({ ...m, ...scoreUpdate }));
    setLastIncident({ ...inc, config: { scores, scoreDelta } });
    setIncidents(prev => [...prev, inc]);
  };

  const undoLast = async () => {
    if (!lastIncident) return;
    const cfg = lastIncident.config;
    const scoreUpdate = {};
    if (cfg?.scores === 'delta' && cfg?.scoreDelta) {
      const f = lastIncident.team === 'home' ? 'homeGoals' : 'awayGoals';
      scoreUpdate[f] = Math.max(0, (match[f] || 0) - cfg.scoreDelta);
    } else if (cfg?.scores === 'goals') {
      const f = lastIncident.team === 'home' ? 'homeGoals' : 'awayGoals';
      scoreUpdate[f] = Math.max(0, (match[f] || 0) - 1);
    } else if (cfg?.scores === 'points') {
      const f = lastIncident.team === 'home' ? 'homePoints' : 'awayPoints';
      scoreUpdate[f] = Math.max(0, (match[f] || 0) - 1);
    } else if (cfg?.scores === 'goals_other') {
      const f = lastIncident.team === 'home' ? 'awayGoals' : 'homeGoals';
      scoreUpdate[f] = Math.max(0, (match[f] || 0) - 1);
    }
    await entities.MatchIncident.delete(lastIncident.id);
    if (Object.keys(scoreUpdate).length) await entities.Match.update(matchId, scoreUpdate);
    setMatch(m => ({ ...m, ...scoreUpdate }));
    setIncidents(prev => prev.filter(i => i.id !== lastIncident.id));
    const noteInc = await entities.MatchIncident.create({
      matchId, type: 'admin_note', minute: lastIncident.minute, team: 'home', details: 'Last action undone.',
    });
    setIncidents(prev => [...prev, noteInc]);
    setLastIncident(null);
    setConfirmUndo(false);
  };

  if (loading || !match) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#1A9E6D]/20 border-t-[#1A9E6D] rounded-full animate-spin" />
      </div>
    );
  }

  const isLive = ['live', 'half_time', 'extra_time', 'penalties'].includes(match.status);

  const MATCH_CTRL = [
    { type: 'throw_in', label: 'Throw-In', recommended: match.status === 'scheduled' },
    { type: 'half_time', label: 'Half Time', recommended: match.status === 'live' && !match.halfTimeHome },
    { type: 'second_half', label: '2nd Half', recommended: match.status === 'half_time' },
    { type: 'full_time', label: 'Full Time', recommended: (match.status === 'live' && !!match.halfTimeHome) || match.status === 'extra_time' },
    { type: 'extra_time', label: 'Extra Time', recommended: match.status === 'full_time' },
  ];

  return (
    <div className="-mx-4 -mt-5 mb-2 min-h-[calc(100dvh-7rem)] bg-[#0B1A2E] text-white px-4 pt-4 pb-6 space-y-4">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/10 text-white/60 border border-white/10'
          }`}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
            {STATUS_LABELS[match.status]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link to={`/match/${matchId}/report`}>
            <Button variant="ghost" size="sm" className="h-8 text-white/70 hover:text-white hover:bg-white/10 text-xs">
              <FileText className="w-3.5 h-3.5 mr-1" />Report
            </Button>
          </Link>
          <Link to={`/m/${match.publicId}`} target="_blank">
            <Button variant="ghost" size="sm" className="h-8 text-white/70 hover:text-white hover:bg-white/10 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1" />Public
            </Button>
          </Link>
        </div>
      </div>

      {/* Match controls — horizontal pills */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Match Controls</p>
        <div className="flex flex-wrap gap-1.5">
          {MATCH_CTRL.map(btn => (
            <button
              key={btn.type}
              type="button"
              onClick={() => addMatchEvent(btn.type)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all active:scale-95 touch-manipulation ${
                btn.recommended
                  ? 'bg-[#1A9E6D] text-white border-[#1A9E6D] shadow-sm shadow-[#1A9E6D]/30'
                  : 'bg-white/5 text-white/40 border-white/10 opacity-60'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scoreboard + timer */}
      <LiveScoreboard
        match={match}
        timerSeconds={timerSeconds}
        timerRunning={timerRunning}
        onToggleTimer={() => setTimerRunning(r => !r)}
        showTimer={isGAA(match.sport)}
      />

      {/* Minute override + undo */}
      <div className="flex gap-2">
        <Input
          value={minute}
          onChange={e => setMinute(e.target.value)}
          placeholder="Minute override (e.g. 27)"
          className="flex-1 text-center font-mono h-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#1A9E6D]"
        />
        {confirmUndo ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setConfirmUndo(false)} className="h-10 text-white/60 hover:text-white hover:bg-white/10 text-xs">
              No
            </Button>
            <Button variant="destructive" size="sm" onClick={undoLast} className="h-10 text-xs">
              Undo
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setConfirmUndo(true)}
            disabled={!lastIncident}
            className="h-10 shrink-0 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 text-xs"
          >
            <Undo2 className="w-3.5 h-3.5 mr-1" />Undo
          </Button>
        )}
      </div>

      {/* Event buttons */}
      <div className="rounded-2xl bg-[#0f2439]/80 border border-white/10 p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Log Event</p>
        <IncidentButtons sport={match.sport} onIncident={setModalIncident} />
        <button
          type="button"
          onClick={() => setShowPhotoModal(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-violet-600/90 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-xl text-sm active:scale-[0.98] transition-all border border-violet-400/30"
        >
          <Camera className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl bg-[#0f2439]/60 border border-white/10 p-4">
        <h3 className="font-bold mb-3 text-[10px] uppercase tracking-[0.2em] text-[#1A9E6D]/80">Timeline</h3>
        <Timeline incidents={incidents} dark />
      </div>

      {showPhotoModal && (
        <PhotoModal
          match={match}
          isPremium={isPremium}
          onPhotoAdded={async ({ photoUrl, caption }) => {
            const min = getEffectiveMinute() || '?';
            const details = caption ? `📷 ${caption}` : '📷 Photo added';
            const inc = await entities.MatchIncident.create({
              matchId, type: 'photo', minute: min, team: 'home', details,
              player: photoUrl,
            });
            setIncidents(prev => [...prev, inc]);
            setMatch(m => ({ ...m, photos: [...(m.photos || []), photoUrl] }));
          }}
          onClose={() => setShowPhotoModal(false)}
        />
      )}

      {modalIncident && (
        <IncidentModal
          incident={modalIncident}
          match={match}
          defaultMinute={getEffectiveMinute()}
          players={players}
          onConfirm={addIncident}
          onClose={() => setModalIncident(null)}
        />
      )}
    </div>
  );
}
