import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ACCOUNT_TYPE_OPTIONS,
  ONBOARDING_SPORTS,
  SIGNUP_PLAN_OPTIONS,
  getPlanById,
  defaultPlanForAccount,
  isSignupPlanDisabled,
  PAID_TRIAL_NOTE,
  FREE_PLAN_NOTE,
  MEDIA_NO_TRIAL_NOTICE,
  CONTACT_EMAIL,
} from '@/lib/planConfig';
import {
  buildSignupUrl,
  formatSignupSummary,
  SIGNUP_FUNNEL_STEPS,
} from '@/lib/signupFlow';
import { Button } from '@/components/ui/button';
import ClubReporterLogo from '@/components/ClubReporterLogo';
import { BRAND } from '@/lib/brandConfig';

const SPORT_ACCENTS = {
  gaa: BRAND.gaa.color,
  soccer: BRAND.soccer.color,
  rugby: BRAND.rugby.color,
};

function StepHeading({ step, title }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-black text-white">
        {step}
      </span>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );
}

function PaymentTrialNotice({ plan, profileType }) {
  const isPaidTrial = plan === 'club' || plan === 'county';
  const isMedia = plan === 'presspass' || profileType === 'media';
  const isFree = plan === 'free';

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
      <p className="text-sm font-bold text-gray-900">Payment / Trial Notice</p>
      <ul className="text-sm text-gray-600 space-y-1.5 list-none">
        <li className={isPaidTrial ? 'font-semibold text-gray-900' : ''}>
          {PAID_TRIAL_NOTE}
        </li>
        <li className={isMedia ? 'font-semibold text-amber-900' : ''}>
          {MEDIA_NO_TRIAL_NOTICE}
        </li>
        {isFree && (
          <li className="font-semibold text-gray-900">{FREE_PLAN_NOTE}</li>
        )}
      </ul>
      {isMedia && (
        <p className="text-xs text-gray-500 pt-1">
          Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-green-700 underline">
            {CONTACT_EMAIL}
          </a>{' '}
          after signup to activate your Media account.
        </p>
      )}
    </div>
  );
}

export default function GetStarted() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);

  const [primarySport, setPrimarySport] = useState(searchParams.get('sport') || '');
  const [profileType, setProfileType] = useState(
    searchParams.get('account') === 'media'
      ? 'media'
      : searchParams.get('account') === 'fan'
        ? 'fan'
        : searchParams.get('account') === 'club'
          ? 'club'
          : ''
  );
  const [plan, setPlan] = useState(
    defaultPlanForAccount(
      searchParams.get('account') === 'media' ? 'media' : searchParams.get('account') || '',
      searchParams.get('plan')
    )
  );

  const steps = SIGNUP_FUNNEL_STEPS;
  const totalSteps = steps.length;
  const currentKey = steps[step - 1]?.key;
  const stepTitle = steps[step - 1]?.title ?? '';
  const accent =
    profileType === 'media'
      ? BRAND.media.color
      : SPORT_ACCENTS[primarySport] || BRAND.gaa.color;

  useEffect(() => {
    document.title = `ClubReporter – Get started (Step ${step})`;
    return () => {
      document.title = 'ClubReporter – Match Reporting for Clubs';
    };
  }, [step]);

  useEffect(() => {
    const sport = searchParams.get('sport');
    const account = searchParams.get('account');
    const planParam = searchParams.get('plan');

    if (sport && ONBOARDING_SPORTS.some((s) => s.id === sport)) setPrimarySport(sport);
    if (account === 'media') setProfileType('media');
    else if (account === 'fan') setProfileType('fan');
    else if (account === 'club') setProfileType('club');
    if (account === 'media') setPlan('presspass');
    else if (planParam) setPlan(defaultPlanForAccount(account || 'club', planParam));
  }, [searchParams]);

  const handleAccountType = (id) => {
    setProfileType(id);
    setPlan(defaultPlanForAccount(id, plan));
  };

  const handlePlanSelect = (planId) => {
    if (isSignupPlanDisabled(planId, profileType)) return;
    setPlan(planId);
    if (planId === 'presspass') setProfileType('media');
    else if (profileType === 'media') setProfileType('fan');
  };

  const canProceed = () => {
    if (currentKey === 'sport') return Boolean(primarySport);
    if (currentKey === 'account') return Boolean(profileType);
    if (currentKey === 'plan') return Boolean(plan) && !isSignupPlanDisabled(plan, profileType);
    return false;
  };

  const goNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else {
      navigate(
        buildSignupUrl({
          sport: primarySport,
          account: profileType,
          plan,
        })
      );
    }
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const summary = formatSignupSummary({
    sport: primarySport,
    account: profileType,
    plan,
  });

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#e8f2f0] to-white flex flex-col">
      <nav className="px-4 py-3 border-b border-gray-100 bg-white/95">
        <ClubReporterLogo className="h-9 w-auto max-w-[180px]" />
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-gray-900">Get started with ClubReporter</h1>
            <p className="text-gray-500 text-sm mt-1">
              Step {step} of {totalSteps} — {stepTitle}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => {
              const n = i + 1;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                      step >= n ? 'text-white' : 'text-gray-400 bg-gray-200'
                    }`}
                    style={step >= n ? { backgroundColor: accent } : undefined}
                  >
                    {n}
                  </div>
                  {n < totalSteps && (
                    <div
                      className={`h-0.5 w-6 sm:w-10 rounded-full ${step > n ? '' : 'bg-gray-200'}`}
                      style={step > n ? { backgroundColor: accent } : undefined}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            {currentKey === 'sport' && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
                <StepHeading step={step} title="Choose Sport" />
                <div className="grid sm:grid-cols-3 gap-3">
                  {ONBOARDING_SPORTS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPrimarySport(opt.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        primarySport === opt.id
                          ? 'bg-green-50 border-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900">
                        {opt.emoji} {opt.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {currentKey === 'account' && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
                <StepHeading step={step} title="Choose Account Type" />
                <div className="grid sm:grid-cols-3 gap-3">
                  {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleAccountType(opt.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        profileType === opt.id
                          ? 'border-green-700 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900">
                        {opt.emoji} {opt.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {currentKey === 'plan' && (
              <section className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
                  <StepHeading step={step} title="Choose Plan" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SIGNUP_PLAN_OPTIONS.map(({ id, label }) => {
                      const planDef = getPlanById(id);
                      const disabled = !profileType || isSignupPlanDisabled(id, profileType);
                      const selected = plan === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={disabled}
                          onClick={() => handlePlanSelect(id)}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            disabled
                              ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                              : selected
                                ? 'border-green-700 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-bold text-gray-900">{label}</p>
                          {planDef && (
                            <p className="text-xs text-gray-500 mt-1">
                              {planDef.price}
                              {planDef.period !== 'Forever free' ? planDef.period : ''}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <PaymentTrialNotice plan={plan} profileType={profileType} />
              </section>
            )}

            {summary && step === totalSteps && (
              <p className="text-center text-sm font-semibold text-gray-600">{summary}</p>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={goBack} className="flex-1 h-12">
                  ← Back
                </Button>
              )}
              <Button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex-1 h-12 font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                {step < totalSteps ? 'Continue →' : 'Create account →'}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
