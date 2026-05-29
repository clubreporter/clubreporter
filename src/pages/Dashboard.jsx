import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { usePlan } from '../lib/usePlan';
import { useAuth } from '@/lib/AuthContext';
import { LockedButton } from '../components/UpgradeModal';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import ClubSwitcher, { getActiveClubId } from '../components/ClubSwitcher';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Radio, Users, Calendar, Trophy, Building2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import MatchCard from '../components/MatchCard';
import { applyClubColours } from '../lib/clubColours';
import { SportBadge } from '@/lib/useSportBrand.jsx';
import { ClubVerificationBanner } from '@/components/club/ClubVerificationForm';
import { isAdmin } from '@/lib/admin';
import { ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const [club, setClub] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeClubId, setActiveClubId] = useState(getActiveClubId);
  const { hasAny } = usePlan();

  const isMedia = user?.profileType === 'media' || user?.subscriptionPlan === 'presspass' || user?.subscriptionPlan === 'media';

  const fetchData = useCallback(async () => {
    try {
      const [matchList, clubs, players] = await Promise.all([
        entities.Match.list('-created_date', 30),
        entities.Club.list(),
        entities.Player.list(),
      ]);
      setMatches(matchList);
      setPlayerCount(players.length);
      const primaryClub = clubs[0] ?? null;
      setClub(primaryClub);
      if (primaryClub?.primaryColour) {
        applyClubColours(primaryClub.primaryColour, primaryClub.secondaryColour, primaryClub.accentColour);
      }
    } catch (err) {
      console.error('Clubhouse load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (location.state?.flashError) {
      toast.error(location.state.flashError);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  const refreshing = usePullToRefresh(fetchData);

  const live = matches.filter(m => ['live', 'half_time', 'extra_time', 'penalties'].includes(m.status));
  const upcoming = matches.filter(m => m.status === 'scheduled');
  const recent = matches.filter(m => ['full_time', 'abandoned', 'postponed'].includes(m.status));

  const visibleMatches =
    isMedia && activeClubId
      ? matches.filter(m => m.clubId === activeClubId)
      : matches;

  const visibleLive = visibleMatches.filter(m => ['live', 'half_time', 'extra_time', 'penalties'].includes(m.status));
  const visibleUpcoming = visibleMatches.filter(m => m.status === 'scheduled');
  const visibleRecent = visibleMatches.filter(m => ['full_time', 'abandoned', 'postponed'].includes(m.status));

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = club?.name || user?.mediaOutletName || 'ClubReporter';
  const greeting = user?.profileType === 'media' ? 'Press Pass' : club?.county ? `${club.county}` : 'Your Clubhouse';

  return (
    <div className="space-y-6">
      <ClubVerificationBanner club={club} profileType={user?.profileType} />

      {isAdmin(user) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
            <p className="text-sm font-semibold text-amber-950 truncate">Platform admin</p>
          </div>
          <Link to={ROUTES.admin}>
            <Button size="sm" className="font-bold shrink-0">Open Admin Panel</Button>
          </Link>
        </div>
      )}

      {/* Club header */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {club?.logo ? (
              <img src={club.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-7 h-7 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{greeting}</p>
              <SportBadge />
            </div>
            <h1 className="text-xl font-black truncate">{displayName}</h1>
            {!club && user?.profileType !== 'media' && (
              <Link to="/club" className="text-xs text-primary font-semibold hover:underline">
                Set up your club profile →
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-border divide-x divide-border">
          {[
            { icon: Radio, label: 'Live', value: visibleLive.length, highlight: visibleLive.length > 0 },
            { icon: Calendar, label: 'Upcoming', value: visibleUpcoming.length },
            { icon: Trophy, label: 'Results', value: visibleRecent.length },
            { icon: Users, label: 'Squad', value: playerCount },
          ].map(({ icon: Icon, label, value, highlight }) => (
            <div key={label} className="py-3 px-2 text-center">
              <Icon className={`w-4 h-4 mx-auto mb-1 ${highlight ? 'text-red-500' : 'text-muted-foreground'}`} />
              <p className={`text-lg font-black tabular-nums ${highlight ? 'text-red-600' : ''}`}>{value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {isMedia && (
        <ClubSwitcher onClubChange={(c) => setActiveClubId(c?.id)} />
      )}

      {refreshing && (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {hasAny ? (
        <Link to={ROUTES.matchNew}>
          <Button
            className="w-full py-6 text-base font-bold rounded-xl shadow-md text-white border-0"
            style={{
              background: 'repeating-linear-gradient(90deg, #166534 0px, #166534 28px, #15803d 28px, #15803d 56px)',
              boxShadow: '0 4px 14px rgba(21,128,61,0.5)',
            }}
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" /> Create Match
          </Button>
        </Link>
      ) : (
        <LockedButton requiredPlan="basic" label="Subscription Required">
          <Button className="w-full py-6 text-base font-bold rounded-xl" size="lg">
            <Plus className="w-5 h-5 mr-2" /> Create Match
          </Button>
        </LockedButton>
      )}

      {visibleLive.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <h2 className="font-bold text-base">Live Now</h2>
          </div>
          <div className="space-y-3">{visibleLive.map(m => <MatchCard key={m.id} match={m} />)}</div>
        </section>
      )}

      {visibleUpcoming.length > 0 && (
        <section>
          <h2 className="font-bold text-base mb-3">Upcoming</h2>
          <div className="space-y-3">{visibleUpcoming.map(m => <MatchCard key={m.id} match={m} />)}</div>
        </section>
      )}

      {visibleRecent.length > 0 && (
        <section>
          <h2 className="font-bold text-base mb-3">Recent Results</h2>
          <div className="space-y-3">{visibleRecent.map(m => <MatchCard key={m.id} match={m} />)}</div>
        </section>
      )}

      {visibleMatches.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">⚽</div>
          <p className="text-lg font-semibold mb-1">No matches yet</p>
          <p className="text-sm mb-4">Create your first fixture to get started</p>
          {!club && (
            <Link to="/club" className="text-sm text-primary font-semibold hover:underline">
              Add your club profile first
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
