import { usePlan } from '../lib/usePlan';
import PastDueBanner from './PastDueBanner';
import BottomNav from './BottomNav';
import { SportBadge } from '@/lib/useSportBrand.jsx';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin } from '@/lib/admin';
import { ROUTES } from '@/lib/routes';
import { ShieldCheck } from 'lucide-react';
import ClubReporterLogo from '@/components/ClubReporterLogo';

export default function Layout() {
  const { isPastDue } = usePlan();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const showAdminLink = isAdmin(user);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-sm safe-top">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <ClubReporterLogo className="h-8 w-auto max-w-[160px]" linkTo={ROUTES.dashboard} />
          <div className="flex items-center gap-2 shrink-0">
            {showAdminLink && (
              <Link
                to={ROUTES.admin}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
                  pathname.startsWith(ROUTES.admin)
                    ? 'bg-white/25 text-white'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            <SportBadge />
          </div>
        </div>
      </header>

      {isPastDue && <PastDueBanner />}

      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full pb-24">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
