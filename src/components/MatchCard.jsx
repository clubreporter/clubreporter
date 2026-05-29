import { Link } from 'react-router-dom';
import { STATUS_LABELS, isGAA, formatGAAScore, SPORT_LABELS } from '../lib/sportConfig';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';

export default function MatchCard({ match }) {
  const gaa = isGAA(match.sport);
  const isLive = ['live', 'half_time', 'extra_time', 'penalties'].includes(match.status);

  return (
    <Link to={ROUTES.match(match.id)} className="block">
      <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow active:scale-[0.98] active:bg-muted/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-muted-foreground font-medium">{SPORT_LABELS[match.sport]}{match.competition ? ` · ${match.competition}` : ''}</span>
          <Badge variant={isLive ? 'default' : 'secondary'} className={`text-[10px] ${isLive ? 'bg-red-500 text-white animate-pulse' : ''}`}>
            {STATUS_LABELS[match.status]}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate">{match.homeTeamName}</p>
            <p className="text-base text-muted-foreground truncate">{match.awayTeamName}</p>
          </div>
          {match.status !== 'scheduled' ? (
            gaa ? (
              <div className="text-right font-mono ml-3">
                <p className="font-black text-base">{formatGAAScore(match.homeGoals, match.homePoints)}</p>
                <p className="font-black text-base text-muted-foreground">{formatGAAScore(match.awayGoals, match.awayPoints)}</p>
              </div>
            ) : (
              <div className="text-right ml-3">
                <p className="font-black text-2xl leading-tight">{match.homeGoals || 0}</p>
                <p className="font-black text-2xl leading-tight text-muted-foreground">{match.awayGoals || 0}</p>
              </div>
            )
          ) : (
            <p className="text-xs text-muted-foreground">{match.matchDate ? new Date(match.matchDate).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'TBC'}</p>
          )}
        </div>
        {match.venue && <p className="text-[11px] text-muted-foreground mt-2">📍 {match.venue}</p>}
      </div>
    </Link>
  );
}