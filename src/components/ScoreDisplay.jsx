import { isGAA, formatGAAScore } from '../lib/sportConfig';

export default function ScoreDisplay({ match, size = 'lg' }) {
  const gaa = isGAA(match.sport);
  const big = size === 'lg';

  if (gaa) {
    const hs = formatGAAScore(match.homeGoals, match.homePoints);
    const as_ = formatGAAScore(match.awayGoals, match.awayPoints);
    return (
      <div className="text-center">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 text-right">
            <p className={`${big ? 'text-sm' : 'text-xs'} font-semibold truncate mb-1`}>{match.homeTeamName}</p>
            <p className={`${big ? 'text-2xl' : 'text-lg'} font-black font-mono`}>{hs}</p>
          </div>
          <span className="text-muted-foreground text-xs font-medium">v</span>
          <div className="flex-1 text-left">
            <p className={`${big ? 'text-sm' : 'text-xs'} font-semibold truncate mb-1`}>{match.awayTeamName}</p>
            <p className={`${big ? 'text-2xl' : 'text-lg'} font-black font-mono`}>{as_}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 text-right">
          <p className={`${big ? 'text-sm' : 'text-xs'} font-semibold truncate mb-1`}>{match.homeTeamName}</p>
          <p className={`${big ? 'text-4xl' : 'text-2xl'} font-black`}>{match.homeGoals || 0}</p>
        </div>
        <span className="text-muted-foreground text-xs font-medium">v</span>
        <div className="flex-1 text-left">
          <p className={`${big ? 'text-sm' : 'text-xs'} font-semibold truncate mb-1`}>{match.awayTeamName}</p>
          <p className={`${big ? 'text-4xl' : 'text-2xl'} font-black`}>{match.awayGoals || 0}</p>
        </div>
      </div>
    </div>
  );
}