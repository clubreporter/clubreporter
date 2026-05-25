import { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { ChevronDown, Plus, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTIVE_CLUB_KEY = 'cr_active_club_id';

export function getActiveClubId() {
  return localStorage.getItem(ACTIVE_CLUB_KEY) || null;
}

export function setActiveClubId(id) {
  localStorage.setItem(ACTIVE_CLUB_KEY, id);
}

export default function ClubSwitcher({ onClubChange }) {
  const [clubs, setClubs] = useState([]);
  const [activeClub, setActiveClub] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    entities.Club.list().then(all => {
      setClubs(all);
      const savedId = getActiveClubId();
      const found = all.find(c => c.id === savedId) || all[0] || null;
      setActiveClub(found);
      if (found) {
        setActiveClubId(found.id);
        onClubChange?.(found);
      }
    });
  }, []);

  const select = (club) => {
    setActiveClub(club);
    setActiveClubId(club.id);
    onClubChange?.(club);
    setOpen(false);
  };

  if (clubs.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 text-left hover:bg-accent transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {activeClub?.logo
            ? <img src={activeClub.logo} alt="" className="w-full h-full object-cover" />
            : <Building2 className="w-4 h-4 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">Active Club</p>
          <p className="font-bold text-sm truncate">{activeClub?.name || 'Select club…'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto divide-y divide-border">
            {clubs.map(c => (
              <button key={c.id} onClick={() => select(c)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors ${activeClub?.id === c.id ? 'bg-primary/5' : ''}`}>
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {c.logo ? <img src={c.logo} alt="" className="w-full h-full object-cover" /> : <Building2 className="w-3.5 h-3.5 text-primary" />}
                </div>
                <span className="text-sm font-medium truncate flex-1">{c.name}</span>
                {activeClub?.id === c.id && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setOpen(false); navigate('/club'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors border-t border-border text-primary font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Add New Club Profile
          </button>
        </div>
      )}
    </div>
  );
}