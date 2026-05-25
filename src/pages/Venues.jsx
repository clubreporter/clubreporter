import { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entities.Venue.list('-created_date').then(v => { setVenues(v); setLoading(false); });
  }, []);

  const addVenue = async () => {
    if (!name.trim()) return;
    const venue = await entities.Venue.create({ name: name.trim() });
    setVenues(prev => [venue, ...prev]);
    setName('');
  };

  const deleteVenue = async (id) => {
    await entities.Venue.delete(id);
    setVenues(prev => prev.filter(v => v.id !== id));
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Venues</h2>
      <div className="flex gap-2">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Add venue name" className="text-base" onKeyDown={e => e.key === 'Enter' && addVenue()} />
        <Button onClick={addVenue} size="icon"><Plus className="w-4 h-4" /></Button>
      </div>
      <div className="space-y-2">
        {venues.map(v => (
          <div key={v.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
            <span className="font-medium text-sm">{v.name}</span>
            <button onClick={() => deleteVenue(v.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {venues.length === 0 && <p className="text-muted-foreground text-center py-6 text-sm">Save venues for quick reuse</p>}
      </div>
    </div>
  );
}