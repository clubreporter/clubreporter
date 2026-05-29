import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePlan } from '@/lib/usePlan';
import { useAuth } from '@/lib/AuthContext';
import { LockedButton } from '@/components/UpgradeModal';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import ClubSwitcher, { getActiveClubId } from '@/components/ClubSwitcher';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Radio } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import { ROUTES } from '@/lib/routes';

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeClubId, setActiveClubId] = useState(getActiveClubId);
  const { hasAny } = usePlan();

  const isMedia =
    user?.profileType === 'media' ||
    user?.subscriptionPlan === 'presspass' ||
    user?.subscriptionPlan === 'media';

  const fetchData = useCallback(async () => {
    try {
      const matchList = await entities.Match.list('-created_date', 50);
      setMatches(matchList);
    } catch (err) {
      console.error('Matches load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshing = usePullToRefresh(fetchData);

  const visibleMatches =
    isMedia && activeClubId
      ? matches.filter((m) => m.clubId === activeClubId)
      : matches;

  const live = visibleMatches.filter((m) =>
    ['live', 'half_time', 'extra_time', 'penalties'].includes(m.status)
  );
  const upcoming = visibleMatches.filter((m) => m.status === 'scheduled');
  const recent = visibleMatches.filter((m) =>
    ['full_time', 'abandoned', 'postponed'].includes(m.status)
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black">Matches</h1>
          <p className="text-sm text-muted-foreground">Live, upcoming and recent fixtures</p>
        </div>
      </div>

      {isMedia && <ClubSwitcher onClubChange={(c) => setActiveClubId(c?.id)} />}

      {refreshing && (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {hasAny ? (
        <Link to={ROUTES.matchNew}>
          <Button className="w-full py-6 text-base font-bold rounded-xl" size="lg">
            <Plus className="w-5 h-5 mr-2" /> New match
          </Button>
        </Link>
      ) : (
        <LockedButton requiredPlan="basic" label="Subscription Required">
          <Button className="w-full py-6 text-base font-bold rounded-xl" size="lg">
            <Plus className="w-5 h-5 mr-2" /> New match
          </Button>
        </LockedButton>
      )}

      {live.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <h2 className="font-bold text-base">Live now</h2>
          </div>
          <div className="space-y-3">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-bold text-base mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <h2 className="font-bold text-base mb-3">Recent results</h2>
          <div className="space-y-3">
            {recent.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {visibleMatches.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">⚽</div>
          <p className="text-lg font-semibold mb-1">No matches yet</p>
          <p className="text-sm">Create your first fixture to get started</p>
        </div>
      )}
    </div>
  );
}
