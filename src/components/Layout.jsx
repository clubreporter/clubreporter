import { usePlan } from '../lib/usePlan';
import PastDueBanner from './PastDueBanner';
import BottomNav from './BottomNav';
import { SportBadge } from '@/lib/useSportBrand.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const { isPastDue } = usePlan();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-sm safe-top">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0 font-black text-sm">
              CR
            </div>
            <span className="font-black text-lg tracking-tight truncate">
              ClubReporter<span className="opacity-90">.ie</span>
            </span>
          </div>
          <SportBadge />
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
