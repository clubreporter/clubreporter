import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useAuth } from '@/lib/AuthContext';
import { completeOnboarding } from '@/lib/completeOnboarding';
import {
  ONBOARDING_ROUTES,
  ONBOARDING_SPORT_OPTIONS,
} from '@/lib/onboardingConstants';
import { ROUTES } from '@/lib/routes';

function sportLabel(sportId) {
  return ONBOARDING_SPORT_OPTIONS.find((s) => s.id === sportId)?.label || 'All Sports';
}

export default function WelcomeScreen() {
  const { state, backFrom } = useOnboardingFlow();
  const { checkUserAuth } = useAuth();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const completedRef = useRef(false);

  useEffect(() => {
    if (completedRef.current) return;
    if (!state.accountType || !state.planId) return;

    completedRef.current = true;

    (async () => {
      try {
        await checkUserAuth();
        const result = await completeOnboarding(state);
        if (result?.redirecting) return;
        setBusy(false);
      } catch (err) {
        setError(err.message || 'Could not finish setup.');
        setBusy(false);
        completedRef.current = false;
      }
    })();
  }, [state, checkUserAuth]);

  if (!state.accountType || !state.planId) {
    return <Navigate to={ONBOARDING_ROUTES.plan} replace />;
  }

  const isFree = state.planId === 'free';
  const displayName =
    state.accountType === 'media'
      ? state.mediaOutletName || 'Your media outlet'
      : state.clubName || 'Your club';
  const displaySport =
    state.accountType === 'media' ? 'All sports' : sportLabel(state.sport);

  return (
    <OnboardingLayout
      step={6}
      onBack={() => backFrom(ONBOARDING_ROUTES.welcome)}
      footer={null}
    >
      <div className="flex flex-col flex-1 min-h-0 gap-3">
        <div className="text-center shrink-0">
          <h1 className="text-xl font-black text-gray-900">Welcome!</h1>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-bold text-gray-900">{displayName}</span>
            {' · '}
            {displaySport}
          </p>
        </div>

        {busy && (
          <div className="flex justify-center py-4 shrink-0">
            <div className="w-7 h-7 border-4 border-slate-200 border-t-[#1A9E6D] rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center shrink-0">
            {error}
          </p>
        )}

        {!busy && (
          <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
            <Link
              to={ROUTES.matchNew}
              className="flex items-center gap-3 rounded-2xl border-2 border-[#1A9E6D] bg-green-50 p-3 active:scale-[0.98] transition-transform"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A9E6D] text-white font-black">
                1
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-gray-900 text-sm">Create your first match</p>
                <p className="text-xs text-gray-500">Start reporting live</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#1A9E6D] shrink-0" />
            </Link>

            <Link
              to="/teams"
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 active:scale-[0.98] transition-transform"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 font-black">
                2
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-gray-900 text-sm">Add your squad</p>
                <p className="text-xs text-gray-500">Save players for quick entry</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
            </Link>

            <Link
              to={ROUTES.club}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 active:scale-[0.98] transition-transform"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 font-black">
                3
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-gray-900 text-sm">Complete your club profile</p>
                <p className="text-xs text-gray-500">Logo, colours and details</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
            </Link>

            {isFree && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 flex gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">Upgrade for unlimited matches</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Photos, sponsors, push alerts and more from €4.99/month.
                  </p>
                  <Button asChild size="sm" className="mt-2 h-8 text-xs font-bold bg-[#1A9E6D] hover:bg-[#158f63]">
                    <Link to={ROUTES.billing}>View plans</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!busy && (
          <Button asChild className="w-full h-11 font-bold bg-gray-900 hover:bg-gray-800 shrink-0">
            <Link to={ROUTES.dashboard}>Go to dashboard</Link>
          </Button>
        )}
      </div>
    </OnboardingLayout>
  );
}
