import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateProfile } from '@/api/auth';
import { entities } from '@/api/entities';
import { createCheckoutSession } from '@/api/billing';
import { applyBrandTheme, BRAND } from '@/lib/brandConfig';
import { PRIMARY_SPORT_OPTIONS } from '@/lib/sportConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PLANS = [
  { id: 'club', name: 'Club', month: 4.99, year: 44.99, badge: '14-DAY FREE TRIAL', badgeColor: 'bg-green-600', borderSel: 'border-green-700', bgSel: 'bg-green-50', features: ['Unlimited matches', 'Saved roster', 'Photo uploads', 'Sponsor on reports', 'Push notifications'] },
  { id: 'county', name: 'County', month: 12.99, year: 119.99, badge: 'MOST POPULAR', badgeColor: 'bg-green-700', borderSel: 'border-green-700', bgSel: 'bg-green-50', features: ['Everything in Club', 'AI newspaper reports', 'Multiple admins', 'Analytics', 'Social media push'] },
  { id: 'presspass', name: 'Press Pass', month: 34.99, year: 299.99, badge: 'FOR MEDIA', badgeColor: 'bg-amber-600', borderSel: 'border-amber-500', bgSel: 'bg-amber-50', features: ['Everything in County', 'Media profile', 'Unlimited clubs', 'Verified press badge'] },
];

const SPORT_BRAND = {
  gaa: BRAND.gaa,
  soccer: BRAND.soccer,
  rugby: BRAND.rugby,
  multi: { ...BRAND.gaa, product: 'ClubReporter' },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState(searchParams.get('account') === 'media' ? 'media' : '');
  const [primarySport, setPrimarySport] = useState(searchParams.get('sport') || '');
  const [clubName, setClubName] = useState('');
  const [clubCounty, setClubCounty] = useState('');
  const [mediaOutletName, setMediaOutletName] = useState('');
  const [mediaVerificationInfo, setMediaVerificationInfo] = useState('');
  const [plan, setPlan] = useState(profileType === 'media' ? 'presspass' : 'club');
  const [billing, setBilling] = useState('month');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isMedia = profileType === 'media';
  const totalSteps = isMedia ? 4 : 5;

  const brand = isMedia ? BRAND.media : (SPORT_BRAND[primarySport] || BRAND.gaa);

  useEffect(() => {
    if (primarySport && !isMedia) applyBrandTheme(primarySport);
    if (isMedia) applyBrandTheme('media');
  }, [primarySport, isMedia]);

  useEffect(() => {
    const sport = searchParams.get('sport');
    const account = searchParams.get('account');
    if (account === 'media') {
      setProfileType('media');
      setPlan('presspass');
    }
    if (sport && ['gaa', 'soccer', 'rugby', 'multi'].includes(sport)) {
      setPrimarySport(sport);
    }
  }, [searchParams]);

  const saveProgress = async (extra = {}) => {
    const data = { profileType, ...extra };
    if (profileType === 'media') {
      data.primarySport = 'media';
      data.mediaOutletName = mediaOutletName;
      data.mediaVerificationInfo = mediaVerificationInfo;
    } else if (primarySport) {
      data.primarySport = primarySport;
    }
    await updateProfile(data);
  };

  const finishClubSetup = async () => {
    setSaving(true);
    await saveProgress();
    if (clubName.trim()) {
      const existing = await entities.Club.list();
      if (!existing.length) {
        await entities.Club.create({ name: clubName.trim(), county: clubCounty.trim() || undefined });
      }
    }
    setSaving(false);
  };

  const startCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await createCheckoutSession({ plan, billing });
      if (res?.url) window.location.href = res.url;
      else if (res?.error?.includes('trial')) navigate('/dashboard?welcome=1');
      else { setError(res?.error || 'Could not create checkout session.'); setLoading(false); }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const skipToApp = async () => {
    await finishClubSetup();
    navigate('/dashboard');
  };

  const accent = brand.color || BRAND.gaa.color;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-black text-lg" style={{ backgroundColor: accent }}>
            {brand.motif || 'CR'}
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            {isMedia ? 'Press Pass' : brand.product || 'ClubReporter.ie'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Set up your account in a few steps</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all ${step >= s ? 'w-8' : 'w-4'}`} style={{ backgroundColor: step >= s ? accent : '#e5e7eb' }} />
          ))}
        </div>

        {/* Step 1: Account type */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 text-center">What type of account?</h2>
            {[
              { id: 'club', emoji: '🏆', title: 'Club account', desc: 'Report for a GAA, soccer or rugby club' },
              { id: 'media', emoji: '📰', title: 'Media account', desc: 'Cover multiple clubs as a journalist or outlet' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setProfileType(opt.id); if (opt.id === 'media') setPlan('presspass'); }}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${profileType === opt.id ? 'bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                style={profileType === opt.id ? { borderColor: accent } : undefined}
              >
                <p className="font-bold text-gray-900">{opt.emoji} {opt.title}</p>
                <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
              </button>
            ))}
            <Button onClick={() => setStep(2)} disabled={!profileType} className="w-full h-12 font-bold text-white" style={{ backgroundColor: accent }}>
              Continue →
            </Button>
          </div>
        )}

        {/* Step 2: Sport (club) or Media verification */}
        {step === 2 && !isMedia && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 text-center">What sport?</h2>
            {PRIMARY_SPORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPrimarySport(opt.id)}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${primarySport === opt.id ? 'bg-white' : 'border-gray-200 bg-white'}`}
                style={primarySport === opt.id ? { borderColor: SPORT_BRAND[opt.id]?.color || accent } : undefined}
              >
                <p className="font-bold text-gray-900">{opt.emoji} {opt.label}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: SPORT_BRAND[opt.id]?.color }}>{opt.brand}</p>
                <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
              </button>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">← Back</Button>
              <Button onClick={() => setStep(3)} disabled={!primarySport} className="flex-1 h-11 font-bold text-white" style={{ backgroundColor: accent }}>Continue →</Button>
            </div>
          </div>
        )}

        {step === 2 && isMedia && (
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Media verification</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Media outlet name *</label>
              <Input value={mediaOutletName} onChange={(e) => setMediaOutletName(e.target.value)} placeholder="e.g. Southern Star" className="h-11" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Website or social media *</label>
              <Input value={mediaVerificationInfo} onChange={(e) => setMediaVerificationInfo(e.target.value)} placeholder="southernstar.ie or @southernstar" className="h-11" />
            </div>
            <p className="text-xs text-gray-500">We review applications within 24 hours. Full access starts immediately.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Button>
              <Button onClick={() => setStep(3)} disabled={!mediaOutletName.trim() || !mediaVerificationInfo.trim()} className="flex-1 font-bold text-white" style={{ backgroundColor: accent }}>Continue →</Button>
            </div>
          </div>
        )}

        {/* Step 3: Club details (club) or Plan (media) */}
        {step === 3 && !isMedia && (
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Your club details</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Club name *</label>
              <Input value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="e.g. Barryroe GAA" className="h-11" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">County</label>
              <Input value={clubCounty} onChange={(e) => setClubCounty(e.target.value)} placeholder="e.g. Cork" className="h-11" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Back</Button>
              <Button onClick={() => setStep(4)} disabled={!clubName.trim()} className="flex-1 font-bold text-white" style={{ backgroundColor: accent }}>Continue →</Button>
            </div>
          </div>
        )}

        {step === 3 && isMedia && (
          <PlanStep plans={PLANS} plan={plan} setPlan={setPlan} accent={accent} onBack={() => setStep(2)} onContinue={() => setStep(4)} />
        )}

        {step === 4 && !isMedia && (
          <PlanStep plans={PLANS.filter((p) => p.id !== 'presspass')} plan={plan} setPlan={setPlan} accent={accent} onBack={() => setStep(3)} onContinue={() => setStep(5)} />
        )}

        {/* Checkout — step 4 media, step 5 club */}
        {((step === 4 && isMedia) || (step === 5 && !isMedia)) && (
          <CheckoutStep
            plan={PLANS.find((p) => p.id === plan)}
            billing={billing}
            setBilling={setBilling}
            accent={accent}
            error={error}
            loading={loading || saving}
            onBack={() => setStep(isMedia ? 3 : 4)}
            onCheckout={async () => { await finishClubSetup(); await startCheckout(); }}
            onSkip={skipToApp}
            isClub={plan === 'club'}
          />
        )}
      </div>
    </div>
  );
}

