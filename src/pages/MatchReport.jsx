import { useState, useEffect, useRef } from 'react';
import { usePlan } from '../lib/usePlan';
import { useAuth } from '@/lib/AuthContext';
import ReportSourceBadge from '@/components/ReportSourceBadge';
import { LockedButton } from '../components/UpgradeModal';
import { useParams, Link } from 'react-router-dom';
import { entities } from '@/api/entities';
import { Core } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { isGAA, formatGAAScore, SPORT_LABELS, STATUS_LABELS, buildReportPrompt } from '../lib/sportConfig';
import jsPDF from 'jspdf';
import { ROUTES, publicReportUrl } from '@/lib/routes';

export default function MatchReport() {
  const { id, matchId: legacyMatchId } = useParams();
  const matchId = id || legacyMatchId;
  const [match, setMatch] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [summarising, setSummarising] = useState(false);
  const reportRef = useRef(null);
  const { isPremium } = usePlan();
  const { user } = useAuth();
  const [club, setClub] = useState(null);

  useEffect(() => {
    entities.Club.list().then((clubs) => setClub(clubs[0] || null));
  }, []);

  useEffect(() => {
    Promise.all([
      entities.Match.filter({ id: matchId }),
      entities.MatchIncident.filter({ matchId }, 'created_date', 200),
    ]).then(([matches, inc]) => {
      if (matches.length) setMatch(matches[0]);
      setIncidents(inc);
      setLoading(false);
    });
  }, [matchId]);

  const publicUrl = match?.publicId ? publicReportUrl(match.publicId) : null;

  const shareText = match
    ? `${match.homeTeamName} vs ${match.awayTeamName} — Live match report`
    : '';

  const copyLink = async () => {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!publicUrl) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + publicUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    if (!publicUrl) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(publicUrl)}`, '_blank');
  };

  const summariseReport = async () => {
    if (!match) return;
    setSummarising(true);
    const prompt = buildReportPrompt(match, incidents);
    const summary = await Core.InvokeLLM({ prompt, sport: match.sport });
    await entities.Match.update(matchId, { reportDraft: summary });
    setMatch(m => ({ ...m, reportDraft: summary }));
    setSummarising(false);
  };

  const shareFacebook = () => {
    if (!publicUrl) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, '_blank');
  };

  const downloadPDF = () => {
    if (!match) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const gaa = isGAA(match.sport);
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Match Report', 105, y, { align: 'center' });
    y += 10;

    // Sport / Competition
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const subTitle = [SPORT_LABELS[match.sport], match.competition, match.category].filter(Boolean).join(' · ');
    doc.text(subTitle, 105, y, { align: 'center' });
    y += 8;

    // Date / Venue
    const dateLine = [
      match.matchDate ? new Date(match.matchDate).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null,
      match.venue,
    ].filter(Boolean).join(' — ');
    if (dateLine) { doc.text(dateLine, 105, y, { align: 'center' }); y += 8; }

    // Score
    y += 4;
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    const homeScore = gaa ? formatGAAScore(match.homeGoals, match.homePoints) : String(match.homeGoals || 0);
    const awayScore = gaa ? formatGAAScore(match.awayGoals, match.awayPoints) : String(match.awayGoals || 0);
    doc.text(`${match.homeTeamName}  ${homeScore}  –  ${awayScore}  ${match.awayTeamName}`, 105, y, { align: 'center' });
    y += 8;

    if (match.halfTimeHome) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Half Time: ${match.halfTimeHome} – ${match.halfTimeAway}`, 105, y, { align: 'center' });
      y += 6;
    }

    // Status
    doc.setFontSize(10);
    doc.text(`Status: ${STATUS_LABELS[match.status]}`, 105, y, { align: 'center' });
    y += 10;

    // Divider
    doc.setDrawColor(200);
    doc.line(15, y, 195, y);
    y += 8;

    // Report text
    if (match.reportDraft) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Match Report', 15, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(match.reportDraft, 180);
      doc.text(lines, 15, y);
      y += lines.length * 5 + 8;
    }

    // Timeline
    const mainEvents = incidents.filter(i => i.type !== 'admin_note');
    if (mainEvents.length) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Timeline', 15, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      mainEvents.forEach(inc => {
        if (y > 275) { doc.addPage(); y = 20; }
        const line = `${inc.minute}'  ${inc.details || inc.type}`;
        const wrapped = doc.splitTextToSize(line, 180);
        doc.text(wrapped, 15, y);
        y += wrapped.length * 4.5 + 1;
      });
    }

    // Player of the match
    if (match.playerOfMatch) {
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Player of the Match: ${match.playerOfMatch}`, 15, y);
    }

    doc.save(`${match.homeTeamName}_vs_${match.awayTeamName}_report.pdf`);
  };

  if (loading || !match) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const gaa = isGAA(match.sport);
  const homeScore = gaa ? formatGAAScore(match.homeGoals, match.homePoints) : String(match.homeGoals || 0);
  const awayScore = gaa ? formatGAAScore(match.awayGoals, match.awayPoints) : String(match.awayGoals || 0);
  const mainEvents = incidents.filter(i => i.type !== 'admin_note');
  const publisher = {
    profileType: user?.profileType,
    clubVerificationStatus: club?.verificationStatus,
    mediaOutletName: user?.mediaOutletName,
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to={ROUTES.matchTimeline(matchId)}>
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <h1 className="font-bold text-lg">Match Report</h1>
      </div>

      {/* Report preview card */}
      <div ref={reportRef} className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex justify-center">
          <ReportSourceBadge publisher={publisher} size="sm" />
        </div>
        {/* Meta */}
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground font-medium">
            {[SPORT_LABELS[match.sport], match.competition, match.category].filter(Boolean).join(' · ')}
          </p>
          {match.matchDate && (
            <p className="text-xs text-muted-foreground">
              {new Date(match.matchDate).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          {match.venue && <p className="text-xs text-muted-foreground">📍 {match.venue}</p>}
        </div>

        {/* Score */}
        <div className="text-center py-2">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 text-right">
              <p className="font-black text-base leading-tight">{match.homeTeamName}</p>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-black text-3xl tabular-nums">{homeScore}</span>
              <span className="text-muted-foreground font-bold text-lg">–</span>
              <span className="font-black text-3xl tabular-nums">{awayScore}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-black text-base leading-tight">{match.awayTeamName}</p>
            </div>
          </div>
          {match.halfTimeHome && (
            <p className="text-xs text-muted-foreground mt-1">HT: {match.halfTimeHome} – {match.halfTimeAway}</p>
          )}
          <Badge variant="secondary" className="mt-2 text-[10px]">{STATUS_LABELS[match.status]}</Badge>
        </div>

        {/* Report text */}
        {match.reportDraft && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Report</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{match.reportDraft}</p>
          </div>
        )}

        {/* Player of match */}
        {match.playerOfMatch && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-amber-700 font-semibold">⭐ Player of the Match</p>
            <p className="font-black text-sm text-amber-900">{match.playerOfMatch}</p>
          </div>
        )}

        {/* Timeline */}
        {mainEvents.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Timeline</p>
            <div className="space-y-2">
              {mainEvents.map(inc => (
                <div key={inc.id} className="flex gap-3 text-xs">
                  <span className="font-mono font-bold text-muted-foreground w-8 shrink-0 pt-0.5">{inc.minute}'</span>
                  <p className="text-foreground leading-relaxed">{inc.details || inc.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isPremium ? (
          <Button onClick={summariseReport} disabled={summarising} variant="outline" className="w-full font-bold border-primary text-primary hover:bg-primary/5" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            {summarising ? 'Generating summary…' : 'Summarise with AI'}
          </Button>
        ) : (
          <LockedButton requiredPlan="premium" label="Premium: AI Report">
            <Button variant="outline" className="w-full font-bold" size="lg">
              <Sparkles className="w-4 h-4 mr-2" /> Summarise with AI
            </Button>
          </LockedButton>
        )}

        <Button onClick={downloadPDF} className="w-full font-bold" size="lg">
          <Download className="w-4 h-4 mr-2" /> Download PDF Report
        </Button>

        {publicUrl && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Share Live Link
            </p>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground truncate flex-1">{publicUrl}</p>
              <button onClick={copyLink} className="shrink-0 text-primary">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shareWhatsApp} className="font-semibold text-sm">
                📱 WhatsApp
              </Button>
              <Button variant="outline" onClick={shareTwitter} className="font-semibold text-sm">
                🐦 Twitter / X
              </Button>
              <Button variant="outline" onClick={shareFacebook} className="col-span-2 font-semibold text-sm">
                📘 Facebook
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}