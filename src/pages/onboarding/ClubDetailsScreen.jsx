import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { IRISH_COUNTIES, ONBOARDING_ROUTES, clubCodeForSport } from '@/lib/onboardingConstants';
import { patchOnboardingState } from '@/lib/onboardingStorage';

export default function ClubDetailsScreen() {
  const { state, patch, nextFromClubDetails, backFrom } = useOnboardingFlow();

  if (state.accountType === 'media') {
    return <Navigate to={ONBOARDING_ROUTES.plan} replace />;
  }

  if (!state.sport) {
    return <Navigate to={ONBOARDING_ROUTES.sport} replace />;
  }

  const clubCode = state.clubCode || clubCodeForSport(state.sport);
  const canContinue = Boolean(state.clubName?.trim() && state.county);

  return (
    <OnboardingLayout
      step={3}
      onBack={() => backFrom(ONBOARDING_ROUTES.clubDetails)}
      footer={
        <Button
          className="w-full h-12 font-bold bg-[#1A9E6D] hover:bg-[#158f63] text-white"
          disabled={!canContinue}
          onClick={() => {
            patchOnboardingState({
              clubName: state.clubName,
              county: state.county,
              clubCode,
            });
            nextFromClubDetails();
          }}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col justify-center flex-1 min-h-0 gap-4">
        <div className="text-center shrink-0">
          <h1 className="text-xl font-black text-gray-900">Club details</h1>
          <p className="text-sm text-gray-500 mt-1">Tell us about your club</p>
        </div>
        <div className="space-y-3 shrink-0">
          <div>
            <Label className="text-sm font-semibold text-gray-800">Club name *</Label>
            <Input
              value={state.clubName}
              onChange={(e) => patch({ clubName: e.target.value })}
              placeholder="e.g. St Mary's GAA"
              className="mt-1 h-11 bg-white"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-800">County *</Label>
            <select
              value={state.county}
              onChange={(e) => patch({ county: e.target.value })}
              className="mt-1 w-full h-11 rounded-md border border-input bg-white px-3 text-sm"
            >
              <option value="">Select county</option>
              {IRISH_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-800">Club code</Label>
            <Input
              value={clubCode}
              readOnly
              className="mt-1 h-11 bg-gray-50 text-gray-700"
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
