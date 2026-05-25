import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, Users, Shield, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { to: '/dashboard', icon: Home, label: 'Clubhouse', match: (path) => path === '/dashboard' },
  { to: '/fixtures', icon: Calendar, label: 'Fixtures', match: (path) => path === '/fixtures' },
  {
    to: '/create-match',
    icon: PlusCircle,
    label: 'Matchday',
    match: (path) => path === '/create-match' || path.startsWith('/match/'),
  },
  { to: '/teams', icon: Users, label: 'Squad', match: (path) => path === '/teams' },
  { to: '/club', icon: Shield, label: 'My Club', match: (path) => path === '/club' },
  { to: '/billing', icon: CreditCard, label: 'Membership', match: (path) => path === '/billing' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 safe-bottom"
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto grid grid-cols-6 px-0.5 pt-1.5 pb-2">
        {TABS.map(({ to, icon: Icon, label, match }) => {
          const active = match(pathname);
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-h-[52px] rounded-lg px-0.5 py-1 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-full p-1.5 transition-colors',
                  active && 'bg-primary/15'
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} aria-hidden />
              </span>
              <span className={cn('text-[9px] font-semibold leading-tight text-center', active && 'text-primary')}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
