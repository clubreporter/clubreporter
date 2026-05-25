import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '@/api/auth';
import { createCheckoutSession } from '@/api/billing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PLANS = [
  {
    id: 'club',
    name: 'Club',
    month: 4.99,
    year: 44.99,
    badge: '14-DAY FREE TRIAL',
    badgeColor: 'bg-green-600',
    borderSel: 'border-green-700',
    bgSel: 'bg-green-50',
    features: [
      'Create matches',
      'Add line-ups manually',
      'Record match incidents & timeline',
      'Generate basic match report',
      'View and edit fixtures',
      'Basic squad management',
    ],
  },
  {
    id: 'county',
    name: 'County',
    month: 12.99,
    year: 119.99,
    badge: 'MOST POPULAR',
    badgeColor: 'bg-green-700',
    borderSel: 'border-green-700',
    bgSel: 'bg-green-50',
    features: [
      'Everything in Club',
      'Club profile with logo & colours',
      'Photo uploads in match timeline',
      'Full match history',
      'Social media links',
      'Advanced report editing',
      'AI newspaper-style reports',
      'Multiple admin users',
      'Sponsor management',
      'Push notifications to followers',
    ],
  },
  {
    id: 'presspass',
    name: 'Press Pass',
    month: 34.99,
    year: 299.99,
    badge: 'FOR MEDIA',
    badgeColor: 'bg-blue-600',
    borderSel: 'border-blue-600',
    bgSel: 'bg-blue-50',
    features: [
      'Everything in County',
      'Media profile instead of club profile',
      'Cover multiple clubs & sports',
      'Link reports to media website',
      'Attribution of reports to media outlet',
      'Verified press badge on profile',
    ],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState('');
  const [mediaOutletName, setMediaOutletName] = useState('');
  const [mediaVerificationInfo, setMediaVerificationInfo] = useState('');
  const [plan, setPlan] = useState('club');
  const [billing, setBilling] = useState('month');
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = profileType === 'media' ? 4 : 3;
  const planStep = profileType === 'media' ? 3 : 2;
  const checkoutStep = profileType === 'media' ? 4 : 3;

  const inIframe = () => {
    try { return window.self !== window.top; } catch { return true; }
  };

  const saveProfileType = async () => {
    setSavingProfile(true);
    const data = { profileType };
    if (profileType === 'media') {
      data.mediaOutletName = mediaOutletName;
      data.mediaVerificationInfo = mediaVerificationInfo;
    }
    await updateProfile(data);
    setSavingProfile(false);
  };

  const startCheckout = async () => {
    if (inIframe()) {
      alert('Checkout only works from the published app, not the preview. Please open your published app URL.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createCheckoutSession({ plan, billing });
      if (res?.url) {
        window.location.href = res.url;
      } else if (res?.error?.includes('trial is active')) {
        navigate('/dashboard?welcome=1');
      } else {
        setError(res?.error || 'Could not create checkout session.');
        setLoading(false);
      }
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  const skipForNow = async () => {
    await saveProfileType();
    navigate('/dashboard');
  };

  const selectedPlan = PLANS.find(p => p.id === plan);
  const price = billing === 'month' ? selectedPlan?.month : selectedPlan?.year;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <img
            src="https://media.base44.com/images/public/6a11bfdd862d168224f11e9c/cdfa87210_ClubReporterieLogoDesign.png"
            alt="ClubReporter"
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
          <h1 className="text-2xl font-black text-gray-900">Welcome to ClubReporter.ie</h1>
          <p className="text-gray-500 text-sm mt-1">Let's get you set up in a few quick steps</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps || 3 }, (_, i) => i + 1).map(s => (
            <div key={s} className={`h-2 rounded-full transition-all ${step >= s ? 'bg-green-700 w-8' : 'bg-gray-200 w-4'}`} />
          ))}
        </div>

        {/* Step 1: Profile Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold text-gray-900">How will you use ClubReporter?</h2>
              <p className="text-sm text-gray-500 mt-1">Choose the option that best describes you</p>
            </div>
            {[
              { id: 'club', emoji: '🏆', title: 'Club Reporter', desc: 'You report for a single GAA or sports club — PRO, manager, or volunteer' },
              { id: 'media', emoji: '📰', title: 'Media Reporter', desc: 'You cover multiple clubs or report for a newspaper, website, or media outlet' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setProfileType(opt.id)}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                  profileType === opt.id ? 'border-green-700 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                    profileType === opt.id ? 'border-green-700 bg-green-700' : 'border-gray-300'
                  }`}>
                    {profileType === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{opt.emoji} {opt.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              </button>
            ))}
            <Button onClick={() => setStep(2)} disabled={!profileType} className="w-full h-12 text-base font-bold bg-green-700 hover:bg-green-800 mt-2">
              Continue →
            </Button>
          </div>
        )}

        {/* Step 2 (media only): Verification */}
        {step === 2 && profileType === 'media' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Media Verification</h2>
              <p className="text-sm text-gray-500">Help us verify your media credentials.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Media Outlet / Website Name *</label>
                <Input value={mediaOutletName} onChange={e => setMediaOutletName(e.target.value)} placeholder="e.g. Cork GAA Gazette" className="text-base h-11" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Social Media Page Link or Media Email</label>
                <Input value={mediaVerificationInfo} onChange={e => setMediaVerificationInfo(e.target.value)} placeholder="twitter.com/yourpage  or  editor@gazette.ie" className="text-base h-11" />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              Your details are reviewed by our team within 24 hours. You'll have full Press Pass access immediately after signing up.
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">← Back</Button>
              <Button onClick={() => setStep(3)} disabled={!mediaOutletName.trim()} className="flex-1 h-11 font-bold bg-green-700 hover:bg-green-800">Continue →</Button>
            </div>
          </div>
        )}

        {/* Plan Selection */}
        {step === planStep && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold text-gray-900">Choose your plan</h2>
              <p className="text-sm text-gray-500 mt-1">Club includes a 14-day free trial — no card required upfront</p>
            </div>
            {PLANS.map(p => {
              const isSelected = plan === p.id;
              return (
                <button key={p.id} onClick={() => setPlan(p.id)}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${isSelected ? `${p.borderSel} ${p.bgSel}` : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? p.borderSel : 'border-gray-300'}`}>
                        {isSelected && <div className={`w-2 h-2 rounded-full ${p.badgeColor}`} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        {p.badge && <span className={`${p.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{p.badge}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-gray-900">€{p.month}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                      <p className="text-xs text-gray-400">€{p.year}/yr</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-green-600 flex-shrink-0">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(profileType === 'media' ? 2 : 1)} className="flex-1 h-11">← Back</Button>
              <Button onClick={() => setStep(checkoutStep)} className="flex-1 h-11 font-bold bg-green-700 hover:bg-green-800">Continue →</Button>
            </div>
          </div>
        )}

        {/* Billing & Checkout */}
        {step === checkoutStep && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Choose billing cycle</h2>
              <p className="text-sm text-gray-500">Annual billing saves you ~2 months.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'month', label: 'Monthly', sub: `€${selectedPlan?.month}/month` },
                { key: 'year', label: 'Annual', sub: `€${selectedPlan?.year}/year`, badge: '~2 months free' },
              ].map(b => (
                <button key={b.key} onClick={() => setBilling(b.key)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${billing === b.key ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="font-bold text-gray-900">{b.label}</p>
                  <p className="text-sm text-gray-500">{b.sub}</p>
                  {b.badge && <p className="text-xs text-green-700 font-bold mt-1">{b.badge}</p>}
                </button>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-1">
              <p className="text-sm text-gray-500">Your plan</p>
              <p className="font-bold text-gray-900">{selectedPlan?.name} · {billing === 'month' ? 'Monthly' : 'Annual'}</p>
              <p className="text-2xl font-black text-green-700">
                €{price}<span className="text-sm font-normal text-gray-500">/{billing === 'month' ? 'month' : 'year'}</span>
              </p>
              {plan === 'club' && <p className="text-xs text-green-700 font-semibold">✓ 14-day free trial — no charge today</p>}
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(planStep)} className="flex-1 h-11">← Back</Button>
              <Button
                onClick={async () => { await saveProfileType(); await startCheckout(); }}
                disabled={loading || savingProfile}
                className="flex-1 h-11 font-bold bg-green-700 hover:bg-green-800"
              >
                {loading ? 'Redirecting…' : plan === 'club' ? 'Start Free Trial →' : 'Pay with Stripe →'}
              </Button>
            </div>
            <button onClick={skipForNow} className="w-full text-center text-sm text-gray-400 hover:text-gray-600">
              Skip for now — explore first
            </button>
            <p className="text-center text-xs text-gray-400">Secured by Stripe · Cancel anytime</p>
          </div>
        )}

      </div>
    </div>
  );
}