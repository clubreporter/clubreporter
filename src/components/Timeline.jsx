import {
  CircleDot, Target, Minus, Flag, ShieldAlert, ArrowLeftRight,
  HeartPulse, Camera, StickyNote, Clock, Zap, Ban,
} from 'lucide-react';

function getIncidentMeta(type) {
  const map = {
    goal: { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Goal' },
    point: { icon: CircleDot, color: 'text-emerald-300', bg: 'bg-emerald-500/15', label: 'Point' },
    wide: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Wide' },
    free_scored: { icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Free' },
    free_missed: { icon: Ban, color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Free Missed' },
    '45_scored': { icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: "45'" },
    '45_missed': { icon: Ban, color: 'text-slate-400', bg: 'bg-slate-500/15', label: "45' Missed" },
    '65_scored': { icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: "65'" },
    '65_missed': { icon: Ban, color: 'text-slate-400', bg: 'bg-slate-500/15', label: "65' Missed" },
    yellow_card: { icon: ShieldAlert, color: 'text-yellow-400', bg: 'bg-yellow-500/15', label: 'Yellow' },
    black_card: { icon: ShieldAlert, color: 'text-gray-300', bg: 'bg-gray-500/15', label: 'Black' },
    red_card: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Red' },
    substitution: { icon: ArrowLeftRight, color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Sub' },
    injury: { icon: HeartPulse, color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Injury' },
    penalty_scored: { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Penalty' },
    penalty_missed: { icon: Ban, color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Pen Missed' },
    own_goal: { icon: Target, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Own Goal' },
    manual_update: { icon: StickyNote, color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Update' },
    throw_in: { icon: Flag, color: 'text-[#1A9E6D]', bg: 'bg-[#1A9E6D]/15', label: 'Throw-In' },
    half_time: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Half Time' },
    second_half: { icon: Clock, color: 'text-[#1A9E6D]', bg: 'bg-[#1A9E6D]/15', label: '2nd Half' },
    full_time: { icon: Flag, color: 'text-red-400', bg: 'bg-red-500/15', label: 'Full Time' },
    extra_time: { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Extra Time' },
    photo: { icon: Camera, color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Photo' },
    admin_note: { icon: StickyNote, color: 'text-slate-500', bg: 'bg-slate-500/10', label: 'Note' },
  };
  return map[type] || { icon: CircleDot, color: 'text-slate-400', bg: 'bg-slate-500/15', label: type?.replace(/_/g, ' ') };
}

export default function Timeline({ incidents, dark = false }) {
  if (!incidents?.length) {
    return (
      <p className={`text-center text-sm py-8 ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>
        No events yet — log the first incident above
      </p>
    );
  }

  const minuteClass = dark ? 'text-[#1A9E6D] font-mono' : 'text-primary font-mono';
  const textClass = dark ? 'text-white/90' : '';
  const subClass = dark ? 'text-white/50' : 'text-muted-foreground';
  const borderClass = dark ? 'border-white/10' : 'border-border';
  const teamHome = dark ? 'bg-[#1A9E6D]/20 text-[#1A9E6D]' : 'bg-primary/10 text-primary';
  const teamAway = dark ? 'bg-white/10 text-white/60' : 'bg-muted text-muted-foreground';

  return (
    <div className="space-y-0">
      {[...incidents].reverse().map((inc) => {
        const meta = getIncidentMeta(inc.type);
        const Icon = meta.icon;

        if (inc.type === 'photo') {
          return (
            <div key={inc.id} className={`py-3 px-1 border-b ${borderClass} last:border-0 space-y-2`}>
              <div className="flex items-start gap-3">
                <span className={`text-xs font-black w-9 text-right shrink-0 pt-1 ${minuteClass}`}>{inc.minute}&apos;</span>
                <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${textClass}`}>{inc.details || 'Photo added'}</p>
                </div>
              </div>
              {inc.player && (
                <img src={inc.player} alt="Match" className="w-full rounded-xl object-cover max-h-40 ml-12 border border-white/10" />
              )}
            </div>
          );
        }

        if (inc.type === 'admin_note') {
          return (
            <div key={inc.id} className={`py-2 px-1 border-b ${borderClass} last:border-0`}>
              <p className={`text-xs italic pl-12 ${subClass}`}>{inc.details}</p>
            </div>
          );
        }

        return (
          <div key={inc.id} className={`flex items-start gap-3 py-3 border-b ${borderClass} last:border-0`}>
            <span className={`text-xs font-black w-9 text-right shrink-0 pt-1.5 ${minuteClass}`}>{inc.minute}&apos;</span>
            <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${meta.color}`} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              {inc.details ? (
                <p className={`text-sm leading-snug ${textClass}`}>{inc.details}</p>
              ) : (
                <p className={`text-sm font-semibold ${textClass}`}>
                  {meta.label}
                  {inc.player && <span className={`font-normal ml-1.5 ${subClass}`}>{inc.player}</span>}
                </p>
              )}
            </div>
            {inc.team && (
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-1 ${inc.team === 'home' ? teamHome : teamAway}`}>
                {inc.team === 'home' ? 'HOME' : 'AWAY'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
