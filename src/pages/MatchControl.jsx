import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Eye, FileText, Radio } from 'lucide-react';
import LiveScoreboard from '@/components/LiveScoreboard';
import { ROUTES, publicReportPath } from '@/lib/routes';
import { STATUS_LABELS, isGAA, isRugby } from '@/lib/sportConfig';

export default function MatchControl() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMatch = useCallback(async () => {
    const matches = await entities.Match.filter({ id });
    if (matches.length) setMatch(matches[0]);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

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
    const updated = await entities.Match.update(id, updates);
    setMatch(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-16">
        <p className="font-semibold mb-3">Match not found</p>
        <Link to={ROUTES.matches} className="text-primary font-semibold hover:underline">
          ← Back to matches
        </Link>
      </div>
    );
  }

  const isLive = ['live', 'half_time', 'extra_time', 'penalties'].includes(match.status);

  const statusButtons = [
    { status: 'scheduled', label: 'Scheduled' },
    { status: 'live', label: 'Kick off' },
    { status: 'half_time', label: 'Half time' },
    { status: 'live', label: '2nd half', from: 'half_time' },
    { status: 'full_time', label: 'Full time' },
    { status: 'postponed', label: 'Postponed' },
    { status: 'abandoned', label: 'Abandoned' },
  ];

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.matches}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Matches
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant={isLive ? 'default' : 'secondary'} className={isLive ? 'bg-red-500 mb-2' : 'mb-2'}>
            {isLive && <Radio className="w-3 h-3 mr-1 animate-pulse" />}
            {STATUS_LABELS[match.status]}
          </Badge>
          <h1 className="text-xl font-black leading-tight">
            {match.homeTeamName}
            <span className="text-muted-foreground font-semibold mx-2">vs</span>
            {match.awayTeamName}
          </h1>
          {match.venue && <p className="text-sm text-muted-foreground mt-1">📍 {match.venue}</p>}
        </div>
      </div>

      <LiveScoreboard match={match} showTimer={false} />

      <section className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Match status</p>
        <div className="flex flex-wrap gap-2">
          {statusButtons.map(({ status, label, from }) => {
            if (from && match.status !== from) return null;
            if (!from && status === 'live' && match.status !== 'scheduled' && match.status !== 'half_time') {
              return null;
            }
            if (status === 'scheduled' && match.status !== 'scheduled') return null;
            return (
              <Button
                key={`${status}-${label}`}
                variant={match.status === status && !from ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStatus(status)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3">
        <Link to={ROUTES.matchTimeline(id)}>
          <Button className="w-full h-12 font-bold justify-start" size="lg">
            <Clock className="w-5 h-5 mr-2" />
            Open live timeline
          </Button>
        </Link>
        <Link to={ROUTES.matchReport(id)}>
          <Button variant="outline" className="w-full h-12 font-bold justify-start" size="lg">
            <FileText className="w-5 h-5 mr-2" />
            Match report
          </Button>
        </Link>
        {match.publicId && (
          <Link to={publicReportPath(match.publicId)} target="_blank">
            <Button variant="outline" className="w-full h-12 font-bold justify-start" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Public report page
            </Button>
          </Link>
        )}
      </section>
    </div>
  );
}
