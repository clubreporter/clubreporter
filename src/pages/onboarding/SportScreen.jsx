import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { ONBOARDING_ROUTES, ONBOARDING_SPORT_OPTIONS } from '@/lib/onboardingConstants';

export default function SportScreen() {
  const { state, setSport, nextFromSport, backFrom } = useOnboardingFlow();

  if (state.accountType === 'media') {
    return <Navigate to={ONBOARDING_ROUTES.plan} replace />;
  }

  if (!state.accountType) {
    return <Navigate to={ONBOARDING_ROUTES.accountType} replace />;
  }

  return (
    <OnboardingLayout
      step={2}
      onBack={() => backFrom(ONBOARDING_ROUTES.sport)}
      footer={
        <Button
          className="w-full h-12 font-bold bg-[#1A9E6D] hover:bg-[#158f63] text-white"
          disabled={!state.sport}
          onClick={nextFromSport}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col justify-center flex-1 min-h-0 gap-4">
        <div className="text-center shrink-0">
          <h1 className="text-xl font-black text-gray-900">Choose your sport</h1>
          <p className="text-sm text-gray-500 mt-1">Pick your primary sport</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 shrink-0">
          {ONBOARDING_SPORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSport(opt.id)}
              className={`rounded-2xl border-2 p-3 text-center transition-all active:scale-[0.98] ${
                state.sport === opt.id ? 'border-[#1A9E6D] bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <span className="text-2xl block mb-1">{opt.icon}</span>
              <span className="font-bold text-sm text-gray-900">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
