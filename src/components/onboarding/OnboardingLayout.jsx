import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TOTAL_ONBOARDING_STEPS } from '@/lib/onboardingConstants';

export default function OnboardingLayout({
  step,
  showBack = true,
  onBack,
  children,
  footer,
}) {
  const progress = (step / TOTAL_ONBOARDING_STEPS) * 100;

  return (
    <div className="h-[100dvh] max-h-[100dvh] flex flex-col bg-gradient-to-b from-[#e8f2f0] to-white overflow-hidden">
      <header className="shrink-0 px-4 pt-3 pb-2 safe-top">
        <div className="flex items-center justify-between gap-2 mb-3">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-0.5 text-sm font-semibold text-gray-600 min-h-[44px] -ml-1 px-1"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <span className="w-16" />
          )}
          <Link to="/" className="font-black text-gray-900 text-lg">
            ClubReporter<span className="text-[#1A9E6D]">.ie</span>
          </Link>
          <span className="w-16" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span>Step {step} of {TOTAL_ONBOARDING_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1A9E6D] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 px-4 py-2 overflow-hidden flex flex-col">
        {children}
      </main>

      {footer && (
        <footer className="shrink-0 px-4 pb-4 pt-2 safe-bottom">
          {footer}
        </footer>
      )}
    </div>
  );
}
