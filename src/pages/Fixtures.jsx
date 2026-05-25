import { useState, useEffect, useCallback } from 'react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { entities } from '@/api/entities';
import MatchCard from '../components/MatchCard';

export default function Fixtures() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    const m = await entities.Match.list('-created_date', 50);
    setMatches(m);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);
  const refreshing = usePullToRefresh(fetchMatches);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{"Fixtures & Results"}</h2>
      {refreshing && <div className="flex justify-center py-2"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}
      {matches.length === 0 && <p className="text-muted-foreground text-center py-8">No matches yet</p>}
      <div className="space-y-3">{matches.map(m => <MatchCard key={m.id} match={m} />)}</div>
    </div>
  );
}