import { isGAA, isRugby } from '../lib/sportConfig';
import { Pause, Play } from 'lucide-react';

export function teamInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function GAAScore({ goals, points, size = 'hero' }) {
  const g = goals || 0;
  const p = String(points || 0).padStart(2, '0');
  const big = size === 'hero';
  return (
    <div className={`font-black font-mono tabular-nums tracking-tight ${big ? 'text-5xl sm:text-6xl' : 'text-3xl'}`}>
      <span className="text-white">{g}</span>
      <span className="text-[#1A9E6D] mx-0.5">-</span>
      <span className="text-white">{p}</span>
    </div>
  );
}

function TotalScore({ value, size = 'hero' }) {
  const big = size === 'hero';
  return (
    <p className={`font-black tabular-nums text-white ${big ? 'text-5xl sm:text-6xl' : 'text-3xl'}`}>
      {value || 0}
    </p>
  );
}

export default function LiveScoreboard({
  match,
  timerSeconds = 0,
  timerRunning = false,
  onToggleTimer,
  showTimer = true,
}) {
  const gaa = isGAA(match.sport);
  const rugby = isRugby(match.sport);
  const fmtTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const renderScore = (goals, points) => {
    if (gaa) return <GAAScore goals={goals} points={points} />;
    return <TotalScore value={goals} />;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f2439] to-[#0B1A2E] border border-white/10 shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(26,158,109,0.12)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative px-4 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          {/* Home */}
          <div className="flex-1 min-w-0 text-center">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#1A9E6D]/20 border-2 border-[#1A9E6D]/50 flex items-center justify-center">
              <span className="text-lg font-black text-[#1A9E6D]">{teamInitials(match.homeTeamName)}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-tight truncate px-1">
              {match.homeTeamName}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A9E6D]/80 mt-1">Home</p>
            <div className="mt-3">
              {renderScore(match.homeGoals, match.homePoints)}
            </div>
          </div>

          <div className="flex flex-col items-center pt-8 shrink-0">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">vs</span>
          </div>

          {/* Away */}
          <div className="flex-1 min-w-0 text-center">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
              <span className="text-lg font-black text-white/90">{teamInitials(match.awayTeamName)}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-tight truncate px-1">
              {match.awayTeamName}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Away</p>
            <div className="mt-3">
              {renderScore(match.awayGoals, match.awayPoints)}
            </div>
          </div>
        </div>

        {match.halfTimeHome && (
          <p className="text-center text-xs text-white/50 mt-4 font-medium">
            HT {match.halfTimeHome} – {match.halfTimeAway}
          </p>
        )}

        {(match.sponsorLogo || match.sponsorName) && (
          <div className="mt-3 flex justify-center items-center gap-2">
            {match.sponsorLogo && (
              <img src={match.sponsorLogo} alt="" className="h-6 object-contain opacity-90" />
            )}
            {match.sponsorName && (
              <span className="text-[10px] text-white/50">
                {match.sponsorLogo ? match.sponsorName : `Sponsored by ${match.sponsorName}`}
              </span>
            )}
          </div>
        )}

        {showTimer && (gaa || match.sport === 'soccer' || rugby) && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-[#0B1A2E] border-4 border-[#1A9E6D]/40 flex items-center justify-center shadow-[0_0_24px_rgba(26,158,109,0.25)]">
                <span className="font-mono text-2xl font-black text-white tabular-nums tracking-wider">
                  {fmtTimer(timerSeconds)}
                </span>
              </div>
              {timerRunning && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
              )}
            </div>
            <button
              type="button"
              onClick={onToggleTimer}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-colors active:scale-95"
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {timerRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
