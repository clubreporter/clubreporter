import { Button } from '@/components/ui/button';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { ACCOUNT_TYPE_CARDS, ONBOARDING_ROUTES } from '@/lib/onboardingConstants';

export default function AccountTypeScreen() {
  const { state, setAccountType, nextFromAccountType, backFrom } = useOnboardingFlow();

  return (
    <OnboardingLayout
      step={1}
      showBack={false}
      onBack={() => backFrom(ONBOARDING_ROUTES.accountType)}
      footer={
        <Button
          className="w-full h-12 font-bold bg-[#1A9E6D] hover:bg-[#158f63] text-white"
          disabled={!state.accountType}
          onClick={nextFromAccountType}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col justify-center flex-1 min-h-0 gap-4">
        <div className="text-center shrink-0">
          <h1 className="text-xl font-black text-gray-900">Choose account type</h1>
          <p className="text-sm text-gray-500 mt-1">How will you use ClubReporter?</p>
        </div>
        <div className="grid gap-3 shrink-0">
          {ACCOUNT_TYPE_CARDS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAccountType(opt.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                state.accountType === opt.id
                  ? 'border-[#1A9E6D] bg-green-50 shadow-sm'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <p className="text-2xl mb-1">{opt.emoji}</p>
              <p className="font-bold text-gray-900">{opt.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
