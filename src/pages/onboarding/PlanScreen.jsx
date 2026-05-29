import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import PressPassVerificationDialog from '@/components/onboarding/PressPassVerificationDialog';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useAuth } from '@/lib/AuthContext';
import { ONBOARDING_ROUTES } from '@/lib/onboardingConstants';
import { patchOnboardingState } from '@/lib/onboardingStorage';
import {
  ONBOARDING_PLAN_CARDS,
  annualSavingsPercent,
  formatPlanPrice,
  onboardingPlansForAccount,
} from '@/lib/onboardingPlans';

export default function PlanScreen() {
  const { state, patch, nextFromPlan, backFrom } = useOnboardingFlow();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  if (!state.accountType) {
    return <Navigate to={ONBOARDING_ROUTES.accountType} replace />;
  }

  const plans = onboardingPlansForAccount(state.accountType);
  const billingPeriod = state.billingPeriod || 'month';
  const maxSaving = Math.max(
    ...ONBOARDING_PLAN_CARDS.filter((p) => p.month > 0).map((p) => annualSavingsPercent(p.month, p.year))
  );

  const proceedAfterPlan = (planId) => {
    patchOnboardingState({ planId, plan: planId });

    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    const emailVerified = user?.emailVerified !== false;
    nextFromPlan(emailVerified);
  };

  const handlePlanSelect = (plan) => {
    patchOnboardingState({ planId: plan.id, plan: plan.id });

    if (plan.ctaAction === 'apply') {
      setPendingPlan(plan.id);
      setVerifyOpen(true);
      return;
    }

    proceedAfterPlan(plan.id);
  };

  const handleVerificationSubmit = () => {
    setVerifyOpen(false);
    proceedAfterPlan(pendingPlan || 'presspass');
  };

  return (
    <>
      <OnboardingLayout
        step={4}
        onBack={() => backFrom(ONBOARDING_ROUTES.plan)}
        footer={null}
      >
        <div className="flex flex-col flex-1 min-h-0 gap-2">
          <div className="text-center shrink-0">
            <h1 className="text-xl font-black text-gray-900">Choose your plan</h1>
            <p className="text-sm text-gray-500 mt-0.5">Pick the plan that fits you</p>
          </div>

          <div className="flex items-center justify-center gap-2 shrink-0">
            <div className="inline-flex rounded-full bg-gray-100 p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => patch({ billingPeriod: 'month' })}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  billingPeriod === 'month' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => patch({ billingPeriod: 'year' })}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  billingPeriod === 'year' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                Annual
                {maxSaving > 0 && (
                  <span className="ml-1 text-[#1A9E6D]">Save {maxSaving}%</span>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 space-y-2">
            {plans.map((plan) => {
              const { price, suffix } = formatPlanPrice(plan, billingPeriod);
              const selected = state.planId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border-2 bg-white p-3 transition-all ${
                    selected ? 'border-[#1A9E6D] shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      {plan.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-[#1A9E6D] px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                      <p className="font-black text-gray-900">{plan.name}</p>
                      <p className="text-sm font-bold text-gray-900">
                        {price}
                        <span className="text-xs font-normal text-gray-500">{suffix}</span>
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-0.5 mb-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-tight">
                        <Check className="w-3 h-3 shrink-0 mt-0.5 text-[#1A9E6D]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    className={`w-full h-9 text-xs font-bold ${
                      plan.id === 'county' || plan.ctaAction === 'trial'
                        ? 'bg-[#1A9E6D] hover:bg-[#158f63] text-white'
                        : plan.ctaAction === 'apply'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-white border-2 border-[#1A9E6D] text-[#1A9E6D] hover:bg-green-50'
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.cta}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </OnboardingLayout>

      <PressPassVerificationDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        outletName={state.mediaOutletName}
        verificationInfo={state.mediaVerificationInfo}
        onOutletNameChange={(v) => patch({ mediaOutletName: v })}
        onVerificationInfoChange={(v) => patch({ mediaVerificationInfo: v })}
        onSubmit={handleVerificationSubmit}
      />
    </>
  );
}
