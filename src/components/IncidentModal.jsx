import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const PLAYER_REQUIRED = ['goal','point','free_scored','45_scored','65_scored','yellow_card','black_card','red_card','substitution','penalty_scored','penalty'];
const PLAYER_OPTIONAL = ['wide','free_missed','45_missed','65_missed','injury','penalty_missed','own_goal'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildCommentary(type, min, teamName, player, playerOff, note) {
  const m = `${min}'`;
  switch (type) {
    case 'goal': return pick([
      `${m} Goal! And there is a goal for ${teamName}. ${player} finds the net.`,
      `${m} Goal for ${teamName}! ${player} finishes brilliantly.`,
      `${m} The green flag is raised for ${teamName}. ${player} gets the goal.`,
      `${m} Big moment in the game. ${player} hits the net for ${teamName}.`,
    ]);
    case 'point': return pick([
      `${m} Point for ${teamName}. ${player} sends it over the bar.`,
      `${m} ${player} adds a point for ${teamName}.`,
      `${m} Good score from ${player} as ${teamName} move the scoreboard on.`,
      `${m} ${teamName} keep the pressure on with a point from ${player}.`,
    ]);
    case 'wide': return player ? pick([
      `${m} Wide for ${teamName}. ${player} pulls the effort wide.`,
      `${m} Wide ball from ${teamName}. The chance goes astray for ${player}.`,
      `${m} ${teamName} create the chance, but ${player}'s effort drifts wide.`,
    ]) : pick([
      `${m} Wide for ${teamName}.`,
      `${m} Wide ball from ${teamName}. The chance goes astray.`,
      `${m} ${teamName} create the chance, but the effort drifts wide.`,
    ]);
    case 'free_scored': return pick([
      `${m} Free scored for ${teamName}. ${player} makes no mistake from the placed ball.`,
      `${m} ${player} converts the free for ${teamName}.`,
      `${m} Reliable from the placed ball. ${player} adds another for ${teamName}.`,
      `${m} Free over the bar for ${teamName}, scored by ${player}.`,
    ]);
    case 'free_missed': return player ? pick([
      `${m} Free missed by ${teamName}. ${player} sends the free wide.`,
      `${m} The free goes wide for ${teamName}.`,
      `${m} A chance from the placed ball is missed by ${player} of ${teamName}.`,
    ]) : pick([
      `${m} Free missed by ${teamName}.`,
      `${m} The free goes wide for ${teamName}.`,
      `${m} ${teamName} fail to convert the free.`,
    ]);
    case '45_scored': return pick([
      `${m} 45 scored for ${teamName}. ${player} converts from distance.`,
      `${m} Excellent 45 from ${player} for ${teamName}.`,
      `${m} ${player} sends the 45 over the bar for ${teamName}.`,
      `${m} Big score from a 45 for ${teamName}.`,
    ]);
    case '45_missed': return player ? pick([
      `${m} 45 missed by ${teamName}. ${player} sends it wide.`,
      `${m} The 45 drifts wide for ${teamName}.`,
    ]) : pick([
      `${m} 45 missed by ${teamName}.`,
      `${m} No score from the 45 for ${teamName}.`,
    ]);
    case '65_scored': return pick([
      `${m} 65 scored for ${teamName}. ${player} splits the posts.`,
      `${m} ${player} converts the 65 for ${teamName}.`,
      `${m} Fine strike from a 65 by ${player} for ${teamName}.`,
      `${m} ${teamName} add another from a 65.`,
    ]);
    case '65_missed': return player ? pick([
      `${m} 65 missed by ${teamName}. ${player} sends it wide.`,
      `${m} The 65 goes wide for ${teamName}.`,
    ]) : pick([
      `${m} 65 missed by ${teamName}.`,
      `${m} No score from the 65 for ${teamName}.`,
    ]);
    case 'yellow_card': return pick([
      `${m} Yellow card for ${player} of ${teamName}.`,
      `${m} ${player} goes into the book for ${teamName}.`,
      `${m} The referee shows yellow to ${player} of ${teamName}.`,
    ]);
    case 'black_card': return pick([
      `${m} Black card for ${player} of ${teamName}.`,
      `${m} ${teamName} are reduced temporarily as ${player} receives a black card.`,
      `${m} The referee shows a black card to ${player} of ${teamName}.`,
    ]);
    case 'red_card': return pick([
      `${m} Red card for ${player} of ${teamName}. ${teamName} are down a player.`,
      `${m} ${player} is sent off for ${teamName}.`,
      `${m} Big moment here as ${teamName} lose ${player} to a red card.`,
    ]);
    case 'substitution': return pick([
      `${m} Substitution for ${teamName}. ${player} replaces ${playerOff}.`,
      `${m} Change for ${teamName} as ${player} comes on for ${playerOff}.`,
      `${m} ${teamName} make a switch. ${player} is introduced for ${playerOff}.`,
    ]);
    case 'injury': return player ? pick([
      `${m} Injury concern for ${teamName}. ${player} is receiving treatment.`,
      `${m} Play is paused as ${player} of ${teamName} receives attention.`,
      `${m} Concern here for ${teamName} as ${player} goes down injured.`,
    ]) : pick([
      `${m} Injury concern for ${teamName}. Play is paused for treatment.`,
      `${m} A player from ${teamName} is receiving treatment on the pitch.`,
    ]);
    case 'penalty':
    case 'penalty_scored': return pick([
      `${m} Penalty goal for ${teamName}! ${player} finishes from the spot.`,
      `${m} Goal from the penalty for ${teamName}. ${player} makes no mistake.`,
      `${m} ${player} buries the penalty for ${teamName}.`,
    ]);
    case 'penalty_missed': return player ? pick([
      `${m} Penalty missed by ${teamName}. ${player} fails to convert.`,
      `${m} Big chance missed. ${player} does not convert the penalty for ${teamName}.`,
      `${m} The penalty is missed by ${teamName}.`,
    ]) : pick([
      `${m} Penalty missed by ${teamName}.`,
      `${m} The penalty goes wide for ${teamName}.`,
    ]);
    case 'own_goal': return pick([
      player ? `${m} Own goal. The ball comes off ${player} and gives ${teamName} a goal.` : `${m} Own goal. A mistake at the back gives ${teamName} a goal.`,
      `${m} Own goal awarded to ${teamName}.`,
      `${m} The ball ends up in the net and ${teamName} are awarded the goal.`,
    ]);
    case 'manual_update': return note ? `${min}' ${note}` : `${min}' Update.`;
    default: return `${m} ${type.replace(/_/g, ' ')}.`;
  }
}

export default function IncidentModal({ incident, match, defaultMinute, players, onConfirm, onClose }) {
  const [team, setTeam] = useState('home');
  const [player, setPlayer] = useState('');
  const [playerOff, setPlayerOff] = useState('');
  const [note, setNote] = useState('');
  const [localMinute, setLocalMinute] = useState(defaultMinute || '');
  const [playerInputMode, setPlayerInputMode] = useState('select');
  const [playerOffInputMode, setPlayerOffInputMode] = useState('select');

  const teamName = team === 'home' ? match.homeTeamName : match.awayTeamName;
  const type = incident.type;

  // Show team-specific players first, then all others — ensures the list is never empty
  const teamPlayers = useMemo(() => {
    const teamSpecific = players.filter(p => p.team === teamName);
    if (teamSpecific.length > 0) return teamSpecific.sort((a, b) => parseInt(a.number || '99') - parseInt(b.number || '99'));
    return players.sort((a, b) => parseInt(a.number || '99') - parseInt(b.number || '99'));
  }, [players, teamName]);

  const needsPlayer = PLAYER_REQUIRED.includes(type);
  const optPlayer = PLAYER_OPTIONAL.includes(type);
  const needsNote = type === 'manual_update';
  const needsPlayerOff = type === 'substitution';
  const effectiveMinute = localMinute || defaultMinute || '0';

  const isValid = () => {
    if (!effectiveMinute) return false;
    if (needsPlayer && !player.trim()) return false;
    if (needsNote && !note.trim()) return false;
    if (needsPlayerOff && (!player.trim() || !playerOff.trim())) return false;
    return true;
  };

  const handleConfirm = () => {
    const details = buildCommentary(type, effectiveMinute, teamName, player.trim(), playerOff.trim(), note.trim());
    onConfirm({ type, minute: effectiveMinute, team, player: player.trim(), playerOff: playerOff.trim(), details, scores: incident.scores, scoreDelta: incident.scoreDelta });
  };

  const PlayerField = ({ value, onChange, inputMode, setInputMode, label = 'Player' }) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
        {teamPlayers.length > 0 && (
          <button type="button" onClick={() => { setInputMode(m => m === 'select' ? 'type' : 'select'); onChange(''); }}
            className="text-[11px] text-primary underline">
            {inputMode === 'select' ? 'Type name' : 'Pick from list'}
          </button>
        )}
      </div>
      {teamPlayers.length > 0 && inputMode === 'select' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger><SelectValue placeholder="Select player…" /></SelectTrigger>
          <SelectContent className="z-[200]">
            {teamPlayers.map(p => (
              <SelectItem key={p.id} value={p.name}>
                {p.number ? `#${p.number} ` : ''}{p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Player name…" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-start" onClick={onClose} style={{background: 'rgba(0,0,0,0.5)'}}>
      <div className="w-full max-w-lg bg-card rounded-t-2xl p-5 space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">{incident.label}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Minute</Label>
          <Input value={localMinute} onChange={e => setLocalMinute(e.target.value)}
            placeholder={defaultMinute || 'e.g. 27, 45+2'} className="font-mono text-center" />
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Team</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {['home', 'away'].map(t => (
              <button key={t} type="button" onClick={() => { setTeam(t); setPlayer(''); setPlayerOff(''); }}
                className={`py-2.5 rounded-xl font-bold text-sm transition-all ${team === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {t === 'home' ? match.homeTeamName : match.awayTeamName}
              </button>
            ))}
          </div>
        </div>

        {(needsPlayer || optPlayer) && type !== 'substitution' && (
          <PlayerField value={player} onChange={setPlayer}
            inputMode={playerInputMode} setInputMode={setPlayerInputMode}
            label={needsPlayer ? 'Player *' : 'Player (optional)'} />
        )}

        {needsPlayerOff && (
          <>
            <PlayerField value={player} onChange={setPlayer}
              inputMode={playerInputMode} setInputMode={setPlayerInputMode}
              label="Player On *" />
            <PlayerField value={playerOff} onChange={setPlayerOff}
              inputMode={playerOffInputMode} setInputMode={setPlayerOffInputMode}
              label="Player Off *" />
          </>
        )}

        {needsNote && (
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Update text *</Label>
            <Input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Barryroe taking control around midfield" />
          </div>
        )}

        {type === 'injury' && (
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Note (optional)</Label>
            <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Additional details…" />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleConfirm} disabled={!isValid()} className="flex-1 font-bold">Add to Timeline</Button>
        </div>
      </div>
    </div>
  );
}