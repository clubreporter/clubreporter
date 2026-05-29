import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateProfile } from '@/api/auth';
import { entities } from '@/api/entities';
import { createCheckoutSession } from '@/api/billing';
import { applyBrandTheme, BRAND } from '@/lib/brandConfig';
import {
  ACCOUNT_TYPE_OPTIONS,
  ONBOARDING_SPORTS,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  PAID_TRIAL_NOTE,
  FREE_PLAN_NOTE,
  plansForAccountType,
  getPlanById,
  defaultPlanForAccount,
} from '@/lib/planConfig';
import { isSignupPrefilled, formatSignupSummary } from '@/lib/signupFlow';
import PlanCard from '@/components/marketing/PlanCard';
import ClubVerificationForm from '@/components/club/ClubVerificationForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SPORT_ACCENTS = {
  gaa: BRAND.gaa.color,
  soccer: BRAND.soccer.color,
  rugby: BRAND.rugby.color,
};

function buildSteps({ isMedia, isVerifiedClub, needsCheckout, isPrefilled }) {
  if (isPrefilled) {
    const steps = [];
    if (isMedia) {
      steps.push({ key: 'media', title: 'Media verification' });
    } else if (isVerifiedClub) {
      steps.push({ key: 'club', title: 'Club details' });
      steps.push({ key: 'verify', title: 'Club verification' });
    }
    if (needsCheckout) {
      steps.push({ key: 'billing', title: 'Billing' });
    } else {
      steps.push({ key: 'finish', title: 'Get started' });
    }
    return steps;
  }

  if (isMedia) {
    return [
      { key: 'account', title: 'Account type' },
      { key: 'media', title: 'Media verification' },
      { key: 'plan', title: 'Plan' },
      { key: 'finish', title: 'Get started' },
    ];
  }

  const steps = [
    { key: 'sport', title: 'Sport' },
    { key: 'account', title: 'Account type' },
  ];

  if (isVerifiedClub) {
    steps.push({ key: 'club', title: 'Club details' });
    steps.push({ key: 'verify', title: 'Club verification' });
  }

  steps.push({ key: 'plan', title: 'Plan' });

  if (needsCheckout) {
    steps.push({ key: 'billing', title: 'Billing' });
  }

  return steps;
}

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

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [primarySport, setPrimarySport] = useState(searchParams.get('sport') || '');
  const [profileType, setProfileType] = useState(
    searchParams.get('account') === 'media' ? 'media' : searchParams.get('account') === 'fan' ? 'fan' : ''
  );
  const [plan, setPlan] = useState(
    defaultPlanForAccount(
      searchParams.get('account') === 'media' ? 'media' : '',
      searchParams.get('plan')
    )
  );
  const [billing, setBilling] = useState('month');
  const [clubName, setClubName] = useState('');
  const [clubCounty, setClubCounty] = useState('');
  const [mediaOutletName, setMediaOutletName] = useState('');
  const [mediaVerificationInfo, setMediaVerificationInfo] = useState('');
  const [clubRecord, setClubRecord] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isMedia = profileType === 'media';
  const isVerifiedClub = profileType === 'club';
  const selectedPlan = getPlanById(plan);
  const visiblePlans = profileType ? plansForAccountType(profileType) : [];
  const accent = isMedia ? BRAND.media.color : (SPORT_ACCENTS[primarySport] || BRAND.gaa.color);
  const needsCheckout = selectedPlan?.ctaAction === 'trial';
  const isContactPlan = selectedPlan?.ctaAction === 'contact';
  const isFreePlan = selectedPlan?.ctaAction === 'free';

  const isPrefilled = isSignupPrefilled({
    sport: primarySport,
    account: profileType,
    plan,
  });

  const steps = useMemo(
    () => buildSteps({ isMedia, isVerifiedClub, needsCheckout, isPrefilled }),
    [isMedia, isVerifiedClub, needsCheckout, isPrefilled]
  );
  const totalSteps = steps.length;
  const currentStep = steps[step - 1];
  const currentKey = currentStep?.key;

  useEffect(() => {
    document.title = `ClubReporter – Set up your account (Step ${step})`;
    return () => {
      document.title = 'ClubReporter – Match Reporting for Clubs';
    };
  }, [step]);

  useEffect(() => {
    if (step > totalSteps) setStep(totalSteps);
  }, [step, totalSteps]);

  useEffect(() => {
    if (primarySport && !isMedia) applyBrandTheme(primarySport);
    if (isMedia) applyBrandTheme('media');
  }, [primarySport, isMedia]);

  useEffect(() => {
    const sport = searchParams.get('sport');
    const account = searchParams.get('account');
    const planParam = searchParams.get('plan');

    if (account === 'media') setProfileType('media');
    else if (account === 'fan') setProfileType('fan');
    else if (account === 'club') setProfileType('club');

    if (sport && ONBOARDING_SPORTS.some((s) => s.id === sport)) {
      setPrimarySport(sport);
    }

    if (account === 'media') setPlan('presspass');
    else if (planParam) {
      setPlan(defaultPlanForAccount(account === 'media' ? 'media' : account || 'club', planParam));
    }

    if (searchParams.get('checkout') === 'cancelled') {
      setError('Checkout was cancelled. You can try again or continue on the Free plan.');
    }
  }, [searchParams]);

  const handleAccountType = (id) => {
    setProfileType(id);
    setPlan(defaultPlanForAccount(id, plan));
    setError('');
  };

  const saveProgress = async (extra = {}) => {
    const data = {
      profileType,
      subscriptionPlan: plan,
      ...extra,
    };

    if (profileType === 'media') {
      data.primarySport = 'media';
      data.mediaOutletName = mediaOutletName;
      data.mediaVerificationInfo = mediaVerificationInfo;
      data.subscriptionStatus = 'incomplete';
    } else {
      data.primarySport = primarySport;
      if (plan === 'free') {
        data.subscriptionStatus = 'active';
      }
    }

    await updateProfile(data);
  };

  const finishSetup = async () => {
    await saveProgress();
    if (isVerifiedClub && clubName.trim()) {
      const existing = await entities.Club.list();
      if (!existing.length) {
        const created = await entities.Club.create({
          name: clubName.trim(),
          county: clubCounty.trim() || undefined,
        });
        setClubRecord(created);
      }
    }
  };

  const persistClubProfile = async () => {
    if (!isVerifiedClub || !clubName.trim()) return;
    const existing = await entities.Club.list();
    if (!existing.length) {
      const created = await entities.Club.create({
        name: clubName.trim(),
        county: clubCounty.trim() || undefined,
      });
      setClubRecord(created);
    } else {
      const updated = await entities.Club.update(existing[0].id, {
        name: clubName.trim(),
        county: clubCounty.trim() || undefined,
      });
      setClubRecord(updated);
    }
  };

  useEffect(() => {
    if (currentKey === 'verify') {
      entities.Club.list().then((clubs) => setClubRecord(clubs[0] || null));
    }
  }, [currentKey]);

  const canProceedFromStep = () => {
    switch (currentKey) {
      case 'sport':
        return Boolean(primarySport);
      case 'account':
        return Boolean(profileType);
      case 'club':
        return Boolean(clubName.trim());
      case 'media':
        return Boolean(mediaOutletName.trim() && mediaVerificationInfo.trim());
      case 'plan':
        return Boolean(plan);
      case 'verify':
      case 'billing':
      case 'finish':
        return true;
      default:
        return false;
    }
  };

  const handleContinue = async () => {
    setError('');

    const shouldSubmit = currentKey === 'billing' || currentKey === 'finish' || step === totalSteps;

    if (!shouldSubmit) {
      if (!canProceedFromStep()) return;
      if (currentKey === 'club') {
        try {
          await persistClubProfile();
        } catch (e) {
          setError(e.message || 'Could not save club details.');
          return;
        }
      }
      setStep((s) => Math.min(s + 1, totalSteps));
      return;
    }

    if (!canProceedFromStep()) return;

    setBusy(true);
    let redirecting = false;

    try {
      await finishSetup();

      if (isContactPlan) {
        window.open(CONTACT_MAILTO, '_blank', 'noopener,noreferrer');
        navigate('/dashboard?welcome=1');
        return;
      }

      if (isFreePlan) {
        navigate('/dashboard?welcome=1');
        return;
      }

      const res = await createCheckoutSession({
        plan,
        billing,
        clubName: clubName.trim() || mediaOutletName.trim(),
      });

      if (res?.url) {
        redirecting = true;
        window.location.href = res.url;
        return;
      }

      if (res?.trialStarted) {
        navigate('/dashboard?welcome=1');
        return;
      }

      setError(res?.error || 'Could not start checkout. Please try again or choose the Free plan.');
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      if (!redirecting) setBusy(false);
    }
  };

  const primaryButtonLabel = () => {
    if (busy) return 'Please wait…';
    const isFinal = step === totalSteps;
    if (isFinal && isContactPlan) return 'Contact Us';
    if (isFinal && isFreePlan) return 'Start Free →';
    if (currentKey === 'billing' || (isFinal && needsCheckout)) return 'Start 14-Day Trial →';
    return 'Continue →';
  };

  const skipToApp = async () => {
    setBusy(true);
    setError('');
    const previousPlan = plan;
    try {
      setPlan('free');
      await updateProfile({
        profileType: profileType || 'fan',
        primarySport: isMedia ? 'media' : primarySport,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        ...(isMedia ? { mediaOutletName, mediaVerificationInfo } : {}),
      });
      if (isVerifiedClub && clubName.trim()) {
        const existing = await entities.Club.list();
        if (!existing.length) {
          await entities.Club.create({
            name: clubName.trim(),
            county: clubCounty.trim() || undefined,
          });
        }
      }
      navigate('/dashboard?welcome=1');
    } catch (e) {
      setPlan(previousPlan);
      setError(e.message || 'Could not continue. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const goBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const showSkip =
    currentKey === 'plan' ||
    currentKey === 'billing' ||
    (currentKey === 'finish' && !isContactPlan);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-black text-lg"
            style={{ backgroundColor: accent }}
          >
            CR
          </div>
          <h1 className="text-2xl font-black text-gray-900">ClubReporter</h1>
          <p className="text-gray-500 text-sm mt-1">
            Step {step} of {totalSteps}
            {currentStep?.title ? ` — ${currentStep.title}` : ''}
          </p>
          {isPrefilled && (
            <p className="text-xs font-semibold text-gray-600 mt-2">
              {formatSignupSummary({
                sport: isMedia ? undefined : primarySport,
                account: profileType,
                plan,
              })}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => {
            const n = i + 1;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= n ? 'text-white' : 'text-gray-400 bg-gray-200'
                  }`}
                  style={step >= n ? { backgroundColor: accent } : undefined}
                  aria-label={`Step ${n}: ${s.title}`}
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

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2.5 mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-6">
          {currentKey === 'sport' && !isPrefilled && (
            <section className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <StepHeading step={step} title="Sport" />
              <p className="text-sm text-gray-500">Which sport will you report on most often?</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {ONBOARDING_SPORTS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={busy}
                    onClick={() => setPrimarySport(opt.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      primarySport === opt.id ? 'bg-green-50 border-green-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">{opt.emoji} {opt.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {currentKey === 'account' && !isPrefilled && (
            <section className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <StepHeading step={step} title="Account type" />
              <p className="text-sm text-gray-500">How will you use ClubReporter?</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={busy}
                    onClick={() => handleAccountType(opt.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      profileType === opt.id ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">{opt.emoji} {opt.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {currentKey === 'club' && (
            <section className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <StepHeading step={step} title="Club details" />
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Club name *</label>
                <Input
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="e.g. Barryroe GAA"
                  className="h-11"
                  disabled={busy}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">County</label>
                <Input
                  value={clubCounty}
                  onChange={(e) => setClubCounty(e.target.value)}
                  placeholder="e.g. Cork"
                  className="h-11"
                  disabled={busy}
                />
              </div>
            </section>
          )}

          {currentKey === 'media' && (
            <section className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <StepHeading step={step} title="Media verification" />
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Media outlet name *</label>
                <Input
                  value={mediaOutletName}
                  onChange={(e) => setMediaOutletName(e.target.value)}
                  placeholder="e.g. Southern Star"
                  className="h-11"
                  disabled={busy}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Website or social media *</label>
                <Input
                  value={mediaVerificationInfo}
                  onChange={(e) => setMediaVerificationInfo(e.target.value)}
                  placeholder="southernstar.ie or @southernstar"
                  className="h-11"
                  disabled={busy}
                />
              </div>
              <p className="text-xs text-gray-500">We review Press Pass applications within 24 hours.</p>
            </section>
          )}

          {currentKey === 'plan' && !isPrefilled && (
            <section className="space-y-4">
              <div className="px-1">
                <StepHeading step={step} title="Plan" />
                <p className="text-sm text-gray-500 mt-2">Choose the plan that suits you best.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {visiblePlans.map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={plan === p.id}
                    onSelect={setPlan}
                    accent={accent}
                    compact={false}
                    showFeatures
                    showCta={false}
                    disabled={busy || (isMedia && p.id !== 'presspass')}
                  />
                ))}
              </div>
            </section>
          )}

          {currentKey === 'verify' && (
            <section className="space-y-4">
              <div className="px-1">
                <StepHeading step={step} title="Club verification" />
                <p className="text-sm text-gray-500 mt-2">
                  Submit proof or use a one-time invite link. You can also verify later from My Club.
                </p>
              </div>
              <ClubVerificationForm
                club={clubRecord}
                compact
                showSkip
                onSkip={() => setStep((s) => Math.min(s + 1, totalSteps))}
                onSuccess={(updated) => {
                  setClubRecord((c) => ({ ...c, ...updated }));
                  setStep((s) => Math.min(s + 1, totalSteps));
                }}
              />
              {step > 1 && (
                <Button variant="outline" onClick={goBack} className="w-full" disabled={busy}>
                  ← Back
                </Button>
              )}
            </section>
          )}

          {currentKey === 'billing' && (
            <section className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <StepHeading step={step} title="Billing cycle" />
              <div className="grid grid-cols-2 gap-3">
                {['month', 'year'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    disabled={busy}
                    onClick={() => setBilling(b)}
                    className={`rounded-xl border-2 p-3 text-left ${
                      billing === b ? 'border-green-700 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <p className="font-bold">{b === 'month' ? 'Monthly' : 'Annual'}</p>
                    <p className="text-sm text-gray-500">
                      €{b === 'month' ? selectedPlan.month : selectedPlan.year}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-2xl font-black" style={{ color: accent }}>
                €{billing === 'month' ? selectedPlan.month : selectedPlan.year}
              </p>
              <p className="text-xs text-gray-500">{PAID_TRIAL_NOTE}</p>
            </section>
          )}

          {currentKey === 'finish' && (
            <section className="bg-white rounded-2xl border p-5 sm:p-6 space-y-4">
              <StepHeading step={step} title="Get started" />
              <p className="text-sm text-gray-600">
                You selected <strong>{selectedPlan.name}</strong>
                {isVerifiedClub && clubName ? ` for ${clubName}` : ''}.
              </p>

              {isFreePlan && <p className="text-sm text-gray-500">{FREE_PLAN_NOTE}</p>}

              {isContactPlan && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 space-y-1">
                  <p className="font-semibold">No trial available for Media accounts.</p>
                  <p>
                    Please contact us at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
                      {CONTACT_EMAIL}
                    </a>{' '}
                    to activate Press Pass.
                  </p>
                </div>
              )}

              {needsCheckout && (
                <p className="text-sm text-gray-500">{PAID_TRIAL_NOTE}</p>
              )}
            </section>
          )}

          {currentKey !== 'verify' && (
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={goBack} className="flex-1 h-12" disabled={busy}>
                ← Back
              </Button>
            )}
            <Button
              onClick={handleContinue}
              disabled={!canProceedFromStep() || busy}
              className="flex-1 h-12 font-bold text-white text-base"
              style={{ backgroundColor: accent }}
            >
              {primaryButtonLabel()}
            </Button>
          </div>
          )}

          {currentKey !== 'verify' && showSkip && (
            <button
              type="button"
              onClick={skipToApp}
              disabled={busy}
              className="w-full text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              Skip for now — explore first
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
