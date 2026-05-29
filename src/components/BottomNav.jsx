import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, Users, Shield, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin } from '@/lib/admin';

const BASE_TABS = [
  { to: ROUTES.dashboard, icon: Home, label: 'Clubhouse', match: (path) => path === ROUTES.dashboard },
  { to: '/fixtures', icon: Calendar, label: 'Fixtures', match: (path) => path === '/fixtures' },
  {
    to: ROUTES.matches,
    icon: PlusCircle,
    label: 'Matchday',
    match: (path) =>
      path === ROUTES.matches ||
      path === ROUTES.matchNew ||
      path.startsWith('/matches/'),
  },
  { to: '/teams', icon: Users, label: 'Squad', match: (path) => path === '/teams' },
  { to: '/club', icon: Shield, label: 'My Club', match: (path) => path === '/club' },
  { to: '/billing', icon: CreditCard, label: 'Membership', match: (path) => path === '/billing' },
];

const ADMIN_TAB = {
  to: ROUTES.admin,
  icon: ShieldCheck,
  label: 'Admin',
  match: (path) => path === ROUTES.admin || path.startsWith(`${ROUTES.admin}/`),
};

export default function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const tabs = isAdmin(user) ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;
  const cols = tabs.length;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 safe-bottom"
      aria-label="Main navigation"
    >
      <div
        className="max-w-lg mx-auto grid px-0.5 pt-1.5 pb-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {tabs.map(({ to, icon: Icon, label, match }) => {
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
