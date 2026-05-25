import { usePlan } from '../lib/usePlan';
import PastDueBanner from './PastDueBanner';
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const { isPastDue } = usePlan();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-sm safe-top">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/6a11bfdd862d168224f11e9c/4f6e840a5_3_20260524_183643_0001.png"
            alt="ClubReporter"
            className="h-9 w-9 object-contain rounded-lg shrink-0"
          />
          <span className="font-black text-lg tracking-tight">
            ClubReporter<span className="opacity-90">.ie</span>
          </span>
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
