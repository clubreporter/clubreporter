import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { entities } from '@/api/entities';
import { getPublicMatchPublisher } from '@/api/clubVerification';
import { publicReportPath } from '@/lib/routes';
import ScoreDisplay from '../components/ScoreDisplay';
import Timeline from '../components/Timeline';
import ReportSourceBadge from '../components/ReportSourceBadge';
import { STATUS_LABELS, SPORT_LABELS } from '../lib/sportConfig';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicMatch() {
  const { slug, publicId: legacyPublicId } = useParams();
  const publicId = slug || legacyPublicId;
  const [match, setMatch] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMatch = async () => {
    const matches = await entities.Match.filter({ publicId });
    if (matches.length) {
      const m = matches[0];
      setMatch(m);
      const inc = await entities.MatchIncident.filter({ matchId: m.id }, 'created_date', 100);
      setIncidents(inc);
      getPublicMatchPublisher(publicId).then(setPublisher).catch(() => setPublisher(null));
      // Load other upcoming fixtures from same publisher
      const allMatches = await entities.Match.filter({ created_by: m.created_by }, '-matchDate', 20);
      const others = allMatches.filter(x => x.id !== m.id && ['scheduled', 'live'].includes(x.status));
      setUpcomingFixtures(others.slice(0, 5));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMatch();
    const interval = setInterval(loadMatch, 300000);
    return () => clearInterval(interval);
  }, [publicId]);

  const shareUrl = window.location.href;
  const copyLink = () => { navigator.clipboard.writeText(shareUrl); toast.success('Link copied!'); };
  const shareWhatsApp = () => {
    if (!match) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${match.homeTeamName} v ${match.awayTeamName} – Live Updates: ${shareUrl}`)}`);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  if (!match) return <div className="text-center py-16 text-muted-foreground">Match not found</div>;

  const isLive = ['live', 'half_time', 'extra_time', 'penalties'].includes(match.status);

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto px-4 py-6 space-y-5">
      {publisher && (
        <div className="flex justify-center pt-1">
          <ReportSourceBadge publisher={publisher} />
        </div>
      )}

      <div className="text-center space-y-1">
        <Badge variant={isLive ? 'default' : 'secondary'} className={`${isLive ? 'bg-red-500 text-white animate-pulse' : ''}`}>
          {STATUS_LABELS[match.status]}
        </Badge>
        {match.currentMinute && isLive && (
          <p className="font-mono font-black text-lg">{match.currentMinute}&apos;</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <p className="text-[11px] text-center text-muted-foreground mb-3 uppercase tracking-wider font-medium">
          {SPORT_LABELS[match.sport]}{match.competition ? ` · ${match.competition}` : ''}
        </p>
        <ScoreDisplay match={match} size="lg" />
        {match.halfTimeHome && (
          <p className="text-xs text-center text-muted-foreground mt-3">HT: {match.halfTimeHome} – {match.halfTimeAway}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground justify-center">
        {match.venue && <span>📍 {match.venue}</span>}
        {match.referee && <span>🏁 {match.referee}</span>}
        {match.weather && <span>🌤 {match.weather}</span>}
        {match.attendance && <span>👥 {match.attendance}</span>}
      </div>

      {(match.sponsorName || match.sponsorLogo) && (
        <div className="text-center">
          {match.sponsorLogo ? (
            <a href={match.sponsorLink || '#'} target="_blank" rel="noopener noreferrer"
              className="inline-block">
              <img src={match.sponsorLogo} alt={match.sponsorName || 'Sponsor'}
                className="h-12 object-contain mx-auto" />
              {match.sponsorName && <p className="text-[11px] text-muted-foreground mt-1">Sponsored by <strong>{match.sponsorName}</strong></p>}
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">
              Sponsored by{' '}
              {match.sponsorLink
                ? <a href={match.sponsorLink} target="_blank" rel="noopener noreferrer" className="font-bold underline">{match.sponsorName}</a>
                : <strong>{match.sponsorName}</strong>}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-center">
        <button onClick={shareWhatsApp} className="flex items-center gap-1.5 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform touch-manipulation">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
        <button onClick={copyLink} className="flex items-center gap-1.5 bg-muted text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform touch-manipulation">
          <Copy className="w-4 h-4" /> Copy Link
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-bold mb-3 text-sm">Match Timeline</h3>
        <Timeline incidents={incidents} />
      </div>

      {match.reportPublished && match.reportDraft && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <ReportSourceBadge publisher={publisher} size="sm" />
          <h3 className="font-bold text-sm">Match Report</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{match.reportDraft}</p>
        </div>
      )}

      {upcomingFixtures.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold mb-3 text-sm">Other Upcoming Fixtures</h3>
          <div className="space-y-2">
            {upcomingFixtures.map(f => (
              <a key={f.id} href={publicReportPath(f.publicId)}
                className="flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{f.homeTeamName} v {f.awayTeamName}</p>
                  {f.matchDate && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(f.matchDate).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  {f.competition && <p className="text-xs text-muted-foreground">{f.competition}</p>}
                </div>
                {['live', 'half_time'].includes(f.status) && (
                  <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-muted-foreground pt-4 pb-2">
        Powered by <strong className="text-foreground">ClubReporter</strong>
      </p>
    </div>
  );
}