function PlanStep({ plans, plan, setPlan, accent, onBack, onContinue }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 text-center">Choose your plan</h2>
      {plans.map((p) => (
        <button key={p.id} type="button" onClick={() => setPlan(p.id)} className={`w-full text-left rounded-2xl border-2 p-5 ${plan === p.id ? p.bgSel : 'border-gray-200 bg-white'}`} style={plan === p.id ? { borderColor: accent } : undefined}>
          <p className="font-bold">{p.name} — €{p.month}/mo</p>
        </button>
      ))}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={onContinue} className="flex-1 font-bold text-white" style={{ backgroundColor: accent }}>Continue →</Button>
      </div>
    </div>
  );
}

function CheckoutStep({ plan, billing, setBilling, accent, error, loading, onBack, onCheckout, onSkip, isClub }) {
  const price = billing === 'month' ? plan?.month : plan?.year;
  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <h2 className="text-lg font-bold">Billing cycle</h2>
      <div className="grid grid-cols-2 gap-3">
        {['month', 'year'].map((b) => (
          <button key={b} type="button" onClick={() => setBilling(b)} className={`rounded-xl border-2 p-3 text-left ${billing === b ? 'border-green-700 bg-green-50' : 'border-gray-200'}`}>
            <p className="font-bold capitalize">{b === 'month' ? 'Monthly' : 'Annual'}</p>
            <p className="text-sm text-gray-500">€{b === 'month' ? plan?.month : plan?.year}</p>
          </button>
        ))}
      </div>
      <p className="text-2xl font-black" style={{ color: accent }}>€{price}</p>
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={onCheckout} disabled={loading} className="flex-1 font-bold text-white" style={{ backgroundColor: accent }}>
          {loading ? 'Please wait…' : isClub ? 'Start Free Trial →' : 'Pay with Stripe →'}
        </Button>
      </div>
      <button type="button" onClick={onSkip} className="w-full text-sm text-gray-400 hover:text-gray-600">Skip for now — explore first</button>
    </div>
  );
}
